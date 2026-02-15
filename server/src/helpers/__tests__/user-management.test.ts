import { describe, test, expect, mock, beforeEach } from "bun:test";
import {
	joinRoom,
	leaveRoom,
	getUser,
	getRoomMembers,
	isAdmin,
	getRoomPassword,
	setRoomPassword,
	addUndoPoint,
	getLastUndoPoint,
	getRoomSettings,
	_resetForTesting,
} from "../index";

const createMockSocket = (id = "socket-1") => {
	const toEmitFn = mock(() => {});
	return {
		id,
		emit: mock(() => {}),
		join: mock(() => {}),
		leave: mock(() => {}),
		to: mock(() => ({ emit: toEmitFn })),
		_toEmit: toEmitFn,
	};
};

const createMockIo = () => {
	const toEmitFn = mock(() => {});
	return {
		to: mock(() => ({ emit: toEmitFn })),
		_toEmit: toEmitFn,
	};
};

const roomId = "test-room";

beforeEach(() => {
	_resetForTesting();
});

describe("joinRoom", () => {
	test("adds user retrievable via getUser", () => {
		const socket = createMockSocket("s1") as any;
		joinRoom(socket, roomId, "Alice");
		const user = getUser("s1");
		expect(user).toBeDefined();
		expect(user?.username).toBe("Alice");
	});

	test("first user gets admin role", () => {
		const socket = createMockSocket("s1") as any;
		joinRoom(socket, roomId, "Alice");
		expect(getUser("s1")?.role).toBe("admin");
	});

	test("second user gets member role", () => {
		const s1 = createMockSocket("s1") as any;
		const s2 = createMockSocket("s2") as any;
		joinRoom(s1, roomId, "Alice");
		joinRoom(s2, roomId, "Bob");
		expect(getUser("s2")?.role).toBe("member");
	});

	test("calls socket.join with roomId", () => {
		const socket = createMockSocket("s1") as any;
		joinRoom(socket, roomId, "Alice");
		expect(socket.join).toHaveBeenCalledWith(roomId);
	});

	test("emits room-joined to the joining socket", () => {
		const socket = createMockSocket("s1") as any;
		joinRoom(socket, roomId, "Alice");
		expect(socket.emit).toHaveBeenCalledWith(
			"room-joined",
			expect.objectContaining({
				roomId,
				user: expect.objectContaining({ username: "Alice", role: "admin" }),
			}),
		);
	});

	test("emits update-members to room", () => {
		const socket = createMockSocket("s1") as any;
		joinRoom(socket, roomId, "Alice");
		expect(socket.to).toHaveBeenCalledWith(roomId);
		expect(socket._toEmit).toHaveBeenCalledWith(
			"update-members",
			expect.any(Array),
		);
	});

	test("emits system-message-from-server to room", () => {
		const socket = createMockSocket("s1") as any;
		joinRoom(socket, roomId, "Alice");
		expect(socket._toEmit).toHaveBeenCalledWith(
			"system-message-from-server",
			expect.objectContaining({
				type: "system",
				content: "Alice joined the room",
			}),
		);
	});
});

describe("getUser", () => {
	test("returns undefined for non-existent id", () => {
		expect(getUser("nonexistent")).toBeUndefined();
	});
});

describe("getRoomMembers", () => {
	test("returns empty array for empty room", () => {
		expect(getRoomMembers("empty-room")).toEqual([]);
	});

	test("returns all members in a specific room", () => {
		const s1 = createMockSocket("s1") as any;
		const s2 = createMockSocket("s2") as any;
		joinRoom(s1, roomId, "Alice");
		joinRoom(s2, roomId, "Bob");
		const members = getRoomMembers(roomId);
		expect(members).toHaveLength(2);
		expect(members.map((m) => m.username)).toContain("Alice");
		expect(members.map((m) => m.username)).toContain("Bob");
	});

	test("returns members with correct shape (id, username, role only)", () => {
		const socket = createMockSocket("s1") as any;
		joinRoom(socket, roomId, "Alice");
		const [member] = getRoomMembers(roomId);
		expect(Object.keys(member).sort()).toEqual(["id", "role", "username"]);
	});

	test("does not return users from different rooms", () => {
		const s1 = createMockSocket("s1") as any;
		const s2 = createMockSocket("s2") as any;
		joinRoom(s1, "room-a", "Alice");
		joinRoom(s2, "room-b", "Bob");
		expect(getRoomMembers("room-a")).toHaveLength(1);
		expect(getRoomMembers("room-a")[0].username).toBe("Alice");
	});
});

describe("isAdmin", () => {
	test("returns true for admin user", () => {
		const socket = createMockSocket("s1") as any;
		joinRoom(socket, roomId, "Alice");
		expect(isAdmin("s1")).toBe(true);
	});

	test("returns false for member user", () => {
		const s1 = createMockSocket("s1") as any;
		const s2 = createMockSocket("s2") as any;
		joinRoom(s1, roomId, "Alice");
		joinRoom(s2, roomId, "Bob");
		expect(isAdmin("s2")).toBe(false);
	});

	test("returns false for non-existent user", () => {
		expect(isAdmin("nonexistent")).toBe(false);
	});
});

describe("leaveRoom", () => {
	test("removes user from users", () => {
		const socket = createMockSocket("s1") as any;
		const io = createMockIo() as any;
		joinRoom(socket, roomId, "Alice");
		leaveRoom(io, socket);
		expect(getUser("s1")).toBeUndefined();
	});

	test("does nothing for unknown socket", () => {
		const socket = createMockSocket("unknown") as any;
		const io = createMockIo() as any;
		expect(() => leaveRoom(io, socket)).not.toThrow();
	});

	test("emits departure notification to room", () => {
		const socket = createMockSocket("s1") as any;
		const io = createMockIo() as any;
		joinRoom(socket, roomId, "Alice");
		socket.to.mockClear();
		socket._toEmit.mockClear();
		leaveRoom(io, socket);
		expect(socket._toEmit).toHaveBeenCalledWith(
			"send-notification",
			expect.objectContaining({ message: "Alice left your room" }),
		);
	});

	test("emits cursor-leave with socket id", () => {
		const socket = createMockSocket("s1") as any;
		const io = createMockIo() as any;
		joinRoom(socket, roomId, "Alice");
		socket._toEmit.mockClear();
		leaveRoom(io, socket);
		expect(socket._toEmit).toHaveBeenCalledWith("cursor-leave", "s1");
	});

	test("calls socket.leave with roomId", () => {
		const socket = createMockSocket("s1") as any;
		const io = createMockIo() as any;
		joinRoom(socket, roomId, "Alice");
		leaveRoom(io, socket);
		expect(socket.leave).toHaveBeenCalledWith(roomId);
	});

	test("promotes next member to admin when admin leaves", () => {
		const s1 = createMockSocket("s1") as any;
		const s2 = createMockSocket("s2") as any;
		const io = createMockIo() as any;
		joinRoom(s1, roomId, "Alice");
		joinRoom(s2, roomId, "Bob");
		leaveRoom(io, s1);
		expect(getUser("s2")?.role).toBe("admin");
	});

	test("emits role-changed to new admin", () => {
		const s1 = createMockSocket("s1") as any;
		const s2 = createMockSocket("s2") as any;
		const io = createMockIo() as any;
		joinRoom(s1, roomId, "Alice");
		joinRoom(s2, roomId, "Bob");
		leaveRoom(io, s1);
		expect(io._toEmit).toHaveBeenCalledWith("role-changed", {
			role: "admin",
		});
	});

	test("cleans up room data when last user leaves", () => {
		const socket = createMockSocket("s1") as any;
		const io = createMockIo() as any;
		joinRoom(socket, roomId, "Alice");
		setRoomPassword(roomId, "pass");
		addUndoPoint(roomId, "state-1");
		getRoomSettings(roomId);
		leaveRoom(io, socket);
		expect(getRoomPassword(roomId)).toBeUndefined();
		expect(getLastUndoPoint(roomId)).toBeUndefined();
	});
});

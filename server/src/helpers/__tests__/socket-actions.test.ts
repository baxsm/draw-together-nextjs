import { describe, test, expect, mock, beforeEach } from "bun:test";
import {
	joinRoom,
	setClientReady,
	sendCanvasState,
	sendChatState,
	sendMessage,
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

const roomId = "test-room";

beforeEach(() => {
	_resetForTesting();
});

describe("setClientReady", () => {
	test("emits client-loaded when only one member", () => {
		const socket = createMockSocket("s1") as any;
		joinRoom(socket, roomId, "Alice");
		socket.emit.mockClear();
		setClientReady(socket, roomId);
		expect(socket.emit).toHaveBeenCalledWith("client-loaded");
	});

	test("requests state from admin when multiple members", () => {
		const s1 = createMockSocket("s1") as any;
		const s2 = createMockSocket("s2") as any;
		joinRoom(s1, roomId, "Alice");
		joinRoom(s2, roomId, "Bob");
		s2._toEmit.mockClear();
		setClientReady(s2, roomId);
		expect(s2.to).toHaveBeenCalledWith("s1");
		expect(s2._toEmit).toHaveBeenCalledWith("get-canvas-state");
		expect(s2._toEmit).toHaveBeenCalledWith("get-chat-state");
	});
});

describe("sendCanvasState", () => {
	test("emits canvas state to the last member", () => {
		const s1 = createMockSocket("s1") as any;
		const s2 = createMockSocket("s2") as any;
		joinRoom(s1, roomId, "Alice");
		joinRoom(s2, roomId, "Bob");
		s1._toEmit.mockClear();
		sendCanvasState(s1, roomId, "data:image/png;base64,abc");
		expect(s1.to).toHaveBeenCalledWith("s2");
		expect(s1._toEmit).toHaveBeenCalledWith(
			"canvas-state-from-server",
			"data:image/png;base64,abc",
		);
	});

	test("does nothing if no members exist", () => {
		const socket = createMockSocket("s1") as any;
		socket._toEmit.mockClear();
		sendCanvasState(socket, "empty-room", "data");
		expect(socket._toEmit).not.toHaveBeenCalledWith(
			"canvas-state-from-server",
			expect.anything(),
		);
	});
});

describe("sendChatState", () => {
	test("emits chat state to the last member", () => {
		const s1 = createMockSocket("s1") as any;
		const s2 = createMockSocket("s2") as any;
		joinRoom(s1, roomId, "Alice");
		joinRoom(s2, roomId, "Bob");
		const messages = [
			{
				id: "1",
				content: "hello",
				createdAt: "2024-01-01",
				userId: "s1",
				username: "Alice",
			},
		];
		s1._toEmit.mockClear();
		sendChatState(s1, roomId, messages);
		expect(s1.to).toHaveBeenCalledWith("s2");
		expect(s1._toEmit).toHaveBeenCalledWith(
			"chat-state-from-server",
			messages,
		);
	});
});

describe("sendMessage", () => {
	test("emits message to the room", () => {
		const socket = createMockSocket("s1") as any;
		const message = {
			id: "1",
			content: "hello",
			createdAt: "2024-01-01",
			userId: "s1",
			username: "Alice",
		};
		sendMessage(socket, roomId, message);
		expect(socket.to).toHaveBeenCalledWith(roomId);
		expect(socket._toEmit).toHaveBeenCalledWith(
			"chat-message-from-server",
			message,
		);
	});
});

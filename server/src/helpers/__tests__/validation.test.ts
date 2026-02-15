import { describe, test, expect, mock, beforeEach } from "bun:test";
import { validateJoinRoomData, _resetForTesting } from "../index";

const createMockSocket = (id = "socket-1") => ({
	id,
	emit: mock(() => {}),
	join: mock(() => {}),
	leave: mock(() => {}),
	to: mock(() => ({ emit: mock(() => {}) })),
});

const validUUID = "550e8400-e29b-41d4-a716-446655440000";

beforeEach(() => {
	_resetForTesting();
});

describe("validateJoinRoomData", () => {
	test("returns parsed data for valid input", () => {
		const socket = createMockSocket() as any;
		const result = validateJoinRoomData(socket, {
			username: "Alice",
			roomId: validUUID,
		});
		expect(result).toEqual({
			username: "Alice",
			roomId: validUUID,
		});
	});

	test("returns parsed data with optional password", () => {
		const socket = createMockSocket() as any;
		const result = validateJoinRoomData(socket, {
			username: "Alice",
			roomId: validUUID,
			password: "secret",
		});
		expect(result).toEqual({
			username: "Alice",
			roomId: validUUID,
			password: "secret",
		});
	});

	test("emits invalid-data when username is too short", () => {
		const socket = createMockSocket() as any;
		const result = validateJoinRoomData(socket, {
			username: "A",
			roomId: validUUID,
		});
		expect(result).toBeUndefined();
		expect(socket.emit).toHaveBeenCalledWith("invalid-data", {
			message: "Unable to process this request",
		});
	});

	test("emits invalid-data when username is too long", () => {
		const socket = createMockSocket() as any;
		const result = validateJoinRoomData(socket, {
			username: "A".repeat(21),
			roomId: validUUID,
		});
		expect(result).toBeUndefined();
		expect(socket.emit).toHaveBeenCalledWith("invalid-data", {
			message: "Unable to process this request",
		});
	});

	test("emits invalid-data when roomId is not a valid UUID", () => {
		const socket = createMockSocket() as any;
		const result = validateJoinRoomData(socket, {
			username: "Alice",
			roomId: "not-a-uuid",
		});
		expect(result).toBeUndefined();
		expect(socket.emit).toHaveBeenCalledWith("invalid-data", {
			message: "Unable to process this request",
		});
	});

	test("accepts username at minimum length (2 chars)", () => {
		const socket = createMockSocket() as any;
		const result = validateJoinRoomData(socket, {
			username: "AB",
			roomId: validUUID,
		});
		expect(result?.username).toBe("AB");
	});

	test("accepts username at maximum length (20 chars)", () => {
		const socket = createMockSocket() as any;
		const result = validateJoinRoomData(socket, {
			username: "A".repeat(20),
			roomId: validUUID,
		});
		expect(result?.username).toBe("A".repeat(20));
	});
});

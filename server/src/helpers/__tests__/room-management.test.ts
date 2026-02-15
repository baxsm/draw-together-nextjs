import { describe, test, expect, beforeEach } from "bun:test";
import {
	setRoomPassword,
	getRoomPassword,
	getRoomSettings,
	_resetForTesting,
} from "../index";

beforeEach(() => {
	_resetForTesting();
});

describe("setRoomPassword / getRoomPassword", () => {
	test("sets and retrieves a password", () => {
		setRoomPassword("room-1", "secret");
		expect(getRoomPassword("room-1")).toBe("secret");
	});

	test("returns undefined for room with no password", () => {
		expect(getRoomPassword("room-1")).toBeUndefined();
	});

	test("overwrites existing password", () => {
		setRoomPassword("room-1", "old");
		setRoomPassword("room-1", "new");
		expect(getRoomPassword("room-1")).toBe("new");
	});

	test("keeps passwords separate per room", () => {
		setRoomPassword("room-1", "pass-a");
		setRoomPassword("room-2", "pass-b");
		expect(getRoomPassword("room-1")).toBe("pass-a");
		expect(getRoomPassword("room-2")).toBe("pass-b");
	});
});

describe("getRoomSettings", () => {
	test("returns default settings for new room", () => {
		const settings = getRoomSettings("room-1");
		expect(settings).toEqual({ canvasLocked: false });
	});

	test("returns same reference on repeated calls", () => {
		const a = getRoomSettings("room-1");
		const b = getRoomSettings("room-1");
		expect(a).toBe(b);
	});

	test("returns independent settings for different rooms", () => {
		const a = getRoomSettings("room-1");
		const b = getRoomSettings("room-2");
		a.canvasLocked = true;
		expect(b.canvasLocked).toBe(false);
	});
});

import { describe, test, expect, beforeEach } from "bun:test";
import {
	addUndoPoint,
	getLastUndoPoint,
	deleteLastUndoPoint,
	_resetForTesting,
} from "../index";

beforeEach(() => {
	_resetForTesting();
});

describe("addUndoPoint", () => {
	test("creates entry for first undo point in a room", () => {
		addUndoPoint("room-1", "state-1");
		expect(getLastUndoPoint("room-1")).toBe("state-1");
	});

	test("appends to existing undo points", () => {
		addUndoPoint("room-1", "state-1");
		addUndoPoint("room-1", "state-2");
		expect(getLastUndoPoint("room-1")).toBe("state-2");
	});

	test("keeps undo points separate per room", () => {
		addUndoPoint("room-1", "state-a");
		addUndoPoint("room-2", "state-b");
		expect(getLastUndoPoint("room-1")).toBe("state-a");
		expect(getLastUndoPoint("room-2")).toBe("state-b");
	});
});

describe("getLastUndoPoint", () => {
	test("returns the last added undo point", () => {
		addUndoPoint("room-1", "state-1");
		addUndoPoint("room-1", "state-2");
		addUndoPoint("room-1", "state-3");
		expect(getLastUndoPoint("room-1")).toBe("state-3");
	});

	test("returns undefined for room with no undo points", () => {
		expect(getLastUndoPoint("nonexistent")).toBeUndefined();
	});
});

describe("deleteLastUndoPoint", () => {
	test("removes the last undo point", () => {
		addUndoPoint("room-1", "state-1");
		addUndoPoint("room-1", "state-2");
		deleteLastUndoPoint("room-1");
		expect(getLastUndoPoint("room-1")).toBe("state-1");
	});

	test("does nothing for room with no undo points", () => {
		expect(() => deleteLastUndoPoint("nonexistent")).not.toThrow();
	});

	test("leaves empty array after deleting only point", () => {
		addUndoPoint("room-1", "state-1");
		deleteLastUndoPoint("room-1");
		expect(getLastUndoPoint("room-1")).toBeUndefined();
	});
});

import { useCursorsStore } from "@/stores/cursorStore";

beforeEach(() => {
	useCursorsStore.setState({ cursors: new Map() });
});

const cursorData = (
	userId: string,
	x = 100,
	y = 100,
): CursorData => ({
	userId,
	username: `User ${userId}`,
	x,
	y,
});

describe("useCursorsStore", () => {
	it("has initial state: empty cursors map", () => {
		expect(useCursorsStore.getState().cursors.size).toBe(0);
	});

	it("setCursor adds a cursor entry", () => {
		const data = cursorData("u1");
		useCursorsStore.getState().setCursor("u1", data);
		expect(useCursorsStore.getState().cursors.get("u1")).toEqual(data);
	});

	it("setCursor updates existing cursor position", () => {
		useCursorsStore.getState().setCursor("u1", cursorData("u1", 10, 10));
		useCursorsStore.getState().setCursor("u1", cursorData("u1", 200, 300));
		const cursor = useCursorsStore.getState().cursors.get("u1");
		expect(cursor?.x).toBe(200);
		expect(cursor?.y).toBe(300);
	});

	it("removeCursor removes a cursor entry", () => {
		useCursorsStore.getState().setCursor("u1", cursorData("u1"));
		useCursorsStore.getState().removeCursor("u1");
		expect(useCursorsStore.getState().cursors.has("u1")).toBe(false);
	});

	it("clearCursors empties the map", () => {
		useCursorsStore.getState().setCursor("u1", cursorData("u1"));
		useCursorsStore.getState().setCursor("u2", cursorData("u2"));
		useCursorsStore.getState().clearCursors();
		expect(useCursorsStore.getState().cursors.size).toBe(0);
	});
});

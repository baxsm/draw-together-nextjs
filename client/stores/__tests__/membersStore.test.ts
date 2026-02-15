import { useMembersStore } from "@/stores/membersStore";

beforeEach(() => {
	useMembersStore.setState({ members: [], presenceMap: new Map() });
});

describe("useMembersStore", () => {
	it("has initial state: empty members", () => {
		expect(useMembersStore.getState().members).toEqual([]);
	});

	it("has initial state: empty presenceMap", () => {
		expect(useMembersStore.getState().presenceMap.size).toBe(0);
	});

	it("setMembers replaces the members array", () => {
		const members = [
			{ id: "1", username: "Alice" },
			{ id: "2", username: "Bob" },
		];
		useMembersStore.getState().setMembers(members);
		expect(useMembersStore.getState().members).toEqual(members);
	});

	it("setPresence adds a user presence", () => {
		useMembersStore.getState().setPresence("user-1", "drawing");
		expect(useMembersStore.getState().presenceMap.get("user-1")).toBe(
			"drawing",
		);
	});

	it("setPresence updates existing presence", () => {
		useMembersStore.getState().setPresence("user-1", "active");
		useMembersStore.getState().setPresence("user-1", "idle");
		expect(useMembersStore.getState().presenceMap.get("user-1")).toBe("idle");
	});

	it("clearPresence empties the map", () => {
		useMembersStore.getState().setPresence("user-1", "active");
		useMembersStore.getState().setPresence("user-2", "drawing");
		useMembersStore.getState().clearPresence();
		expect(useMembersStore.getState().presenceMap.size).toBe(0);
	});
});

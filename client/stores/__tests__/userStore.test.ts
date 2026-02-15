import { useUserStore } from "@/stores/userStore";

beforeEach(() => {
	useUserStore.setState({ user: null, role: "member" });
});

describe("useUserStore", () => {
	it("has initial state: user is null", () => {
		expect(useUserStore.getState().user).toBeNull();
	});

	it("has initial state: role is member", () => {
		expect(useUserStore.getState().role).toBe("member");
	});

	it("setUser sets the user and auto-syncs role", () => {
		useUserStore
			.getState()
			.setUser({ id: "1", username: "Alice", role: "admin" });
		const state = useUserStore.getState();
		expect(state.user?.username).toBe("Alice");
		expect(state.role).toBe("admin");
	});

	it("setUser with null resets role to member", () => {
		useUserStore
			.getState()
			.setUser({ id: "1", username: "Alice", role: "admin" });
		useUserStore.getState().setUser(null);
		expect(useUserStore.getState().role).toBe("member");
	});

	it("setUser with user without role defaults role to member", () => {
		useUserStore.getState().setUser({ id: "1", username: "Alice" });
		expect(useUserStore.getState().role).toBe("member");
	});

	it("setRole independently updates role", () => {
		useUserStore.getState().setRole("admin");
		expect(useUserStore.getState().role).toBe("admin");
	});
});

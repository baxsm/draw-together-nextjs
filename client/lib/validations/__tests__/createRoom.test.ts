import { createRoomSchema } from "@/lib/validations/createRoom";

describe("createRoomSchema", () => {
	it("accepts valid username", () => {
		const result = createRoomSchema.safeParse({ username: "Alice" });
		expect(result.success).toBe(true);
	});

	it("rejects username shorter than 2 chars", () => {
		const result = createRoomSchema.safeParse({ username: "A" });
		expect(result.success).toBe(false);
	});

	it("rejects username longer than 20 chars", () => {
		const result = createRoomSchema.safeParse({
			username: "A".repeat(21),
		});
		expect(result.success).toBe(false);
	});

	it("accepts username at minimum length (2 chars)", () => {
		const result = createRoomSchema.safeParse({ username: "AB" });
		expect(result.success).toBe(true);
	});

	it("accepts username at maximum length (20 chars)", () => {
		const result = createRoomSchema.safeParse({
			username: "A".repeat(20),
		});
		expect(result.success).toBe(true);
	});

	it("password is optional", () => {
		const result = createRoomSchema.safeParse({ username: "Alice" });
		expect(result.success).toBe(true);
	});

	it("accepts password up to 50 chars", () => {
		const result = createRoomSchema.safeParse({
			username: "Alice",
			password: "x".repeat(50),
		});
		expect(result.success).toBe(true);
	});

	it("rejects password longer than 50 chars", () => {
		const result = createRoomSchema.safeParse({
			username: "Alice",
			password: "x".repeat(51),
		});
		expect(result.success).toBe(false);
	});
});

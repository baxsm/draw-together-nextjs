import { isValidUUID, joinRoomSchema } from "@/lib/validations/joinRoom";

const validUUID = "550e8400-e29b-41d4-a716-446655440000";

describe("isValidUUID", () => {
	it("returns true for valid UUID v4", () => {
		expect(isValidUUID(validUUID)).toBe(true);
	});

	it("returns false for empty string", () => {
		expect(isValidUUID("")).toBe(false);
	});

	it("returns false for random string", () => {
		expect(isValidUUID("not-a-uuid")).toBe(false);
	});

	it("returns false for UUID with wrong version digit", () => {
		expect(isValidUUID("550e8400-e29b-31d4-a716-446655440000")).toBe(false);
	});

	it("returns false for UUID with invalid variant bits", () => {
		expect(isValidUUID("550e8400-e29b-41d4-0716-446655440000")).toBe(false);
	});

	it("is case insensitive", () => {
		expect(isValidUUID("550E8400-E29B-41D4-A716-446655440000")).toBe(true);
	});
});

describe("joinRoomSchema", () => {
	it("accepts valid data", () => {
		const result = joinRoomSchema.safeParse({
			username: "Alice",
			roomId: validUUID,
		});
		expect(result.success).toBe(true);
	});

	it("rejects invalid roomId", () => {
		const result = joinRoomSchema.safeParse({
			username: "Alice",
			roomId: "not-a-uuid",
		});
		expect(result.success).toBe(false);
	});

	it("rejects username shorter than 2 chars", () => {
		const result = joinRoomSchema.safeParse({
			username: "A",
			roomId: validUUID,
		});
		expect(result.success).toBe(false);
	});

	it("password is optional", () => {
		const result = joinRoomSchema.safeParse({
			username: "Alice",
			roomId: validUUID,
		});
		expect(result.success).toBe(true);
	});

	it("accepts valid password", () => {
		const result = joinRoomSchema.safeParse({
			username: "Alice",
			roomId: validUUID,
			password: "secret",
		});
		expect(result.success).toBe(true);
	});
});

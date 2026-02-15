import { messageSchema } from "@/lib/validations/message";

describe("messageSchema", () => {
	it("accepts content between 1-100 chars", () => {
		const result = messageSchema.safeParse({ content: "hello" });
		expect(result.success).toBe(true);
	});

	it("rejects empty content", () => {
		const result = messageSchema.safeParse({ content: "" });
		expect(result.success).toBe(false);
	});

	it("rejects content over 100 chars", () => {
		const result = messageSchema.safeParse({ content: "x".repeat(101) });
		expect(result.success).toBe(false);
	});

	it("accepts exactly 1 char", () => {
		const result = messageSchema.safeParse({ content: "x" });
		expect(result.success).toBe(true);
	});

	it("accepts exactly 100 chars", () => {
		const result = messageSchema.safeParse({ content: "x".repeat(100) });
		expect(result.success).toBe(true);
	});
});

import { getCursorColor } from "@/lib/cursorColors";

const CURSOR_COLORS = [
	"#ef4444",
	"#f97316",
	"#eab308",
	"#22c55e",
	"#06b6d4",
	"#3b82f6",
	"#8b5cf6",
	"#ec4899",
	"#14b8a6",
	"#f59e0b",
];

describe("getCursorColor", () => {
	it("returns a color from the palette", () => {
		const color = getCursorColor("user-123");
		expect(CURSOR_COLORS).toContain(color);
	});

	it("returns deterministic result for the same userId", () => {
		const a = getCursorColor("user-abc");
		const b = getCursorColor("user-abc");
		expect(a).toBe(b);
	});

	it("returns different colors for different userIds", () => {
		const colors = new Set(
			["alpha", "beta", "gamma", "delta", "epsilon"].map(getCursorColor),
		);
		expect(colors.size).toBeGreaterThan(1);
	});

	it("handles empty string without throwing", () => {
		expect(() => getCursorColor("")).not.toThrow();
		expect(CURSOR_COLORS).toContain(getCursorColor(""));
	});

	it("handles very long strings without throwing", () => {
		const long = "x".repeat(10000);
		expect(() => getCursorColor(long)).not.toThrow();
		expect(CURSOR_COLORS).toContain(getCursorColor(long));
	});
});

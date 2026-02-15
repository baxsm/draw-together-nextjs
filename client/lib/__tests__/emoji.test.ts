import { replaceShortcodes } from "@/lib/emoji";

describe("replaceShortcodes", () => {
	it("replaces known shortcode :smile: with emoji", () => {
		expect(replaceShortcodes(":smile:")).toBe("😄");
	});

	it("replaces :heart: with emoji", () => {
		expect(replaceShortcodes(":heart:")).toBe("❤️");
	});

	it("replaces :fire: with emoji", () => {
		expect(replaceShortcodes(":fire:")).toBe("🔥");
	});

	it("replaces multiple shortcodes in one string", () => {
		expect(replaceShortcodes("hi :wave: bye :heart:")).toBe("hi 👋 bye ❤️");
	});

	it("leaves unknown shortcodes unchanged", () => {
		expect(replaceShortcodes(":unknown_code:")).toBe(":unknown_code:");
	});

	it("returns text unchanged when no shortcodes present", () => {
		expect(replaceShortcodes("hello world")).toBe("hello world");
	});

	it("handles empty string", () => {
		expect(replaceShortcodes("")).toBe("");
	});

	it("handles shortcode at start, middle, and end", () => {
		expect(replaceShortcodes(":rocket: go :fire: now :tada:")).toBe(
			"🚀 go 🔥 now 🎉",
		);
	});
});

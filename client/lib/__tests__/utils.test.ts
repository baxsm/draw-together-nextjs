import { cn, draw, formatRelativeTime, isMacOS } from "@/lib/utils";

const createMockCtx = () =>
	({
		beginPath: vi.fn(),
		moveTo: vi.fn(),
		lineTo: vi.fn(),
		stroke: vi.fn(),
		setLineDash: vi.fn(),
		rect: vi.fn(),
		ellipse: vi.fn(),
		fillText: vi.fn(),
		save: vi.fn(),
		restore: vi.fn(),
		clearRect: vi.fn(),
		drawImage: vi.fn(),
		strokeStyle: "",
		fillStyle: "",
		lineWidth: 0,
		lineJoin: "",
		lineCap: "",
		globalCompositeOperation: "",
		shadowColor: "",
		shadowBlur: 0,
		font: "",
		textBaseline: "",
	}) as unknown as CanvasRenderingContext2D;

const baseOptions = (
	ctx: CanvasRenderingContext2D,
	overrides: Partial<DrawOptions> = {},
): DrawOptions => ({
	ctx,
	currentPoint: { x: 100, y: 100 },
	prevPoint: { x: 50, y: 50 },
	strokeColor: "#ff0000",
	strokeWidth: [5],
	dashGap: [0],
	...overrides,
});

describe("cn", () => {
	it("merges class names", () => {
		expect(cn("a", "b")).toBe("a b");
	});

	it("handles conditional classes", () => {
		expect(cn("a", false && "b", "c")).toBe("a c");
	});

	it("resolves tailwind conflicts", () => {
		expect(cn("p-4", "p-2")).toBe("p-2");
	});
});

describe("formatRelativeTime", () => {
	it("returns 'just now' for < 5 seconds ago", () => {
		const now = new Date().toISOString();
		expect(formatRelativeTime(now)).toBe("just now");
	});

	it("returns seconds ago for < 60 seconds", () => {
		const date = new Date(Date.now() - 30_000).toISOString();
		expect(formatRelativeTime(date)).toBe("30s ago");
	});

	it("returns minutes ago for < 60 minutes", () => {
		const date = new Date(Date.now() - 5 * 60_000).toISOString();
		expect(formatRelativeTime(date)).toBe("5m ago");
	});

	it("returns hours ago for < 24 hours", () => {
		const date = new Date(Date.now() - 3 * 3_600_000).toISOString();
		expect(formatRelativeTime(date)).toBe("3h ago");
	});

	it("returns formatted date for >= 24 hours", () => {
		const date = new Date(Date.now() - 48 * 3_600_000).toISOString();
		const result = formatRelativeTime(date);
		expect(result).toMatch(/\w+ \d+/);
	});

	it("boundary: exactly 5 seconds returns '5s ago'", () => {
		const date = new Date(Date.now() - 5_000).toISOString();
		expect(formatRelativeTime(date)).toBe("5s ago");
	});

	it("boundary: exactly 60 seconds returns '1m ago'", () => {
		const date = new Date(Date.now() - 60_000).toISOString();
		expect(formatRelativeTime(date)).toBe("1m ago");
	});
});

describe("isMacOS", () => {
	it("returns false when navigator is undefined", () => {
		expect(isMacOS()).toBe(false);
	});
});

describe("draw", () => {
	it("calls freehand drawing for default (no tool)", () => {
		const ctx = createMockCtx();
		draw(baseOptions(ctx));
		expect(ctx.beginPath).toHaveBeenCalled();
		expect(ctx.moveTo).toHaveBeenCalled();
		expect(ctx.lineTo).toHaveBeenCalled();
		expect(ctx.stroke).toHaveBeenCalled();
	});

	it("calls freehand drawing for pen tool", () => {
		const ctx = createMockCtx();
		draw(baseOptions(ctx, { tool: "pen" }));
		expect(ctx.beginPath).toHaveBeenCalled();
		expect(ctx.stroke).toHaveBeenCalled();
	});

	it("uses destination-out for eraser tool", () => {
		const ctx = createMockCtx();
		draw(baseOptions(ctx, { tool: "eraser" }));
		expect(ctx.save).toHaveBeenCalled();
		expect(ctx.globalCompositeOperation).toBe("destination-out");
		expect(ctx.restore).toHaveBeenCalled();
	});

	it("draws rectangle with correct dimensions", () => {
		const ctx = createMockCtx();
		draw(
			baseOptions(ctx, {
				tool: "rectangle",
				startPoint: { x: 10, y: 10 },
				endPoint: { x: 110, y: 60 },
			}),
		);
		expect(ctx.rect).toHaveBeenCalledWith(10, 10, 100, 50);
		expect(ctx.stroke).toHaveBeenCalled();
	});

	it("does nothing for rectangle without start/end points", () => {
		const ctx = createMockCtx();
		draw(baseOptions(ctx, { tool: "rectangle" }));
		expect(ctx.rect).not.toHaveBeenCalled();
	});

	it("draws circle with correct ellipse call", () => {
		const ctx = createMockCtx();
		draw(
			baseOptions(ctx, {
				tool: "circle",
				startPoint: { x: 0, y: 0 },
				endPoint: { x: 100, y: 80 },
			}),
		);
		expect(ctx.ellipse).toHaveBeenCalledWith(50, 40, 50, 40, 0, 0, Math.PI * 2);
	});

	it("does nothing for circle without start/end points", () => {
		const ctx = createMockCtx();
		draw(baseOptions(ctx, { tool: "circle" }));
		expect(ctx.ellipse).not.toHaveBeenCalled();
	});

	it("draws line from startPoint to endPoint", () => {
		const ctx = createMockCtx();
		draw(
			baseOptions(ctx, {
				tool: "line",
				startPoint: { x: 0, y: 0 },
				endPoint: { x: 200, y: 200 },
			}),
		);
		expect(ctx.moveTo).toHaveBeenCalledWith(0, 0);
		expect(ctx.lineTo).toHaveBeenCalledWith(200, 200);
	});

	it("does nothing for line without start/end points", () => {
		const ctx = createMockCtx();
		draw(baseOptions(ctx, { tool: "line" }));
		expect(ctx.moveTo).not.toHaveBeenCalled();
	});

	it("uses freehand for laser tool", () => {
		const ctx = createMockCtx();
		draw(baseOptions(ctx, { tool: "laser" }));
		expect(ctx.beginPath).toHaveBeenCalled();
		expect(ctx.stroke).toHaveBeenCalled();
	});

	it("sets shadow when userId is provided", () => {
		const ctx = createMockCtx();
		draw(baseOptions(ctx, { userId: "user-1" }));
		expect(ctx.shadowBlur).toBe(0);
		expect(ctx.shadowColor).toBe("transparent");
	});

	it("does not set shadow when userId is absent", () => {
		const ctx = createMockCtx();
		draw(baseOptions(ctx));
		expect(ctx.shadowColor).toBe("");
		expect(ctx.shadowBlur).toBe(0);
	});

	it("sets strokeStyle to the provided color", () => {
		const ctx = createMockCtx();
		draw(baseOptions(ctx, { strokeColor: "#00ff00" }));
		expect(ctx.strokeStyle).toBe("#00ff00");
	});

	it("sets lineWidth from strokeWidth array", () => {
		const ctx = createMockCtx();
		draw(baseOptions(ctx, { strokeWidth: [10] }));
		expect(ctx.lineWidth).toBe(10);
	});

	it("uses currentPoint as start when prevPoint is undefined", () => {
		const ctx = createMockCtx();
		draw(baseOptions(ctx, { prevPoint: undefined }));
		expect(ctx.moveTo).toHaveBeenCalledWith(100, 100);
		expect(ctx.lineTo).toHaveBeenCalledWith(100, 100);
	});
});

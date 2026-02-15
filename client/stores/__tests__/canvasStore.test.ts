import { useCanvasStore } from "@/stores/canvasStore";

beforeEach(() => {
	useCanvasStore.setState({
		tool: "pen",
		strokeColor: "#000",
		strokeWidth: [3],
		dashGap: [0],
		fontSize: [16],
		isLocked: false,
		canvasRef: { current: null },
	});
});

describe("useCanvasStore", () => {
	it("has correct initial defaults", () => {
		const state = useCanvasStore.getState();
		expect(state.tool).toBe("pen");
		expect(state.strokeColor).toBe("#000");
		expect(state.strokeWidth).toEqual([3]);
		expect(state.dashGap).toEqual([0]);
		expect(state.fontSize).toEqual([16]);
		expect(state.isLocked).toBe(false);
	});

	it("setTool updates the tool", () => {
		useCanvasStore.getState().setTool("eraser");
		expect(useCanvasStore.getState().tool).toBe("eraser");
	});

	it("setStrokeColor updates the color", () => {
		useCanvasStore.getState().setStrokeColor("#ff0000");
		expect(useCanvasStore.getState().strokeColor).toBe("#ff0000");
	});

	it("setStrokeWidth updates stroke width", () => {
		useCanvasStore.getState().setStrokeWidth([10]);
		expect(useCanvasStore.getState().strokeWidth).toEqual([10]);
	});

	it("setDashGap updates dash gap", () => {
		useCanvasStore.getState().setDashGap([5]);
		expect(useCanvasStore.getState().dashGap).toEqual([5]);
	});

	it("setFontSize updates font size", () => {
		useCanvasStore.getState().setFontSize([24]);
		expect(useCanvasStore.getState().fontSize).toEqual([24]);
	});

	it("setIsLocked updates the lock state", () => {
		useCanvasStore.getState().setIsLocked(true);
		expect(useCanvasStore.getState().isLocked).toBe(true);
	});
});

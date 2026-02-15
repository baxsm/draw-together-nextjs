import { expect, test } from "@playwright/test";

async function createRoom(page: import("@playwright/test").Page, username: string) {
  await page.goto("/");
  await page.getByPlaceholder("Enter your name").first().fill(username);
  await page.getByRole("button", { name: "Create Room" }).click();
  await page.waitForURL(/\/[0-9a-f-]{36}$/);
  return page.url().split("/").pop()!;
}

async function joinRoom(
  page: import("@playwright/test").Page,
  username: string,
  roomId: string,
) {
  await page.goto("/");
  await page.getByRole("button", { name: "Join a Room" }).click();
  const dialog = page.locator("[role=dialog]");
  await dialog.getByPlaceholder("Enter your name").fill(username);
  await dialog.getByPlaceholder("Paste room ID here").fill(roomId);
  await dialog.getByRole("button", { name: "Join Room" }).click();
  await page.waitForURL(new RegExp(roomId));
}

async function waitForCanvasReady(page: import("@playwright/test").Page) {
  await expect(page.locator("#canvas")).toBeVisible({ timeout: 10000 });
  await expect(page.getByText("Loading canvas...")).toBeHidden({ timeout: 10000 });
  await page.waitForFunction(() => {
    const c = document.getElementById("canvas") as HTMLCanvasElement;
    return c && c.width > 0 && c.height > 0;
  }, { timeout: 10000 });
  await page.waitForTimeout(500);
}

async function drawStroke(
  page: import("@playwright/test").Page,
  startX: number,
  startY: number,
  endX: number,
  endY: number,
) {
  const canvas = page.locator("#canvas");
  const box = await canvas.boundingBox();
  if (!box) throw new Error("Canvas not found");

  const sx = box.x + startX;
  const sy = box.y + startY;
  const ex = box.x + endX;
  const ey = box.y + endY;

  await page.mouse.move(sx, sy);
  await page.mouse.down();
  await page.waitForTimeout(200);

  const steps = 15;
  for (let i = 1; i <= steps; i++) {
    const x = sx + ((ex - sx) * i) / steps;
    const y = sy + ((ey - sy) * i) / steps;
    await page.mouse.move(x, y);
    await page.waitForTimeout(30);
  }

  await page.mouse.up();
  await page.waitForTimeout(300);
}

function getCanvasData(page: import("@playwright/test").Page) {
  return page.evaluate(() => {
    const c = document.getElementById("canvas") as HTMLCanvasElement;
    return c?.toDataURL();
  });
}

test.describe("Drawing", () => {
  test("user can draw on the canvas", async ({ page }) => {
    await createRoom(page, "Alice");
    await waitForCanvasReady(page);

    const blankData = await getCanvasData(page);
    await drawStroke(page, 400, 300, 600, 400);
    const drawnData = await getCanvasData(page);

    expect(drawnData).not.toBe(blankData);
  });

  test("drawing is visible to another user", async ({ browser }) => {
    const ctx1 = await browser.newContext();
    const ctx2 = await browser.newContext();
    const page1 = await ctx1.newPage();
    const page2 = await ctx2.newPage();

    const roomId = await createRoom(page1, "Alice");
    await waitForCanvasReady(page1);

    await joinRoom(page2, "Bob", roomId);
    await waitForCanvasReady(page2);

    const blankData2 = await getCanvasData(page2);
    await drawStroke(page1, 400, 300, 600, 400);
    await page2.waitForTimeout(2000);
    const drawnData2 = await getCanvasData(page2);

    expect(drawnData2).not.toBe(blankData2);

    await ctx1.close();
    await ctx2.close();
  });

  test("canvas can be cleared", async ({ page }) => {
    await createRoom(page, "Alice");
    await waitForCanvasReady(page);

    await drawStroke(page, 400, 300, 600, 400);
    const drawnData = await getCanvasData(page);

    await page.getByRole("button", { name: "Clear" }).click();
    await page.waitForTimeout(300);

    const clearedData = await getCanvasData(page);
    expect(clearedData).not.toBe(drawnData);
  });
});

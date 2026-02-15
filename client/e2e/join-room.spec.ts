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

test.describe("Join Room", () => {
  test("user can join an existing room", async ({ browser }) => {
    const ctx1 = await browser.newContext();
    const ctx2 = await browser.newContext();
    const page1 = await ctx1.newPage();
    const page2 = await ctx2.newPage();

    const roomId = await createRoom(page1, "Alice");
    await joinRoom(page2, "Bob", roomId);
    await expect(page2.locator("canvas").first()).toBeVisible({ timeout: 10000 });

    await ctx1.close();
    await ctx2.close();
  });

  test("cannot join a non-existent room", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Join a Room" }).click();
    const dialog = page.locator("[role=dialog]");
    await dialog.getByPlaceholder("Enter your name").fill("Bob");
    await dialog
      .getByPlaceholder("Paste room ID here")
      .fill("550e8400-e29b-41d4-a716-446655440000");
    await dialog.getByRole("button", { name: "Join Room" }).click();

    await page.waitForTimeout(2000);
    await expect(page).toHaveURL("/");
  });

  test("joining shows the new member in the chat members list", async ({
    browser,
  }) => {
    const ctx1 = await browser.newContext();
    const ctx2 = await browser.newContext();
    const page1 = await ctx1.newPage();
    const page2 = await ctx2.newPage();

    const roomId = await createRoom(page1, "Alice");
    await joinRoom(page2, "Bob", roomId);

    await page1.getByLabel("Open chat").click();
    await expect(page1.getByText("Bob")).toBeVisible({ timeout: 5000 });

    await ctx1.close();
    await ctx2.close();
  });
});

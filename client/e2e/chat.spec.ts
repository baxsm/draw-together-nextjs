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

test.describe("Chat", () => {
  test("user can send a message and it appears for both users", async ({
    browser,
  }) => {
    const ctx1 = await browser.newContext();
    const ctx2 = await browser.newContext();
    const page1 = await ctx1.newPage();
    const page2 = await ctx2.newPage();

    const roomId = await createRoom(page1, "Alice");
    await joinRoom(page2, "Bob", roomId);

    await page1.getByLabel("Open chat").click();
    await page1.getByPlaceholder("Type a message...").fill("Hello from Alice!");
    await page1.getByPlaceholder("Type a message...").press("Enter");
    await expect(page1.getByText("Hello from Alice!")).toBeVisible();

    await page2.getByLabel("Open chat").click();
    await expect(page2.getByText("Hello from Alice!")).toBeVisible({
      timeout: 5000,
    });

    await page2.getByPlaceholder("Type a message...").fill("Hi Alice!");
    await page2.getByPlaceholder("Type a message...").press("Enter");
    await expect(page2.getByText("Hi Alice!")).toBeVisible();
    await expect(page1.getByText("Hi Alice!")).toBeVisible({ timeout: 5000 });

    await ctx1.close();
    await ctx2.close();
  });

  test("emoji shortcodes are replaced in messages", async ({ browser }) => {
    const ctx1 = await browser.newContext();
    const ctx2 = await browser.newContext();
    const page1 = await ctx1.newPage();
    const page2 = await ctx2.newPage();

    const roomId = await createRoom(page1, "Alice");
    await joinRoom(page2, "Bob", roomId);

    await page1.getByLabel("Open chat").click();
    await page1.getByPlaceholder("Type a message...").fill("hello :wave:");
    await page1.getByPlaceholder("Type a message...").press("Enter");
    await expect(page1.getByText("hello 👋")).toBeVisible();

    await ctx1.close();
    await ctx2.close();
  });
});

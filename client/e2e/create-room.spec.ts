import { expect, test } from "@playwright/test";

test.describe("Create Room", () => {
  test("user can create a room with a username", async ({ page }) => {
    await page.goto("/");
    await page.getByPlaceholder("Enter your name").first().fill("Alice");
    await page.getByRole("button", { name: "Create Room" }).click();
    await page.waitForURL(/\/[0-9a-f-]{36}$/);
    await expect(page).toHaveURL(/\/[0-9a-f-]{36}$/);
  });

  test("creating a room navigates to the room page with canvas", async ({
    page,
  }) => {
    await page.goto("/");
    await page.getByPlaceholder("Enter your name").first().fill("Alice");
    await page.getByRole("button", { name: "Create Room" }).click();
    await page.waitForURL(/\/[0-9a-f-]{36}$/);
    await expect(page.locator("canvas").first()).toBeVisible({ timeout: 10000 });
  });

  test("cannot create room with empty username", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Create Room" }).click();
    await expect(page.getByText("Username is too short")).toBeVisible();
  });

  test("cannot create room with username shorter than 2 chars", async ({
    page,
  }) => {
    await page.goto("/");
    await page.getByPlaceholder("Enter your name").first().fill("A");
    await page.getByRole("button", { name: "Create Room" }).click();
    await expect(page.getByText("Username is too short")).toBeVisible();
  });
});

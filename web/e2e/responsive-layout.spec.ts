import { expect, test, type Locator } from "@playwright/test";

async function box(locator: Locator) {
  const value = await locator.boundingBox();
  expect(value).not.toBeNull();
  if (!value) {
    throw new Error("Expected visible layout box.");
  }
  return value;
}

async function expectNoDocumentHorizontalOverflow(
  page: import("@playwright/test").Page,
) {
  const overflow = await page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    viewportWidth: window.innerWidth,
  }));
  expect(overflow.scrollWidth).toBeLessThanOrEqual(overflow.viewportWidth + 1);
}

async function expectRendererFillsViewport(page: import("@playwright/test").Page) {
  const renderer = page.getByRole("application", {
    name: "Interactive 3D Knowledge graph",
  });
  await expect(renderer).toBeVisible();
  const viewportBox = await box(renderer);
  const canvasBox = await box(renderer.locator("canvas").first());

  expect(Math.abs(canvasBox.width - viewportBox.width)).toBeLessThanOrEqual(2);
  expect(Math.abs(canvasBox.height - viewportBox.height)).toBeLessThanOrEqual(2);
}

test("uses the wide viewport for the Knowledge workspace", async ({ page }) => {
  await page.setViewportSize({ width: 1366, height: 768 });
  await page.goto("/curation/knowledge");

  const main = page.getByRole("main");
  const graph = page.getByRole("region", {
    name: "Knowledge graph",
    exact: true,
  });
  const detail = page.getByRole("complementary", { name: "Knowledge detail" });

  const mainBox = await box(main);
  const graphBox = await box(graph);
  const detailBox = await box(detail);

  expect(mainBox.width).toBeGreaterThan(1080);
  await expect(
    page.getByRole("region", { name: "Knowledge list", exact: true }),
  ).toHaveCount(0);
  expect(detailBox.width).toBeGreaterThanOrEqual(275);
  expect(detailBox.width).toBeLessThanOrEqual(325);
  expect(graphBox.width).toBeGreaterThan(760);
  expect(graphBox.height).toBeGreaterThanOrEqual(520);
  expect(graphBox.height).toBeLessThanOrEqual(920);
  expect(graphBox.y).toBeLessThan(190);
  await expectRendererFillsViewport(page);
  await expectNoDocumentHorizontalOverflow(page);

  const appTitle = page.getByRole("heading", { name: "Prep", level: 1 });
  await expect(
    page.getByRole("complementary", { name: "Application navigation" }),
  ).toBeVisible();
  await expect(
    page.getByRole("group", { name: "Graph performance profile" }),
  ).toBeVisible();
  const titleFontSize = await appTitle.evaluate((element) =>
    Number.parseFloat(getComputedStyle(element).fontSize),
  );
  expect(titleFontSize).toBeLessThanOrEqual(20);
});

test("reflows the Knowledge workspace for tablet and mobile widths", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1024, height: 768 });
  await page.goto("/curation/knowledge");

  const graph = page.getByRole("region", {
    name: "Knowledge graph",
    exact: true,
  });
  const detail = page.getByRole("complementary", { name: "Knowledge detail" });

  await page.getByRole("button", { name: "Browse" }).click();
  const list = page.getByRole("region", {
    name: "Knowledge list",
    exact: true,
  });
  const tabletList = await box(list);
  const tabletGraph = await box(graph);
  const tabletDetail = await box(detail);

  expect(tabletGraph.x).toBeGreaterThan(tabletList.x + tabletList.width);
  expect(tabletGraph.width).toBeGreaterThan(520);
  expect(tabletGraph.width).toBeGreaterThan(tabletList.width * 2.5);
  expect(tabletDetail.y).toBeGreaterThanOrEqual(
    Math.min(tabletList.y + tabletList.height, tabletGraph.y + tabletGraph.height),
  );
  await expectNoDocumentHorizontalOverflow(page);

  await page.setViewportSize({ width: 390, height: 844 });

  const mobileList = await box(list);
  const mobileGraph = await box(graph);
  const mobileDetail = await box(detail);

  expect(mobileList.y).toBeGreaterThanOrEqual(
    mobileGraph.y + mobileGraph.height,
  );
  expect(mobileDetail.y).toBeGreaterThanOrEqual(
    mobileList.y + mobileList.height,
  );
  expect(mobileGraph.width).toBeGreaterThan(340);
  await expectRendererFillsViewport(page);

  const overflow = await page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    viewportWidth: window.innerWidth,
  }));
  expect(overflow.scrollWidth).toBeLessThanOrEqual(overflow.viewportWidth + 1);
});

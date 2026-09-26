import { expect, test, type Locator } from "@playwright/test";

async function box(locator: Locator) {
  const value = await locator.boundingBox();
  expect(value).not.toBeNull();
  if (!value) {
    throw new Error("Expected visible layout box.");
  }
  return value;
}

test("uses the wide viewport for the Knowledge workspace", async ({ page }) => {
  await page.setViewportSize({ width: 1920, height: 1080 });
  await page.goto("/curation/knowledge");

  const main = page.getByRole("main");
  const list = page.getByRole("region", {
    name: "Knowledge list",
    exact: true,
  });
  const graph = page.getByRole("region", {
    name: "Knowledge graph",
    exact: true,
  });
  const detail = page.getByRole("complementary");

  const mainBox = await box(main);
  const listBox = await box(list);
  const graphBox = await box(graph);
  const detailBox = await box(detail);

  expect(mainBox.width).toBeGreaterThan(1800);
  expect(listBox.width).toBeGreaterThanOrEqual(220);
  expect(listBox.width).toBeLessThanOrEqual(300);
  expect(detailBox.width).toBeGreaterThanOrEqual(280);
  expect(detailBox.width).toBeLessThanOrEqual(380);
  expect(graphBox.width).toBeGreaterThan(900);
  expect(graphBox.width).toBeGreaterThan(listBox.width * 3);
  expect(graphBox.height).toBeGreaterThanOrEqual(500);
  expect(graphBox.height).toBeLessThanOrEqual(920);
});

test("reflows the Knowledge workspace for tablet and mobile widths", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1024, height: 768 });
  await page.goto("/curation/knowledge");

  const list = page.getByRole("region", {
    name: "Knowledge list",
    exact: true,
  });
  const graph = page.getByRole("region", {
    name: "Knowledge graph",
    exact: true,
  });
  const detail = page.getByRole("complementary");

  const tabletList = await box(list);
  const tabletGraph = await box(graph);
  const tabletDetail = await box(detail);

  expect(tabletGraph.x).toBeGreaterThan(tabletList.x + tabletList.width);
  expect(tabletGraph.width).toBeGreaterThan(600);
  expect(tabletDetail.y).toBeGreaterThanOrEqual(
    Math.min(tabletList.y + tabletList.height, tabletGraph.y + tabletGraph.height),
  );

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

  const overflow = await page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    viewportWidth: window.innerWidth,
  }));
  expect(overflow.scrollWidth).toBeLessThanOrEqual(overflow.viewportWidth + 1);
});

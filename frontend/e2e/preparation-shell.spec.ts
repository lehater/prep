import { expect, test, type Locator, type Page } from "@playwright/test";

async function compareAndContinueWithBackend(page: Page) {
  await page.getByRole("checkbox", { name: /Собеседование на Backend Engineer/ }).check();
  await page.getByRole("checkbox", { name: /Собеседование на Platform Engineer/ }).check();
  await page.getByRole("button", { name: "Сравнить выбранные" }).click();
  await page
    .getByRole("radio", { name: "Собеседование на Backend Engineer" })
    .check();
  await page
    .getByRole("button", { name: "Продолжить с выбранной целью" })
    .click();
}

async function establishBackendTarget(page: Page) {
  await compareAndContinueWithBackend(page);
  await page.getByRole("button", { name: "Зафиксировать цель" }).click();
  await expect(
    page
      .getByRole("contentinfo")
      .getByText("Собеседование на Backend Engineer"),
  ).toBeVisible();
}

async function tabTo(page: Page, target: Locator, maxTabs = 80) {
  for (let index = 0; index < maxTabs; index += 1) {
    await page.keyboard.press("Tab");
    const focused = await target.evaluate(
      (element) => element === document.activeElement,
    );
    if (focused) {
      return;
    }
  }

  throw new Error("Keyboard focus did not reach the expected control.");
}

test("keeps shared application chrome around the replaceable task viewport", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");

  const topBar = page.locator(".app-topbar");
  const statusBar = page.getByRole("contentinfo");
  const breadcrumbs = page.getByLabel("Навигационный путь");

  await expect(topBar).toBeVisible();
  await expect(statusBar).toBeVisible();
  await expect(breadcrumbs.getByText("Подготовка", { exact: true })).toBeVisible();
  await expect(breadcrumbs.getByText("Цели", { exact: true })).toBeVisible();
  await expect(statusBar.getByText("не выбрана", { exact: true })).toBeVisible();

  await establishBackendTarget(page);

  await expect(topBar).toBeVisible();
  await expect(statusBar).toBeVisible();
  await expect(breadcrumbs.getByText("Цель", { exact: true })).toBeVisible();
  await expect(
    statusBar.getByText("Собеседование на Backend Engineer", { exact: true }),
  ).toBeVisible();
  await expect(statusBar.getByText("не выбран", { exact: true })).toBeVisible();

  await page.getByRole("button", { name: "Знания", exact: true }).click();

  await expect(topBar).toBeVisible();
  await expect(statusBar).toBeVisible();
  await expect(breadcrumbs.getByText("Знания", { exact: true })).toBeVisible();
  await expect(
    statusBar.getByText("Собеседование на Backend Engineer", { exact: true }),
  ).toBeVisible();
  await expect(page.locator('[data-view="knowledge"]')).toBeVisible();

  const topBarBox = await topBar.boundingBox();
  const statusBarBox = await statusBar.boundingBox();
  expect(topBarBox).not.toBeNull();
  expect(statusBarBox).not.toBeNull();
  if (topBarBox && statusBarBox) {
    expect(topBarBox.height).toBeLessThanOrEqual(44);
    expect(statusBarBox.height).toBeLessThanOrEqual(30);
  }
});

test("compares candidate Targets and continues without activating one", async ({
  page,
}) => {
  await page.goto("/");

  await expect(
    page.getByRole("heading", { name: "Выберите, к чему вы готовитесь" }),
  ).toBeVisible();
  await expect(
    page.getByRole("contentinfo").getByText("не выбрана"),
  ).toBeVisible();

  await page
    .getByRole("checkbox", { name: /Собеседование на Backend Engineer/ })
    .check();
  await page
    .getByRole("checkbox", { name: /Собеседование на Platform Engineer/ })
    .check();

  await page.getByRole("button", { name: "Сравнить выбранные" }).click();

  await expect(
    page.getByRole("heading", { name: "Сравнение выбранных целей" }),
  ).toBeVisible();
  await expect(
    page.getByText("System design", { exact: true }).first(),
  ).toBeVisible();
  await expect(
    page.getByText("Коммуникация на собеседовании", { exact: true }).first(),
  ).toBeVisible();
  await expect(
    page.getByText("Работа с Kubernetes", { exact: true }).first(),
  ).toBeVisible();
  await expect(
    page.getByText("Для всех вариантов используется одна база свидетельств об учащемся."),
  ).toBeVisible();

  await page
    .getByRole("radio", { name: "Собеседование на Backend Engineer" })
    .check();
  await page
    .getByRole("button", { name: "Продолжить с выбранной целью" })
    .click();

  await expect(
    page.getByRole("heading", { name: "Зафиксируйте цель подготовки" }),
  ).toBeVisible();
  await expect(page.getByRole("combobox", { name: "Цель", exact: true })).toHaveValue(
    "target:backend-interview",
  );
  await expect(page.getByLabel("Источник / контекст")).toHaveValue(
    "Описание backend-собеседования",
  );
  await expect(
    page.getByRole("contentinfo").getByText("не выбрана"),
  ).toBeVisible();
});

test("establishes Target explicitly, then exposes requirements and direct Knowledge focus", async ({
  page,
}) => {
  await page.goto("/");
  await compareAndContinueWithBackend(page);

  await page.getByRole("button", { name: "Зафиксировать цель" }).click();

  await expect(
    page.getByRole("heading", { name: "Что требуется для этой цели" }),
  ).toBeVisible();
  await expect(
    page
      .getByRole("contentinfo")
      .getByText("Собеседование на Backend Engineer"),
  ).toBeVisible();

  await expect(
    page.getByText(
      "Проектировать масштабируемый сервис и объяснять основные компромиссы.",
    ),
  ).toBeVisible();
  await expect(page.getByRole("heading", { name: "Условия" }).first()).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Критерии качества" }).first(),
  ).toBeVisible();
  await expect(page.getByText("Стратегия кэширования")).toBeVisible();
  await expect(
    page.getByText(
      "Выбор consistency-модели балансирует задержку и координацию против гарантий актуальности.",
    ),
  ).toBeVisible();

  await page
    .getByRole("button", { name: "Открыть знания: System design" })
    .click();

  await expect(
    page.getByRole("heading", { name: "Знания", exact: true }),
  ).toBeVisible();
  await expect(
    page.getByText("System design", { exact: true }),
  ).toBeVisible();
  await expect(page.getByText("7/7", { exact: true })).toBeVisible();
  await expect(
    page.getByText(
      "Выбор consistency-модели балансирует задержку и координацию против гарантий актуальности.",
      { exact: true },
    ).first(),
  ).toBeVisible();
  await expect(page.getByText("Стратегия кэширования", { exact: true }).first()).toBeVisible();
  await expect(
    page
      .getByRole("contentinfo")
      .getByText("Собеседование на Backend Engineer"),
  ).toBeVisible();

  await page.getByRole("button", { name: "Цель", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "Что требуется для этой цели" }),
  ).toBeVisible();
  await expect(
    page.getByText(
      "Проектировать масштабируемый сервис и объяснять основные компромиссы.",
    ),
  ).toBeVisible();

  await page
    .getByRole("button", { name: "Подготовить недостающую поддержку" })
    .click();
  await expect(page.getByRole("heading", { name: "Подготовить поддержку" })).toBeVisible();
  await expect(
    page
      .getByRole("contentinfo")
      .getByText("Собеседование на Backend Engineer"),
  ).toBeVisible();
});

test("preserves Target draft after rejected establishment and accepts corrected input", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Цель", exact: true }).click();

  const target = page.getByRole("combobox", { name: "Цель", exact: true });
  const source = page.getByLabel("Источник / контекст");

  await target.selectOption({ label: "Собеседование на Backend Engineer" });
  await expect(source).toHaveValue("Описание backend-собеседования");
  await source.fill("");

  await page.getByRole("button", { name: "Зафиксировать цель" }).click();

  await expect(
    page.getByText("Нужно указать источник или контекст цели."),
  ).toBeVisible();
  await expect(target).toHaveValue("target:backend-interview");
  await expect(source).toHaveValue("");
  await expect(
    page.getByRole("contentinfo").getByText("не выбрана"),
  ).toBeVisible();

  await source.fill("Описание backend-собеседования");
  await page.getByRole("button", { name: "Зафиксировать цель" }).click();

  await expect(
    page
      .getByRole("contentinfo")
      .getByText("Собеседование на Backend Engineer"),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Требования" }),
  ).toBeVisible();
});

test("routes Target-dependent navigation to recovery when Target is absent", async ({
  page,
}) => {
  await page.goto("/");

  await page.getByRole("button", { name: "Текущее состояние" }).click();

  await expect(
    page.getByRole("heading", { name: "Зафиксируйте цель подготовки" }),
  ).toBeVisible();
  await expect(
    page.getByText(
      "Сначала зафиксируйте цель подготовки.",
    ),
  ).toBeVisible();

  await page.getByRole("button", { name: "Цели", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "Выберите, к чему вы готовитесь" }),
  ).toBeVisible();
});

test("preserves preparation hierarchy and serializes comparison on a narrow viewport", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");

  await expect(
    page.locator(".app-sidebar .active-context"),
  ).toBeVisible();
  await expect(
    page.locator("main.active-child"),
  ).toBeVisible();

  await page
    .getByRole("checkbox", { name: /Собеседование на Backend Engineer/ })
    .check();
  await page
    .getByRole("checkbox", { name: /Собеседование на Platform Engineer/ })
    .check();
  await page.getByRole("button", { name: "Сравнить выбранные" }).click();

  const cards = page.locator(".comparison-card");
  await expect(cards).toHaveCount(2);

  const firstBox = await cards.nth(0).boundingBox();
  const secondBox = await cards.nth(1).boundingBox();

  expect(firstBox).not.toBeNull();
  expect(secondBox).not.toBeNull();
  if (!firstBox || !secondBox) {
    throw new Error("Comparison cards must have measurable layout boxes.");
  }

  expect(Math.abs(firstBox.x - secondBox.x)).toBeLessThan(2);
  expect(secondBox.y).toBeGreaterThan(firstBox.y + firstBox.height - 2);
  await expect(
    page.getByText("Общие требуемые компетенции").first(),
  ).toBeVisible();
  await expect(
    page.getByText("Текущее состояние по свидетельствам").first(),
  ).toBeVisible();
});


test("reviews current evidence and explicitly sets the Next focus before Activity", async ({
  page,
}) => {
  await page.goto("/");
  await establishBackendTarget(page);

  await page.getByRole("button", { name: "Текущее состояние" }).click();

  await expect(
    page.getByRole("heading", { name: "Определите, на чём сосредоточиться дальше" }),
  ).toBeVisible();
  await expect(page.getByText("подтверждено", { exact: true })).toBeVisible();
  await expect(page.getByText("оспорено", { exact: true }).first()).toBeVisible();
  await expect(page.getByText("неизвестно", { exact: true })).toBeVisible();
  await expect(
    page.getByText(
      "Недостаточно надёжных свидетельств, чтобы сделать вывод.",
    ),
  ).toBeVisible();

  await expect(
    page.getByRole("heading", { name: "Что требует внимания" }),
  ).toBeVisible();
  await expect(page.getByText("Ключевое требование основной части собеседования.", { exact: true })).toBeVisible();
  await expect(
    page.getByText("Нужно для поведенческой части собеседования.", { exact: true }),
  ).toBeVisible();

  await page.getByRole("radio", { name: /System design/ }).check();

  await expect(page.getByLabel("Цель фокуса")).toHaveValue(
    "Следующий фокус: System design.",
  );
  await expect(page.getByLabel("Основание выбора")).toHaveValue(
    "Высокий приоритет: влияет на несколько типов system design-вопросов.",
  );

  await expect(
    page
      .getByRole("contentinfo")
      .getByText("не выбран"),
  ).toBeVisible();

  await page.getByRole("button", { name: "Выбрать фокус" }).click();

  await expect(page.getByText("Следующий фокус выбран")).toBeVisible();
  await expect(
    page.getByRole("contentinfo").getByText("выбран"),
  ).toBeVisible();

  await page.getByText("Почему такое состояние: свидетельства").click();
  await expect(
    page.getByText(
      "Разбор практики выявил неявные допущения о consistency при проектировании кэша.",
    ),
  ).toBeVisible();
  await expect(
    page.getByText(
      "Повторная практика выявила ещё одно неразрешённое допущение о consistency.",
      { exact: true },
    ),
  ).toHaveCount(0);

  await expect(page.getByText(/mastery percentage/i)).toHaveCount(0);
  await expect(page.getByText(/readiness percentage/i)).toHaveCount(0);

  await page.getByRole("button", { name: "Перейти к практике" }).click();
  await expect(page.getByRole("heading", { name: "Проработайте выбранный фокус" })).toBeVisible();
});

test("preserves Current draft through contextual Knowledge without replacing the general Knowledge session", async ({
  page,
}) => {
  await page.goto("/");
  await establishBackendTarget(page);

  await page.getByRole("button", { name: "Знания", exact: true }).click();
  await page.getByRole("textbox", { name: "Поиск", exact: true }).fill("event loop");
  await page.getByLabel("Тип знания").selectOption("object");

  await page.getByRole("button", { name: "Текущее состояние" }).click();
  await page.getByRole("radio", { name: /System design/ }).check();
  await page.getByLabel("Цель фокуса").fill(
    "Понять компромиссы consistency перед выбором следующей практики.",
  );
  await page.getByLabel("Основание выбора").fill(
    "Сначала хочу уточнить предметный контекст этого пробела.",
  );

  await page
    .getByRole("button", { name: "Изучить знания: System design" })
    .click();

  await expect(
    page.getByRole("heading", { name: "Знания", exact: true }),
  ).toBeVisible();
  await expect(
    page.locator(".knowledge-capability-scope"),
  ).toHaveText("System design");
  await expect(
    page.getByRole("textbox", { name: "Поиск", exact: true }),
  ).toHaveValue("");
  await expect(page.getByLabel("Тип знания")).toHaveValue("all");
  await expect(page.getByLabel("Форма знания")).toHaveValue("all");
  await expect(page.getByLabel("Семейство связи")).toHaveValue("all");
  await expect(page.getByLabel("Тип связи")).toHaveValue("all");

  await page
    .getByRole("button", { name: "Вернуться к выбору фокуса" })
    .click();

  await expect(
    page.getByRole("radio", { name: /System design/ }),
  ).toBeChecked();
  await expect(page.getByLabel("Цель фокуса")).toHaveValue(
    "Понять компромиссы consistency перед выбором следующей практики.",
  );
  await expect(page.getByLabel("Основание выбора")).toHaveValue(
    "Сначала хочу уточнить предметный контекст этого пробела.",
  );

  await page.getByRole("button", { name: "Знания", exact: true }).click();
  await expect(
    page.getByRole("textbox", { name: "Поиск", exact: true }),
  ).toHaveValue("event loop");
  await expect(page.getByLabel("Тип знания")).toHaveValue("object");
  await expect(page.getByLabel("Форма знания")).toHaveValue("all");
  await expect(page.getByLabel("Семейство связи")).toHaveValue("all");
  await expect(page.getByLabel("Тип связи")).toHaveValue("all");
  await expect(page.locator(".knowledge-capability-scope")).toHaveCount(0);
});

test("preserves a missing-support focus and routes to contextual preparation", async ({
  page,
}) => {
  await page.goto("/");
  await establishBackendTarget(page);
  await page.getByRole("button", { name: "Текущее состояние" }).click();

  await page
    .getByRole("radio", { name: /Коммуникация на собеседовании/ })
    .check();
  await page.getByRole("button", { name: "Выбрать фокус" }).click();

  await expect(page.getByText("Следующий фокус выбран")).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Подготовить недостающую поддержку" }),
  ).toBeVisible();
  await expect(
    page.getByRole("contentinfo").getByText("выбран"),
  ).toBeVisible();

  await page.getByRole("button", { name: "Подготовить недостающую поддержку" }).click();

  await expect(page.getByRole("heading", { name: "Подготовить поддержку" })).toBeVisible();
  await expect(
    page
      .getByRole("contentinfo")
      .getByText("Собеседование на Backend Engineer"),
  ).toBeVisible();
  await expect(
    page.getByRole("contentinfo").getByText("выбран"),
  ).toBeVisible();
});


test("keeps Knowledge table graph and details visible in a resizable admin workspace", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.addInitScript(() => {
    window.localStorage.removeItem("prep.knowledge.table-graph-ratio.v2");
    window.localStorage.removeItem("prep.knowledge.top-details-ratio.v2");
    window.localStorage.removeItem("prep.knowledge.column-widths.v3");
  });
  await page.goto("/");
  await establishBackendTarget(page);

  await page
    .getByRole("button", { name: "Открыть знания: System design" })
    .click();

  const knowledgeView = page.locator(
    '[data-view="knowledge"][data-renderer="nonspatial-primary"]',
  );
  await expect(knowledgeView).toBeVisible();
  await expect(knowledgeView).toHaveAttribute(
    "data-spatial-overview",
    "available",
  );
  await expect(page.locator(".app-sidebar")).toBeVisible();
  await expect(
    page.locator(".prep-navigation").getByRole("button", {
      name: "Знания",
      exact: true,
    }),
  ).toHaveAttribute("aria-current", "page");
  await expect(page.getByRole("table")).toBeVisible();
  await expect(page.getByText("7/7", { exact: true })).toBeVisible();
  await expect(page.getByText("System design", { exact: true })).toBeVisible();
  const relationshipRenderer = knowledgeView.locator(
    '[data-relationship-renderer="basic-2d"]',
  );
  await expect(relationshipRenderer).toBeVisible();
  await expect
    .poll(async () => (await relationshipRenderer.boundingBox())?.height ?? 0)
    .toBeGreaterThan(80);
  await expect(
    page.getByLabel("Детали знания").getByText("Выберите строку"),
  ).toBeVisible();

  const verticalDivider = page.getByRole("separator", {
    name: "Изменить ширину таблицы и графа",
  });
  const horizontalDivider = page.getByRole("separator", {
    name: "Изменить высоту таблицы и деталей",
  });
  await expect(verticalDivider).toBeVisible();
  await expect(horizontalDivider).toBeVisible();

  const graphBox = await page
    .getByLabel("Связи знаний")
    .boundingBox();
  expect(graphBox).not.toBeNull();
  if (graphBox) {
    expect(Math.abs(graphBox.width - graphBox.height)).toBeLessThanOrEqual(2);
  }

  const workbenchBox = await page.locator(".knowledge-workbench").boundingBox();
  const detailsBox = await page.getByLabel("Детали знания").boundingBox();
  expect(workbenchBox).not.toBeNull();
  expect(detailsBox).not.toBeNull();
  if (workbenchBox && detailsBox) {
    const workbenchBottom = workbenchBox.y + workbenchBox.height;
    const detailsBottom = detailsBox.y + detailsBox.height;
    expect(Math.abs(workbenchBottom - detailsBottom)).toBeLessThanOrEqual(2);
  }

  const initialTableRatio = Number(
    await verticalDivider.getAttribute("aria-valuenow"),
  );
  await verticalDivider.focus();
  await page.keyboard.press("ArrowLeft");
  await expect(verticalDivider).toHaveAttribute(
    "aria-valuenow",
    String(initialTableRatio - 2),
  );

  const initialTopRatio = Number(
    await horizontalDivider.getAttribute("aria-valuenow"),
  );
  await horizontalDivider.focus();
  await page.keyboard.press("ArrowUp");
  await expect(horizontalDivider).toHaveAttribute(
    "aria-valuenow",
    String(initialTopRatio - 2),
  );

  const storedSplits = await page.evaluate(() => ({
    tableGraph: Number(
      window.localStorage.getItem("prep.knowledge.table-graph-ratio.v2"),
    ),
    topDetails: Number(
      window.localStorage.getItem("prep.knowledge.top-details-ratio.v2"),
    ),
  }));
  expect(storedSplits.tableGraph).toBeCloseTo(initialTableRatio - 2, 0);
  expect(storedSplits.topDetails).toBeCloseTo(initialTopRatio - 2, 0);

  await verticalDivider.dblclick();
  await horizontalDivider.dblclick();

  const verticalBox = await verticalDivider.boundingBox();
  expect(verticalBox).not.toBeNull();
  if (verticalBox) {
    const beforeDrag = Number(
      await verticalDivider.getAttribute("aria-valuenow"),
    );
    await page.mouse.move(
      verticalBox.x + verticalBox.width / 2,
      verticalBox.y + verticalBox.height / 2,
    );
    await page.mouse.down();
    await page.mouse.move(
      verticalBox.x - 80,
      verticalBox.y + verticalBox.height / 2,
    );
    await page.mouse.up();
    const afterDrag = Number(
      await verticalDivider.getAttribute("aria-valuenow"),
    );
    expect(afterDrag).toBeLessThan(beforeDrag);
  }

  const horizontalBox = await horizontalDivider.boundingBox();
  expect(horizontalBox).not.toBeNull();
  if (horizontalBox) {
    const beforeDrag = Number(
      await horizontalDivider.getAttribute("aria-valuenow"),
    );
    await page.mouse.move(
      horizontalBox.x + horizontalBox.width / 2,
      horizontalBox.y + horizontalBox.height / 2,
    );
    await page.mouse.down();
    await page.mouse.move(
      horizontalBox.x + horizontalBox.width / 2,
      horizontalBox.y - 60,
    );
    await page.mouse.up();
    const afterDrag = Number(
      await horizontalDivider.getAttribute("aria-valuenow"),
    );
    expect(afterDrag).toBeLessThan(beforeDrag);
  }

  await page
    .locator(".knowledge-table")
    .getByRole("button", {
      name: /Выбор consistency-модели балансирует задержку/,
    })
    .click();

  await expect(
    page.getByLabel("Детали знания").getByRole("heading", {
      name: "Выбор consistency-модели балансирует задержку и координацию против гарантий актуальности.",
    }),
  ).toBeVisible();
  await expect(
    page
      .getByLabel("Детали знания")
      .getByText(
        "consistency-модель влияет на задержку, координацию и актуальность данных",
        { exact: true },
      ),
  ).toBeVisible();
  await expect(
    knowledgeView.locator('[data-relationship-renderer="basic-2d"]'),
  ).toBeVisible();

  await page
    .locator(".knowledge-table")
    .getByRole("button", { name: "Стратегия кэширования", exact: true })
    .click();
  await expect(
    page
      .locator(".knowledge-table")
      .getByRole("button", { name: "Стратегия кэширования", exact: true }),
  ).toHaveAttribute("aria-pressed", "true");
  await expect(
    page.getByLabel("Детали знания").getByRole("heading", {
      name: "Стратегия кэширования",
      exact: true,
    }),
  ).toBeVisible();

  await page.getByRole("button", { name: "Сбросить", exact: true }).click();
  await expect(page.getByText("25/25", { exact: true })).toBeVisible();

  const knowledgeScroll = page.locator(".knowledge-table-scroll");
  const graphNodes = knowledgeView.locator(".knowledge-relationship-node");
  await expect(graphNodes).toHaveCount(25);
  await knowledgeScroll.evaluate((element) => {
    element.scrollTop = 0;
  });
  await graphNodes.nth(12).click();

  const selectedRow = page.locator(
    '.knowledge-table tbody tr[data-selected="true"]',
  );
  await expect(selectedRow).toHaveCount(1);
  await expect
    .poll(async () =>
      selectedRow.evaluate((row) => {
        const scrollRegion = row.closest(".knowledge-table-scroll");
        if (!(scrollRegion instanceof HTMLElement)) {
          return Number.POSITIVE_INFINITY;
        }

        const rowRect = row.getBoundingClientRect();
        const scrollRect = scrollRegion.getBoundingClientRect();
        const rowCenter = rowRect.top + rowRect.height / 2;
        const scrollCenter = scrollRect.top + scrollRect.height / 2;
        return Math.abs(rowCenter - scrollCenter);
      }),
    )
    .toBeLessThan(40);

  const knowledgeTypeColumnDivider = page.getByRole("separator", {
    name: "Изменить ширину колонки «Тип / форма»",
  });
  const knowledgeRelationsColumnDivider = page.getByRole("separator", {
    name: "Изменить ширину колонки «Связи»",
  });
  await expect(knowledgeTypeColumnDivider).toBeVisible();
  await expect(knowledgeRelationsColumnDivider).toBeVisible();
  await expect(
    page.getByRole("separator", {
      name: "Изменить ширину колонки «Знание»",
    }),
  ).toHaveCount(0);

  const knowledgeTable = page.locator(".knowledge-table");
  const knowledgeTableViewport = page.locator(".knowledge-table-scroll");
  const primaryColumnHeader = knowledgeTable.locator("thead th").nth(0);

  await expect
    .poll(async () => {
      const tableBox = await knowledgeTable.boundingBox();
      return tableBox?.width ?? 0;
    })
    .toBeGreaterThan(0);

  const initialTableBox = await knowledgeTable.boundingBox();
  const initialViewportWidth = await knowledgeTableViewport.evaluate(
    (element) => element.clientWidth,
  );
  expect(initialTableBox).not.toBeNull();
  if (initialTableBox) {
    expect(Math.abs(initialTableBox.width - initialViewportWidth)).toBeLessThanOrEqual(2);
  }


  const typeWidthBeforeRelationsResize = Number(
    await knowledgeTypeColumnDivider.getAttribute("aria-valuenow"),
  );
  await knowledgeRelationsColumnDivider.focus();
  await page.keyboard.press("End");
  await expect(knowledgeRelationsColumnDivider).toHaveAttribute(
    "aria-valuenow",
    "140",
  );
  await expect(knowledgeTypeColumnDivider).toHaveAttribute(
    "aria-valuenow",
    String(typeWidthBeforeRelationsResize),
  );

  const primaryWidthBeforeRelationsResize = (await primaryColumnHeader.boundingBox())?.width ?? 0;
    const relationsDividerBox = await knowledgeRelationsColumnDivider.boundingBox();
  expect(relationsDividerBox).not.toBeNull();
  if (relationsDividerBox) {
    await page.mouse.move(
      relationsDividerBox.x + relationsDividerBox.width / 2,
      relationsDividerBox.y + relationsDividerBox.height / 2,
    );
    await page.mouse.down();
    await page.mouse.move(
      relationsDividerBox.x + 24,
      relationsDividerBox.y + relationsDividerBox.height / 2,
    );
    await page.mouse.up();
  }

  const relationsWidthAfterDrag = Number(
    await knowledgeRelationsColumnDivider.getAttribute("aria-valuenow"),
  );
  expect(relationsWidthAfterDrag).toBeLessThan(140);
  await expect(knowledgeTypeColumnDivider).toHaveAttribute(
    "aria-valuenow",
    String(typeWidthBeforeRelationsResize),
  );
  const primaryWidthAfterRelationsResize = (await primaryColumnHeader.boundingBox())?.width ?? 0;
  expect(primaryWidthAfterRelationsResize).toBeGreaterThan(
    primaryWidthBeforeRelationsResize,
  );

  await knowledgeRelationsColumnDivider.dblclick();
  const relationsWidthAfterAutoFit = Number(
    await knowledgeRelationsColumnDivider.getAttribute("aria-valuenow"),
  );
  expect(relationsWidthAfterAutoFit).toBeGreaterThanOrEqual(52);
  expect(relationsWidthAfterAutoFit).toBeLessThanOrEqual(140);
  await knowledgeRelationsColumnDivider.dblclick();
  await expect(knowledgeRelationsColumnDivider).toHaveAttribute(
    "aria-valuenow",
    String(relationsWidthAfterAutoFit),
  );

  const knowledgeTableBox = await knowledgeTable.boundingBox();
  const viewportWidthAfterResize = await knowledgeTableViewport.evaluate(
    (element) => element.clientWidth,
  );
  expect(knowledgeTableBox).not.toBeNull();
  if (knowledgeTableBox) {
    expect(
      Math.abs(knowledgeTableBox.width - viewportWidthAfterResize),
    ).toBeLessThanOrEqual(2);
  }

  const persistedRelationsColumnWidth = Number(
    await knowledgeRelationsColumnDivider.getAttribute("aria-valuenow"),
  );
  const storedColumnWidths = await page.evaluate(() => {
    const raw = window.localStorage.getItem("prep.knowledge.column-widths.v3");
    if (!raw) {
      return null;
    }

    const stored = JSON.parse(raw) as {
      version: number;
      widths: Record<string, number>;
    };
    return stored.widths;
  });
  expect(storedColumnWidths?.relations).toBe(persistedRelationsColumnWidth);

  await page
    .locator(".knowledge-table")
    .getByRole("button", { name: "Стратегия кэширования", exact: true })
    .click();
  await page.getByRole("button", { name: "Цель", exact: true }).click();
  await page.getByRole("button", { name: "Знания", exact: true }).click();

  await expect(
    page
      .locator(".knowledge-table")
      .getByRole("button", { name: "Стратегия кэширования", exact: true }),
  ).toHaveAttribute("aria-pressed", "true");
  await expect(
    page.getByLabel("Детали знания").getByRole("heading", {
      name: "Стратегия кэширования",
      exact: true,
    }),
  ).toBeVisible();
  await expect(knowledgeRelationsColumnDivider).toHaveAttribute(
    "aria-valuenow",
    String(persistedRelationsColumnWidth),
  );

  await expect(page.getByLabel("Тип знания").locator("option")).toHaveText([
    "Все виды",
    "Объект",
    "Утверждение",
  ]);
  await expect(page.getByLabel("Форма знания").locator("option")).toHaveText([
    "Все формы",
    "Понятие",
    "Механизм",
    "Модель",
    "Процедура",
    "Свойство",
    "Стратегия",
  ]);
  await expect(page.getByLabel("Семейство связи").locator("option")).toHaveText([
    "Все семейства связей",
    "Часть — целое",
    "Проблема — решение",
    "Создание и преобразование",
    "Реализация",
    "Классификация",
  ]);
  await expect(page.getByLabel("Тип связи").locator("option")).toHaveText([
    "Все типы связей",
    "решает проблему",
    "часть целого",
    "создаёт",
    "реализует",
    "является специализацией",
  ]);

  const viewportState = await page.evaluate(() => ({
    innerHeight: window.innerHeight,
    documentHeight: document.documentElement.scrollHeight,
  }));
  expect(viewportState.documentHeight).toBeLessThanOrEqual(
    viewportState.innerHeight + 1,
  );

  await page.getByLabel("Тип знания").selectOption("object");
  await expect(page.getByText("17/25", { exact: true })).toBeVisible();

  await page.getByLabel("Форма знания").selectOption("mechanism");
  await expect(page.getByText("5/25", { exact: true })).toBeVisible();

  await page.getByRole("button", { name: "Сбросить", exact: true }).click();

  await page.getByLabel("Семейство связи").selectOption("partitive");
  await expect(page.getByText("2/25", { exact: true })).toBeVisible();
  await expect(page.getByLabel("Тип связи")).toHaveValue("all");
  await expect(
    page.getByLabel("Тип связи").locator('option[value="part_of"]'),
  ).toHaveText("часть целого");

  await page.getByLabel("Тип связи").selectOption("part_of");
  await expect(
    page.locator('[data-predicate="part_of"]'),
  ).toHaveCount(1);
  await expect(
    page
      .locator(".knowledge-relationship-edge-label")
      .getByText("часть целого"),
  ).toBeVisible();

  await page
    .locator(".knowledge-table")
    .getByRole("button", { name: "Очередь задач", exact: true })
    .click();
  await expect(
    page
      .getByLabel("Детали знания")
      .getByText("часть целого", { exact: true }),
  ).toBeVisible();
  await expect(
    page
      .getByLabel("Детали знания")
      .getByText(
        "Очередь задач является составной частью JavaScript Event Loop.",
        { exact: true },
      ),
  ).toBeVisible();
  await expect(
    page.getByLabel("Детали знания").getByRole("button", {
      name: "JavaScript Event Loop",
      exact: true,
    }),
  ).toBeVisible();

  await page.getByRole("button", { name: "Сбросить", exact: true }).click();
  await page.getByLabel("Тип знания").selectOption("object");

  const query = page.getByRole("textbox", { name: "Поиск", exact: true });
  await query.fill("event loop");
  await expect(page.getByText("1/3", { exact: true })).toBeVisible();

  await page.getByRole("button", { name: "Цель", exact: true }).click();
  await page.getByRole("button", { name: "Знания", exact: true }).click();

  await expect(
    page.getByRole("textbox", { name: "Поиск", exact: true }),
  ).toHaveValue("event loop");
  await expect(page.getByLabel("Тип знания")).toHaveValue("object");
  await expect(page.getByLabel("Форма знания")).toHaveValue("all");
  await expect(page.getByLabel("Семейство связи")).toHaveValue("all");
  await expect(page.getByLabel("Тип связи")).toHaveValue("all");
  await expect(page.locator(".knowledge-capability-scope")).toHaveCount(0);
});

test("preserves accepted Next focus context when entering Knowledge", async ({
  page,
}) => {
  await page.goto("/");
  await establishBackendTarget(page);
  await page.getByRole("button", { name: "Текущее состояние" }).click();
  await page.getByRole("radio", { name: /System design/ }).check();
  await page.getByRole("button", { name: "Выбрать фокус" }).click();

  await page.getByRole("button", { name: "Знания", exact: true }).click();

  await expect(
    page.getByRole("heading", { name: "Знания", exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole("contentinfo").getByText("выбран"),
  ).toBeVisible();
  await expect(page.locator(".preparation-shell--admin[data-destination=\"knowledge\"]")).toBeVisible();
});


test("performs one Попытка практики without fabricating learner progress", async ({
  page,
}) => {
  await page.goto("/");
  await establishBackendTarget(page);
  await page.getByRole("button", { name: "Текущее состояние" }).click();
  await page.getByRole("radio", { name: /System design/ }).check();
  await page.getByRole("button", { name: "Выбрать фокус" }).click();
  await page.getByRole("button", { name: "Перейти к практике" }).click();

  await expect(
    page.getByRole("heading", { name: "Проработайте выбранный фокус" }),
  ).toBeVisible();
  await expect(page.getByText("Снизить неопределённость в рассуждении о компромиссах system design.", { exact: true })).toBeVisible();
  await expect(
    page.getByText(
      "Высокая значимость для цели и доступна подходящая поддержка.",
      { exact: true },
    ),
  ).toBeVisible();

  await expect(page.getByText("Задача на consistency кэша", { exact: true })).toBeVisible();
  await expect(page.getByText("Компетенция: System design", { exact: true })).toBeVisible();
  await expect(
    page.getByText(
      "Напрямую проверяет проблемное рассуждение о consistency.",
      { exact: true },
    ),
  ).toBeVisible();

  await page.getByRole("button", { name: "Начать практику" }).click();

  await expect(page.getByRole("heading", { name: "Попытка практики" })).toBeVisible();
  await expect(page.getByText("активна", { exact: true })).toBeVisible();

  await page
    .getByLabel("Что произошло")
    .fill("Completed the cache consistency design case and explained the trade-offs.");
  await page
    .getByLabel("Источник результата")
    .fill("Observed deterministic prototype attempt");

  await page.getByRole("button", { name: "Завершить попытку" }).click();

  await expect(page.getByRole("heading", { name: "Результат попытки отправлен" })).toBeVisible();
  await expect(
    page.getByText(
      "Сам факт завершения не подтверждает компетенцию и не закрывает пробел.",
      { exact: false },
    ),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Завершить попытку" }),
  ).toHaveCount(0);

  await page
    .getByRole("button", { name: "Проверить свидетельства и изменения" })
    .click();

  await expect(
    page.getByRole("heading", { name: "Проверьте, что изменилось после практики" }),
  ).toBeVisible();
  await expect(page.getByText("неопределённость выросла", { exact: true })).toBeVisible();
  await expect(page.getByText("без изменений", { exact: true })).toBeVisible();
  await expect(
    page.getByText(
      "Практика добавила проверяемые свидетельства, но выявила ещё одно неразрешённое допущение; требования цели не изменились.",
      { exact: true },
    ),
  ).toBeVisible();

  await page.getByText("Показать факты и их источники").click();
  await expect(
    page.getByText(
      "Повторная практика выявила ещё одно неразрешённое допущение о consistency.",
      { exact: true },
    ),
  ).toBeVisible();
  await expect(
    page.getByText("Источник: Разбор повторной system design-практики", { exact: true }),
  ).toBeVisible();

  const reviewedSystemDesignState = page
    .locator(".current-state-after-region .state-card")
    .filter({ hasText: "System design" });
  await expect(
    reviewedSystemDesignState.getByText("оспорено", { exact: true }),
  ).toBeVisible();

  await expect(page.getByText(/progress score/i)).toHaveCount(0);
  await expect(
    page.getByRole("button", { name: "Продолжить текущий фокус" }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Вернуться к текущему состоянию" }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Открыть знания" }),
  ).toBeVisible();

  await page.getByRole("button", { name: "Вернуться к текущему состоянию" }).click();
  const systemDesignState = page
    .locator(".state-card")
    .filter({ hasText: "System design" });
  await expect(systemDesignState.getByText("оспорено", { exact: true })).toBeVisible();
});

test("routes an Activity with no suitable support to contextual preparation", async ({
  page,
}) => {
  await page.goto("/");
  await establishBackendTarget(page);
  await page.getByRole("button", { name: "Текущее состояние" }).click();
  await page.getByRole("radio", { name: /Коммуникация на собеседовании/ }).check();
  await page.getByRole("button", { name: "Выбрать фокус" }).click();

  await page.getByRole("button", { name: "Практика", exact: true }).click();

  await expect(
    page.getByRole("heading", { name: "Проработайте выбранный фокус" }),
  ).toBeVisible();
  await expect(
    page.getByText("Подходящая поддержка пока не подготовлена.", { exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole("contentinfo").getByText("выбран"),
  ).toBeVisible();

  await page.getByRole("button", { name: "Подготовить поддержку" }).click();

  await expect(page.getByRole("heading", { name: "Подготовить поддержку" })).toBeVisible();
  await expect(
    page.getByRole("contentinfo").getByText("выбран"),
  ).toBeVisible();
  await expect(page.getByText("Вернуться в: Практика", { exact: true })).toBeVisible();
  await expect(page.getByLabel("Недостающая поддержка")).toHaveValue(
    "Для выбранного фокуса пока нет подходящей поддержки.",
  );
  await expect(page.getByLabel("Источник контекста")).toHaveValue(
    "Текущий контекст подготовки: Практика",
  );
  await expect(page.getByText(/corpus CRUD|import schema|item repair/i)).toHaveCount(0);

  await page.getByRole("button", { name: "Подготовить поддержку" }).click();

  await expect(
    page.getByRole("heading", { name: "Подготовленная поддержка и оставшиеся вопросы" }),
  ).toBeVisible();
  await expect(page.getByText("Шаблон рассказа об инженерном решении", { exact: true })).toBeVisible();
  await expect(
    page.getByText("Компетенция: Коммуникация на собеседовании", { exact: true }),
  ).toBeVisible();
  await expect(
    page.getByText("Критерии оценки на конкретном собеседовании", { exact: true }),
  ).toBeVisible();
  await expect(page.getByText("не разрешено", { exact: true })).toBeVisible();
  await expect(
    page.getByText("Доступность mock-интервьюера", { exact: true }),
  ).toBeVisible();
  await expect(page.getByText("отклонено", { exact: true })).toBeVisible();
  await expect(
    page.getByText(
      "Принятую поддержку можно использовать, даже если часть запроса остаётся неразрешённой или отклонена.",
      { exact: false },
    ),
  ).toBeVisible();

  await page.getByRole("button", { name: "Обновить результат" }).click();
  await expect(page.getByText("Шаблон рассказа об инженерном решении", { exact: true })).toBeVisible();

  await page.getByRole("button", { name: "Вернуться: Практика" }).last().click();

  await expect(
    page.getByRole("heading", { name: "Проработайте выбранный фокус" }),
  ).toBeVisible();
  await expect(page.getByText("Шаблон рассказа об инженерном решении", { exact: true })).toBeVisible();
  await expect(
    page.getByRole("contentinfo").getByText("выбран"),
  ).toBeVisible();
});


for (const viewport of [
  { name: "wide", width: 1280, height: 900 },
  { name: "compact", width: 800, height: 900 },
  { name: "narrow", width: 390, height: 844 },
] as const) {
  test(`preserves semantic hierarchy and context in ${viewport.name} viewport`, async ({
    page,
  }) => {
    await page.setViewportSize({
      width: viewport.width,
      height: viewport.height,
    });
    await page.goto("/");
    await establishBackendTarget(page);

    await expect(
      page.locator(".app-sidebar .active-context"),
    ).toBeVisible();
    await expect(
      page.locator("main.active-child"),
    ).toBeVisible();

    await page.getByRole("button", { name: "Текущее состояние" }).click();
    await page.getByRole("radio", { name: /System design/ }).check();
    await page.getByRole("button", { name: "Выбрать фокус" }).click();

    await page.getByRole("button", { name: "Знания", exact: true }).click();
    await expect(
      page.getByRole("heading", {
        name: "Знания",
      }),
    ).toBeVisible();
    await expect(
      page
        .getByRole("contentinfo")
        .getByText("Собеседование на Backend Engineer"),
    ).toBeVisible();
    await expect(
      page.getByRole("contentinfo").getByText("выбран"),
    ).toBeVisible();

    await page.getByRole("button", { name: "Практика", exact: true }).click();
    await expect(
      page.getByRole("heading", { name: "Проработайте выбранный фокус" }),
    ).toBeVisible();

    const overflow = await page.locator("html").evaluate((element) => ({
      clientWidth: element.clientWidth,
      scrollWidth: element.scrollWidth,
    }));
    expect(overflow.scrollWidth).toBeLessThanOrEqual(
      overflow.clientWidth + 1,
    );
  });
}

test("completes a representative preparation path with keyboard interaction only", async ({
  page,
}) => {
  await page.goto("/");

  const backend = page.getByRole("checkbox", {
    name: /Собеседование на Backend Engineer/,
  });
  await tabTo(page, backend);
  await page.keyboard.press("Space");

  const platform = page.getByRole("checkbox", {
    name: /Собеседование на Platform Engineer/,
  });
  await tabTo(page, platform);
  await page.keyboard.press("Space");

  const compare = page.getByRole("button", { name: "Сравнить выбранные" });
  await tabTo(page, compare);
  await page.keyboard.press("Enter");

  const backendChoice = page.getByRole("radio", {
    name: "Собеседование на Backend Engineer",
  });
  await tabTo(page, backendChoice);
  await page.keyboard.press("Space");

  const continueTarget = page.getByRole("button", {
    name: "Продолжить с выбранной целью",
  });
  await tabTo(page, continueTarget);
  await page.keyboard.press("Enter");

  const establish = page.getByRole("button", { name: "Зафиксировать цель" });
  await tabTo(page, establish);
  await page.keyboard.press("Enter");
  await expect(
    page.getByRole("heading", { name: "Что требуется для этой цели" }),
  ).toBeVisible();

  const current = page.getByRole("button", { name: "Текущее состояние" });
  await tabTo(page, current);
  await page.keyboard.press("Enter");

  const systemDesign = page.getByRole("radio", { name: /System design/ });
  await tabTo(page, systemDesign);
  await page.keyboard.press("Space");

  const setFocus = page.getByRole("button", { name: "Выбрать фокус" });
  await tabTo(page, setFocus);
  await page.keyboard.press("Enter");

  const continueActivity = page.getByRole("button", {
    name: "Перейти к практике",
  });
  await tabTo(page, continueActivity);
  await page.keyboard.press("Enter");

  const startActivity = page.getByRole("button", { name: "Начать практику" });
  await tabTo(page, startActivity);
  await page.keyboard.press("Enter");

  const result = page.getByLabel("Что произошло");
  await tabTo(page, result);
  await page.keyboard.type(
    "Completed the keyboard-only system design attempt.",
  );

  const provenance = page.getByLabel("Источник результата");
  await tabTo(page, provenance);
  await page.keyboard.type("Keyboard-only prototype observation");

  const submit = page.getByRole("button", {
    name: "Завершить попытку",
  });
  await tabTo(page, submit);
  await page.keyboard.press("Enter");

  const review = page.getByRole("button", {
    name: "Проверить свидетельства и изменения",
  });
  await tabTo(page, review);
  await page.keyboard.press("Enter");

  await expect(
    page.getByRole("heading", {
      name: "Проверьте, что изменилось после практики",
    }),
  ).toBeVisible();
});

test("remains task-complete with reduced-motion preference", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");

  expect(
    await page.evaluate(() =>
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    ),
  ).toBe(true);

  await establishBackendTarget(page);
  await page.getByRole("button", { name: "Знания", exact: true }).click();
  await expect(
    page.locator('[data-view="knowledge"][data-renderer="nonspatial-primary"]'),
  ).toBeVisible();

  const movingElements = await page.evaluate(() =>
    Array.from(document.querySelectorAll("body *"))
      .filter((element) => {
        const style = window.getComputedStyle(element);
        const hasAnimation =
          style.animationName !== "none" &&
          style.animationDuration
            .split(",")
            .some((value) => Number.parseFloat(value) > 0);
        const hasTransition = style.transitionDuration
          .split(",")
          .some((value) => Number.parseFloat(value) > 0);
        return hasAnimation || hasTransition;
      })
      .map((element) => element.tagName.toLowerCase()),
  );

  expect(movingElements).toEqual([]);
});

test("uses declared composition variants without hidden route modes", async ({
  page,
}) => {
  await page.goto("/");

  const targets = page.locator('[data-view="targets"]');
  await expect(targets).toHaveAttribute("data-variant", "candidate-selection");

  await page
    .getByRole("checkbox", { name: /Собеседование на Backend Engineer/ })
    .check();
  await page
    .getByRole("checkbox", { name: /Собеседование на Platform Engineer/ })
    .check();
  await page.getByRole("button", { name: "Сравнить выбранные" }).click();
  await expect(targets).toHaveAttribute("data-variant", "comparison-ready");

  await page
    .getByRole("radio", { name: "Собеседование на Backend Engineer" })
    .check();
  await page
    .getByRole("button", { name: "Продолжить с выбранной целью" })
    .click();

  const target = page.locator('[data-view="target"]');
  await expect(target).toHaveAttribute("data-variant", "target-setup");
  await page.getByRole("button", { name: "Зафиксировать цель" }).click();
  await expect(target).toHaveAttribute("data-variant", "target-established");

  await page.getByRole("button", { name: "Текущее состояние" }).click();
  await page.getByRole("radio", { name: /System design/ }).check();
  await page.getByRole("button", { name: "Выбрать фокус" }).click();
  await page.getByRole("button", { name: "Перейти к практике" }).click();

  const activity = page.locator('[data-view="activity"]');
  await expect(activity).toHaveAttribute("data-variant", "support-selection");
  await page.getByRole("button", { name: "Начать практику" }).click();
  await expect(activity).toHaveAttribute("data-variant", "attempt-active");

  await page
    .getByLabel("Что произошло")
    .fill("Completed the composition-variant activity attempt.");
  await page
    .getByLabel("Источник результата")
    .fill("Composition-variant prototype observation");
  await page.getByRole("button", { name: "Завершить попытку" }).click();
  await expect(activity).toHaveAttribute("data-variant", "evidence-processing");
});

test("covers Подготовить поддержку request, result, and recovery variants", async ({
  page,
}) => {
  await page.goto("/");
  await compareAndContinueWithBackend(page);

  await page
    .getByRole("button", { name: "Подготовить недостающую поддержку" })
    .click();

  const prepare = page.locator('[data-view="prepare-support"]');
  await expect(prepare).toHaveAttribute(
    "data-variant",
    "continuation-recovery",
  );
  await expect(
    page.getByRole("button", { name: "Подготовить поддержку" }),
  ).toBeDisabled();

  await page.getByRole("button", { name: "Вернуться: Цель" }).click();
  await page.getByRole("button", { name: "Зафиксировать цель" }).click();
  await page.getByRole("button", { name: "Текущее состояние" }).click();
  await page.getByRole("radio", { name: /Коммуникация на собеседовании/ }).check();
  await page.getByRole("button", { name: "Выбрать фокус" }).click();
  await page.getByRole("button", { name: "Подготовить недостающую поддержку" }).click();

  const acceptedPrepare = page.locator('[data-view="prepare-support"]');
  await expect(acceptedPrepare).toHaveAttribute(
    "data-variant",
    "request-input",
  );
  await page
    .getByRole("button", { name: "Подготовить поддержку" })
    .click();
  await expect(acceptedPrepare).toHaveAttribute(
    "data-variant",
    "result-review",
  );
});

import {
  type CSSProperties,
  type KeyboardEvent as ReactKeyboardEvent,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";

export interface DataTableColumn<Row> {
  readonly id: string;
  readonly header: string;
  readonly minWidth: number;
  readonly maxWidth: number;
  readonly align?: "left" | "right" | undefined;
  readonly render: (row: Row) => ReactNode;
}

export interface DataTableProps<Row> {
  readonly columns: readonly DataTableColumn<Row>[];
  readonly rows: readonly Row[];
  readonly getRowKey: (row: Row) => string;
  readonly selectedRowKey?: string | null | undefined;
  readonly storageKey?: string | undefined;
  readonly ariaLabel?: string | undefined;
  readonly className?: string | undefined;
  readonly tableClassName?: string | undefined;
}

interface StoredColumnWidths {
  readonly version: 1;
  readonly widths: Readonly<Record<string, number>>;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function readStoredWidths<Row>(
  storageKey: string | undefined,
  columns: readonly DataTableColumn<Row>[],
): number[] | null {
  if (!storageKey || typeof window === "undefined") {
    return null;
  }

  const raw = window.localStorage.getItem(storageKey);
  if (!raw) {
    return null;
  }

  try {
    const parsed: unknown = JSON.parse(raw);
    if (
      typeof parsed !== "object" ||
      parsed === null ||
      !("version" in parsed) ||
      parsed.version !== 1 ||
      !("widths" in parsed) ||
      typeof parsed.widths !== "object" ||
      parsed.widths === null
    ) {
      return null;
    }

    const stored = parsed as StoredColumnWidths;
    const widths = columns.map((column) => stored.widths[column.id]);
    if (!widths.every((width) => typeof width === "number" && Number.isFinite(width))) {
      return null;
    }

    return columns.map((column, index) =>
      clamp(widths[index] ?? column.minWidth, column.minWidth, column.maxWidth),
    );
  } catch {
    return null;
  }
}

function measureContentWidths<Row>(
  table: HTMLTableElement,
  columns: readonly DataTableColumn<Row>[],
): number[] {
  const clone = table.cloneNode(true) as HTMLTableElement;
  clone.querySelector("colgroup")?.remove();
  clone.querySelectorAll(".data-table-column-resizer").forEach((element) => {
    element.remove();
  });
  clone.setAttribute("aria-hidden", "true");
  clone.style.position = "fixed";
  clone.style.top = "0";
  clone.style.left = "-10000px";
  clone.style.width = "max-content";
  clone.style.minWidth = "0";
  clone.style.tableLayout = "auto";
  clone.style.visibility = "hidden";
  clone.style.pointerEvents = "none";
  document.body.append(clone);

  const widths = columns.map((column, columnIndex) => {
    const cells = clone.querySelectorAll<HTMLElement>(
      `tr > :nth-child(${columnIndex + 1})`,
    );
    const measured = Math.ceil(
      Math.max(
        column.minWidth,
        ...Array.from(cells, (cell) => cell.getBoundingClientRect().width),
      ),
    );
    return clamp(measured, column.minWidth, column.maxWidth);
  });

  clone.remove();
  return widths;
}

export function DataTable<Row>({
  columns,
  rows,
  getRowKey,
  selectedRowKey = null,
  storageKey,
  ariaLabel,
  className,
  tableClassName,
}: DataTableProps<Row>) {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const tableRef = useRef<HTMLTableElement | null>(null);
  const [columnWidths, setColumnWidths] = useState<number[] | null>(() =>
    readStoredWidths(storageKey, columns),
  );
  const resizeRef = useRef<{
    columnIndex: number;
    startX: number;
    widths: number[];
  } | null>(null);

  useLayoutEffect(() => {
    if (columnWidths || rows.length === 0) {
      return;
    }

    const table = tableRef.current;
    if (!table) {
      return;
    }

    setColumnWidths(measureContentWidths(table, columns));
  }, [columnWidths, columns, rows.length]);

  useEffect(() => {
    if (!storageKey || !columnWidths) {
      return;
    }

    const widths = Object.fromEntries(
      columns.map((column, index) => [column.id, columnWidths[index] ?? column.minWidth]),
    );
    const stored: StoredColumnWidths = { version: 1, widths };
    window.localStorage.setItem(storageKey, JSON.stringify(stored));
  }, [columnWidths, columns, storageKey]);

  useEffect(() => {
    if (!selectedRowKey) {
      return;
    }

    const frame = window.requestAnimationFrame(() => {
      const scrollRegion = scrollRef.current;
      const selectedRow =
        scrollRegion?.querySelector<HTMLTableRowElement>(
          'tbody tr[data-selected="true"]',
        ) ?? null;
      if (!scrollRegion || !selectedRow) {
        return;
      }

      const scrollRect = scrollRegion.getBoundingClientRect();
      const rowRect = selectedRow.getBoundingClientRect();
      const targetTop = clamp(
        scrollRegion.scrollTop +
          (rowRect.top - scrollRect.top) -
          (scrollRegion.clientHeight - rowRect.height) / 2,
        0,
        Math.max(0, scrollRegion.scrollHeight - scrollRegion.clientHeight),
      );
      const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      scrollRegion.scrollTo({
        top: targetTop,
        behavior: reducedMotion ? "auto" : "smooth",
      });
    });

    return () => window.cancelAnimationFrame(frame);
  }, [selectedRowKey]);

  function currentWidths(): number[] | null {
    if (columnWidths) {
      return columnWidths;
    }

    const headers = tableRef.current?.querySelectorAll("thead th");
    if (!headers || headers.length !== columns.length) {
      return null;
    }

    return Array.from(headers, (header) =>
      Math.round(header.getBoundingClientRect().width),
    );
  }

  function setColumnWidth(columnIndex: number, desiredWidth: number) {
    const widths = currentWidths();
    const column = columns[columnIndex];
    if (!widths || !column) {
      return;
    }

    const next = [...widths];
    next[columnIndex] = Math.round(
      clamp(desiredWidth, column.minWidth, column.maxWidth),
    );
    setColumnWidths(next);
  }

  function resizeColumn(
    columnIndex: number,
    delta: number,
    baseWidths: readonly number[],
  ) {
    const column = columns[columnIndex];
    const baseWidth = baseWidths[columnIndex];
    if (!column || baseWidth === undefined) {
      return;
    }

    const next = [...baseWidths];
    next[columnIndex] = Math.round(
      clamp(baseWidth + delta, column.minWidth, column.maxWidth),
    );
    setColumnWidths(next);
  }

  function startResize(
    columnIndex: number,
    event: ReactPointerEvent<HTMLHRElement>,
  ) {
    const widths = currentWidths();
    if (!widths) {
      return;
    }

    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    setColumnWidths(widths);
    resizeRef.current = {
      columnIndex,
      startX: event.clientX,
      widths,
    };
  }

  function moveResize(
    columnIndex: number,
    event: ReactPointerEvent<HTMLHRElement>,
  ) {
    const active = resizeRef.current;
    if (
      !active ||
      active.columnIndex !== columnIndex ||
      !event.currentTarget.hasPointerCapture(event.pointerId)
    ) {
      return;
    }

    resizeColumn(
      columnIndex,
      event.clientX - active.startX,
      active.widths,
    );
  }

  function stopResize(event: ReactPointerEvent<HTMLHRElement>) {
    resizeRef.current = null;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  }

  function autoSizeColumn(columnIndex: number) {
    const table = tableRef.current;
    if (!table) {
      return;
    }

    const widths = measureContentWidths(table, columns);
    const width = widths[columnIndex];
    if (width !== undefined) {
      setColumnWidth(columnIndex, width);
    }
  }

  function handleResizeKey(
    columnIndex: number,
    event: ReactKeyboardEvent<HTMLHRElement>,
  ) {
    const widths = currentWidths();
    const column = columns[columnIndex];
    const width = widths?.[columnIndex];
    if (!widths || !column || width === undefined) {
      return;
    }

    if (event.key === "ArrowLeft") {
      event.preventDefault();
      resizeColumn(columnIndex, -8, widths);
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      resizeColumn(columnIndex, 8, widths);
    } else if (event.key === "Home") {
      event.preventDefault();
      setColumnWidth(columnIndex, column.minWidth);
    } else if (event.key === "End") {
      event.preventDefault();
      setColumnWidth(columnIndex, column.maxWidth);
    }
  }

  const managedWidth = columnWidths?.reduce((sum, width) => sum + width, 0);
  const tableStyle: CSSProperties | undefined =
    managedWidth === undefined
      ? { width: "max-content", tableLayout: "auto" }
      : { width: `${managedWidth}px`, tableLayout: "fixed" };

  return (
    <div
      ref={scrollRef}
      className={["data-table-scroll", className].filter(Boolean).join(" ")}
    >
      <table
        ref={tableRef}
        className={["data-table", tableClassName].filter(Boolean).join(" ")}
        aria-label={ariaLabel}
        data-column-widths={columnWidths ? "managed" : "auto"}
        style={tableStyle}
      >
        {columnWidths ? (
          <colgroup>
            {columns.map((column, index) => (
              <col
                key={column.id}
                style={{ width: `${columnWidths[index] ?? column.minWidth}px` }}
              />
            ))}
          </colgroup>
        ) : null}
        <thead>
          <tr>
            {columns.map((column, columnIndex) => (
              <th
                key={column.id}
                scope="col"
                style={{ textAlign: column.align ?? "left" }}
              >
                <span className="data-table-header-label">{column.header}</span>
                <hr
                  className="data-table-column-resizer"
                  aria-label={`Изменить ширину колонки «${column.header}»`}
                  aria-orientation="vertical"
                  aria-valuemin={column.minWidth}
                  aria-valuemax={column.maxWidth}
                  aria-valuenow={columnWidths?.[columnIndex]}
                  tabIndex={0}
                  onDoubleClick={() => autoSizeColumn(columnIndex)}
                  onPointerDown={(event) => startResize(columnIndex, event)}
                  onPointerMove={(event) => moveResize(columnIndex, event)}
                  onPointerUp={stopResize}
                  onPointerCancel={stopResize}
                  onKeyDown={(event) => handleResizeKey(columnIndex, event)}
                />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => {
            const rowKey = getRowKey(row);
            return (
              <tr
                key={rowKey}
                data-selected={rowKey === selectedRowKey ? "true" : "false"}
              >
                {columns.map((column) => (
                  <td
                    key={column.id}
                    style={{ textAlign: column.align ?? "left" }}
                  >
                    {column.render(row)}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

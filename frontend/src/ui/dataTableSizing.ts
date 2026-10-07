export interface DataTableSizingColumn {
  readonly minWidth: number;
  readonly maxWidth: number;
  readonly flex?: number | undefined;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export function resolveDataTableWidths(
  columns: readonly DataTableSizingColumn[],
  preferredWidths: readonly number[],
  availableWidth: number,
): number[] {
  const widths = columns.map((column, index) =>
    clamp(
      preferredWidths[index] ?? column.minWidth,
      column.minWidth,
      column.maxWidth,
    ),
  );
  const flexIndexes = columns
    .map((column, index) => ({ column, index }))
    .filter(({ column }) => (column.flex ?? 0) > 0)
    .map(({ index }) => index);

  if (flexIndexes.length === 0 || availableWidth <= 0) {
    return widths.map(Math.round);
  }

  let remaining =
    availableWidth - widths.reduce((total, width) => total + width, 0);
  let active = [...flexIndexes];

  while (active.length > 0 && Math.abs(remaining) >= 0.5) {
    const totalFlex = active.reduce(
      (total, index) => total + (columns[index]?.flex ?? 0),
      0,
    );
    if (totalFlex <= 0) {
      break;
    }

    let consumed = 0;
    const nextActive: number[] = [];

    for (const index of active) {
      const column = columns[index];
      if (!column) {
        continue;
      }

      const share = remaining * ((column.flex ?? 0) / totalFlex);
      const current = widths[index] ?? column.minWidth;
      const next = clamp(current + share, column.minWidth, column.maxWidth);
      widths[index] = next;
      consumed += next - current;

      const canContinue =
        remaining > 0
          ? next < column.maxWidth - 0.25
          : next > column.minWidth + 0.25;
      if (canContinue) {
        nextActive.push(index);
      }
    }

    if (Math.abs(consumed) < 0.25) {
      break;
    }

    remaining -= consumed;
    active = nextActive;
  }

  const rounded = widths.map(Math.round);
  let correction =
    Math.round(availableWidth) -
    rounded.reduce((total, width) => total + width, 0);

  if (correction !== 0) {
    const direction = correction > 0 ? 1 : -1;
    for (const index of flexIndexes) {
      const column = columns[index];
      if (!column) {
        continue;
      }

      const current = rounded[index] ?? column.minWidth;
      const capacity =
        direction > 0
          ? Math.max(0, Math.floor(column.maxWidth - current))
          : Math.max(0, Math.floor(current - column.minWidth));
      const adjustment =
        direction * Math.min(Math.abs(correction), capacity);
      rounded[index] = current + adjustment;
      correction -= adjustment;

      if (correction === 0) {
        break;
      }
    }
  }

  return rounded;
}

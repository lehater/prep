import {
  type CSSProperties,
  type KeyboardEvent as ReactKeyboardEvent,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
  useRef,
} from "react";

export interface ResizableSplitProps {
  readonly orientation: "vertical" | "horizontal";
  readonly ratio: number;
  readonly minRatio: number;
  readonly maxRatio: number;
  readonly firstMinSize?: number | undefined;
  readonly secondMinSize?: number | undefined;
  readonly separatorSize?: number | undefined;
  readonly step?: number | undefined;
  readonly ariaLabel: string;
  readonly first: ReactNode;
  readonly second: ReactNode;
  readonly className?: string | undefined;
  readonly onRatioChange: (ratio: number) => void;
  readonly onReset?: (() => void) | undefined;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export function ResizableSplit({
  orientation,
  ratio,
  minRatio,
  maxRatio,
  firstMinSize = 0,
  secondMinSize = 0,
  separatorSize = 3,
  step = 2,
  ariaLabel,
  first,
  second,
  className,
  onRatioChange,
  onReset,
}: ResizableSplitProps) {
  const rootRef = useRef<HTMLDivElement | null>(null);

  function boundedRatio(clientPosition: number): number | null {
    const rect = rootRef.current?.getBoundingClientRect();
    if (!rect) {
      return null;
    }

    const size = orientation === "vertical" ? rect.width : rect.height;
    const start = orientation === "vertical" ? rect.left : rect.top;
    if (size <= 0) {
      return null;
    }

    const minByFirst = (Math.min(firstMinSize, size) / size) * 100;
    const maxBySecond =
      ((size - Math.min(secondMinSize, size) - separatorSize) / size) * 100;

    return clamp(
      ((clientPosition - start) / size) * 100,
      Math.max(minRatio, minByFirst),
      Math.min(maxRatio, maxBySecond),
    );
  }

  function startPointerResize(event: ReactPointerEvent<HTMLDivElement>) {
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function movePointerResize(event: ReactPointerEvent<HTMLDivElement>) {
    if (!event.currentTarget.hasPointerCapture(event.pointerId)) {
      return;
    }

    const next = boundedRatio(
      orientation === "vertical" ? event.clientX : event.clientY,
    );
    if (next !== null) {
      onRatioChange(next);
    }
  }

  function stopPointerResize(event: ReactPointerEvent<HTMLDivElement>) {
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  }

  function handleKey(event: ReactKeyboardEvent<HTMLDivElement>) {
    const decreaseKey = orientation === "vertical" ? "ArrowLeft" : "ArrowUp";
    const increaseKey = orientation === "vertical" ? "ArrowRight" : "ArrowDown";

    if (event.key === decreaseKey) {
      event.preventDefault();
      onRatioChange(clamp(ratio - step, minRatio, maxRatio));
    } else if (event.key === increaseKey) {
      event.preventDefault();
      onRatioChange(clamp(ratio + step, minRatio, maxRatio));
    } else if (event.key === "Home") {
      event.preventDefault();
      onRatioChange(minRatio);
    } else if (event.key === "End") {
      event.preventDefault();
      onRatioChange(maxRatio);
    }
  }

  const style = {
    "--split-ratio": `${ratio}%`,
    "--split-separator-size": `${separatorSize}px`,
  } as CSSProperties;

  return (
    <div
      ref={rootRef}
      className={["resizable-split", className].filter(Boolean).join(" ")}
      data-orientation={orientation}
      style={style}
    >
      <div className="resizable-split-first">{first}</div>
      <div
        className="resizable-split-handle"
        role="separator"
        aria-label={ariaLabel}
        aria-orientation={orientation}
        aria-valuemin={minRatio}
        aria-valuemax={maxRatio}
        aria-valuenow={Math.round(ratio)}
        tabIndex={0}
        onDoubleClick={onReset}
        onPointerDown={startPointerResize}
        onPointerMove={movePointerResize}
        onPointerUp={stopPointerResize}
        onPointerCancel={stopPointerResize}
        onKeyDown={handleKey}
      />
      <div className="resizable-split-second">{second}</div>
    </div>
  );
}

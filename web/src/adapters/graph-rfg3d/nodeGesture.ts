export interface NodePointerGesture {
  readonly knowledgeId: string;
  readonly startX: number;
  readonly startY: number;
  readonly didDrag: boolean;
}

export function beginNodePointerGesture(
  knowledgeId: string,
  x: number,
  y: number,
): NodePointerGesture {
  return { knowledgeId, startX: x, startY: y, didDrag: false };
}

export function advanceNodePointerGesture(
  gesture: NodePointerGesture,
  x: number,
  y: number,
  dragThresholdPx: number,
): NodePointerGesture {
  if (
    gesture.didDrag ||
    Math.hypot(x - gesture.startX, y - gesture.startY) >= dragThresholdPx
  ) {
    return { ...gesture, didDrag: true };
  }
  return gesture;
}

export function completeNodePointerGesture(
  gesture: NodePointerGesture,
  cancelled = false,
): string | null {
  return !cancelled && !gesture.didDrag ? gesture.knowledgeId : null;
}

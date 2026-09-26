import { describe, expect, test } from "vitest";

import {
  advanceNodePointerGesture,
  beginNodePointerGesture,
  completeNodePointerGesture,
} from "./nodeGesture";

describe("RFG3D node activation gesture", () => {
  test("click without drag emits exactly one canonical Knowledge id", () => {
    const gesture = beginNodePointerGesture("linux-cgroups", 100, 100);
    const moved = advanceNodePointerGesture(gesture, 102, 101, 5);

    expect(completeNodePointerGesture(moved)).toBe("linux-cgroups");
  });

  test("drag changes presentation without semantic activation", () => {
    const gesture = beginNodePointerGesture("linux-cgroups", 100, 100);
    const dragged = advanceNodePointerGesture(gesture, 108, 100, 5);

    expect(dragged.didDrag).toBe(true);
    expect(completeNodePointerGesture(dragged)).toBeNull();
  });

  test("cancelled pointer gesture never activates Knowledge", () => {
    const gesture = beginNodePointerGesture("linux-cgroups", 100, 100);

    expect(completeNodePointerGesture(gesture, true)).toBeNull();
  });
});

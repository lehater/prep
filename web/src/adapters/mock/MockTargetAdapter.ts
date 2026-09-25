import type { TargetQueryPort } from "../../features/learning/ports/TargetQueryPort";
import { mockTargets } from "./mockFixtures";

export class MockTargetAdapter implements TargetQueryPort {
  async get(targetId: string) {
    return mockTargets.find((target) => target.id === targetId) ?? null;
  }
}

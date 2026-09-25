import type { LearningTargetModel } from "../model/learningTarget";

export interface TargetQueryPort {
  get(targetId: string): Promise<LearningTargetModel | null>;
}

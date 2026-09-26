export type ReviewRating = "Again" | "Hard" | "Good" | "Easy";
export type ReviewPhase = "Learning" | "Review" | "Relearning" | "Early";

export interface ReviewObservationModel {
  readonly id: string;
  readonly questionId: string;
  readonly occurredAt: string;
  readonly rating: ReviewRating;
  readonly previousInterval: string;
  readonly nextInterval: string;
  readonly duration: string;
  readonly reviewPhase: ReviewPhase;
}

export interface ReviewAggregatesModel {
  readonly total: number;
  readonly again: number;
  readonly hard: number;
  readonly good: number;
  readonly easy: number;
}

export interface LearningStatisticsModel {
  readonly aggregates: ReviewAggregatesModel;
  readonly observations: readonly ReviewObservationModel[];
}

export interface ReviewSyncSummaryModel {
  readonly imported: number;
  readonly rejected: number;
}

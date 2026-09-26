export type LearningOutcome<T> =
  | { readonly status: "success"; readonly value: T }
  | { readonly status: "not_found"; readonly message: string }
  | { readonly status: "unavailable"; readonly message: string }
  | { readonly status: "failure"; readonly message: string };

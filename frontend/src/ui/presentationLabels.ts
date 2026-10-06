export function capabilityStateLabel(
  state: "demonstrated" | "challenged" | "unknown",
): string {
  switch (state) {
    case "demonstrated":
      return "подтверждено";
    case "challenged":
      return "оспорено";
    case "unknown":
      return "неизвестно";
  }
}

export function gapStatusLabel(
  status: "satisfied" | "challenged" | "unresolved",
): string {
  switch (status) {
    case "satisfied":
      return "закрыт";
    case "challenged":
      return "под вопросом";
    case "unresolved":
      return "не разрешён";
  }
}

export function supportAvailabilityLabel(
  availability: "available" | "limited" | "missing",
): string {
  switch (availability) {
    case "available":
      return "доступна";
    case "limited":
      return "ограничена";
    case "missing":
      return "отсутствует";
  }
}

export function knowledgeKindLabel(
  kind: "object" | "proposition",
): string {
  return kind;
}

export function knowledgeFormLabel(form: string): string {
  return form;
}

export function knowledgeRelationFamilyLabel(family: string): string {
  return family;
}

export function knowledgePredicateLabel(predicate: string): string {
  return predicate;
}


export function evidenceKindLabel(
  kind: "performance" | "observation",
): string {
  switch (kind) {
    case "performance":
      return "результат выполнения";
    case "observation":
      return "наблюдение";
  }
}

export function activityAttemptStateLabel(
  state: "active" | "submitted" | "evidence-processing" | "reviewable",
): string {
  switch (state) {
    case "active":
      return "активна";
    case "submitted":
      return "отправлена";
    case "evidence-processing":
      return "обработка свидетельств";
    case "reviewable":
      return "готова к проверке";
  }
}

export function preparationRemainderStatusLabel(
  status: "unresolved" | "rejected",
): string {
  switch (status) {
    case "unresolved":
      return "не разрешено";
    case "rejected":
      return "отклонено";
  }
}

export function preparationRequestStateLabel(
  state: "partial" | "complete" | "unresolved",
): string {
  switch (state) {
    case "partial":
      return "частично";
    case "complete":
      return "полностью";
    case "unresolved":
      return "не разрешено";
  }
}

export function changeOutcomeLabel(
  outcome:
    | "changed"
    | "reviewable"
    | "no-change"
    | "challenged"
    | "increased-uncertainty"
    | "unresolved",
): string {
  switch (outcome) {
    case "changed":
      return "изменилось";
    case "reviewable":
      return "готово к проверке";
    case "no-change":
      return "без изменений";
    case "challenged":
      return "оспорено";
    case "increased-uncertainty":
      return "неопределённость выросла";
    case "unresolved":
      return "не разрешено";
  }
}

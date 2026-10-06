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
  switch (kind) {
    case "object":
      return "объект";
    case "proposition":
      return "утверждение";
  }
}

export function knowledgeFormLabel(form: string): string {
  switch (form) {
    case "concept":
      return "концепт";
    case "mechanism":
      return "механизм";
    case "procedure":
      return "процедура";
    case "strategy":
      return "стратегия";
    case "model":
      return "модель";
    case "property":
      return "свойство";
    case "problem":
      return "проблема";
    default:
      return form;
  }
}

export function knowledgeRelationFamilyLabel(family: string): string {
  switch (family) {
    case "taxonomic":
      return "таксономия";
    case "partitive":
      return "часть / целое";
    case "realization":
      return "реализация";
    case "problem_response":
      return "проблема / решение";
    case "causal_temporal_developmental":
      return "причина / время / развитие";
    case "activity_participation_instrument":
      return "действие / участие / инструмент";
    case "production_origination_transformation":
      return "производство / преобразование";
    case "interaction_control":
      return "взаимодействие / контроль";
    case "transmission_information_flow":
      return "поток информации";
    case "representation_provenance":
      return "представление / происхождение";
    case "contrast_opposition":
      return "контраст / противопоставление";
    default:
      return family;
  }
}

export function knowledgePredicateLabel(predicate: string): string {
  switch (predicate) {
    case "addresses":
      return "решает";
    case "realizes":
      return "реализует";
    case "realized_by":
      return "реализуется через";
    case "specializes":
      return "специализирует";
    case "generalized_by":
      return "обобщается через";
    case "part_of":
      return "часть";
    case "has_part":
      return "содержит часть";
    case "produces":
      return "производит";
    case "produced_by":
      return "производится через";
    default:
      return predicate;
  }
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

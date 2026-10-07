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

const KNOWLEDGE_FORM_LABELS: Readonly<Record<string, string>> = {
  concept: "Понятие",
  mechanism: "Механизм",
  model: "Модель",
  procedure: "Процедура",
  property: "Свойство",
  strategy: "Стратегия",
};

const KNOWLEDGE_RELATION_FAMILY_LABELS: Readonly<Record<string, string>> = {
  taxonomic: "Классификация",
  partitive: "Часть — целое",
  interaction_control: "Взаимодействие и управление",
  causal_temporal_developmental: "Причинность и развитие",
  activity_participation_instrument: "Участие в деятельности",
  problem_response: "Проблема — решение",
  production_origination_transformation: "Создание и преобразование",
  representation_provenance: "Представление и происхождение",
  transmission_information_flow: "Передача информации",
  contrast_opposition: "Контраст и противопоставление",
  realization: "Реализация",
};

const KNOWLEDGE_PREDICATE_LABELS: Readonly<Record<string, string>> = {
  addresses: "решает проблему",
  addressed_by: "решается через",
  realizes: "реализует",
  realized_by: "реализуется через",
  specializes: "является специализацией",
  generalized_by: "обобщается как",
  part_of: "часть целого",
  has_part: "содержит часть",
  represents: "представляет",
  represented_by: "представлено через",
  requires: "требует",
  required_by: "требуется для",
  causes: "вызывает",
  caused_by: "вызвано",
  precedes: "предшествует",
  follows: "следует за",
  triggers: "запускает",
  triggered_by: "запускается",
  produces: "создаёт",
  produced_by: "создаётся",
  serves: "обслуживает",
  served_by: "обслуживается",
  flows_to: "передаёт поток",
  receives_flow_from: "получает поток",
  reads_from: "читает из",
  read_by: "читается",
  writes_to: "записывает в",
  written_by: "записывается",
  evaluates: "оценивает",
  evaluated_by: "оценивается",
  enforces: "обеспечивает соблюдение",
  enforced_by: "обеспечивается",
  supplies: "поставляет",
  supplied_by: "получает от",
  schedules: "планирует выполнение",
  scheduled_by: "планируется",
  executes: "выполняет",
  executed_by: "выполняется",
  organizes: "организует",
  organized_by: "организуется",
};

function humanizeKnowledgeCode(value: string): string {
  const words = value.replaceAll("_", " ").replaceAll("-", " ").trim();
  return words.length > 0 ? words : value;
}

export function knowledgeKindLabel(
  kind: "object" | "proposition",
): string {
  return kind === "object" ? "Объект" : "Утверждение";
}

export function knowledgeFormLabel(form: string): string {
  return KNOWLEDGE_FORM_LABELS[form] ?? humanizeKnowledgeCode(form);
}

export function knowledgeRelationFamilyLabel(family: string): string {
  return (
    KNOWLEDGE_RELATION_FAMILY_LABELS[family] ?? humanizeKnowledgeCode(family)
  );
}

export function knowledgePredicateLabel(predicate: string): string {
  return (
    KNOWLEDGE_PREDICATE_LABELS[predicate] ?? humanizeKnowledgeCode(predicate)
  );
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

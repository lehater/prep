import { describe, expect, it } from "vitest";

import {
  knowledgeFormLabel,
  knowledgeKindLabel,
  knowledgePredicateLabel,
  knowledgeRelationFamilyLabel,
} from "./presentationLabels";

describe("Knowledge presentation labels", () => {
  it("keeps machine-readable Knowledge codes out of the visible vocabulary", () => {
    expect(knowledgeKindLabel("object")).toBe("Объект");
    expect(knowledgeKindLabel("proposition")).toBe("Утверждение");

    expect(knowledgeFormLabel("concept")).toBe("Понятие");
    expect(knowledgeFormLabel("mechanism")).toBe("Механизм");
    expect(knowledgeFormLabel("model")).toBe("Модель");
    expect(knowledgeFormLabel("procedure")).toBe("Процедура");
    expect(knowledgeFormLabel("property")).toBe("Свойство");
    expect(knowledgeFormLabel("strategy")).toBe("Стратегия");

    expect(knowledgeRelationFamilyLabel("partitive")).toBe("Часть — целое");
    expect(knowledgeRelationFamilyLabel("problem_response")).toBe(
      "Проблема — решение",
    );
    expect(
      knowledgeRelationFamilyLabel("production_origination_transformation"),
    ).toBe("Создание и преобразование");
    expect(knowledgeRelationFamilyLabel("realization")).toBe("Реализация");
    expect(knowledgeRelationFamilyLabel("taxonomic")).toBe("Классификация");

    expect(knowledgePredicateLabel("addresses")).toBe("решает проблему");
    expect(knowledgePredicateLabel("part_of")).toBe("часть целого");
    expect(knowledgePredicateLabel("produces")).toBe("создаёт");
    expect(knowledgePredicateLabel("realizes")).toBe("реализует");
    expect(knowledgePredicateLabel("specializes")).toBe(
      "является специализацией",
    );
  });

  it("degrades unknown codes to readable text instead of raw snake case", () => {
    expect(knowledgeFormLabel("new_knowledge_form")).toBe(
      "new knowledge form",
    );
    expect(knowledgePredicateLabel("new_relation-kind")).toBe(
      "new relation kind",
    );
  });
});

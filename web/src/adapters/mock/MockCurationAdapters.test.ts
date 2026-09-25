import { describe, expect, test } from "vitest";

import { MockKnowledgeAdapter } from "./MockKnowledgeAdapter";
import { MockTargetAdapter } from "./MockTargetAdapter";
import {
  MockCurationKnowledgeAdapter,
  MockCurationQuestionAdapter,
  MockCurationTargetAdapter,
  MockImportAdapter,
  MockRequirementAdapter,
} from "./MockCurationAdapters";
import { createMockCurationStore } from "./MockCurationStore";

describe("Curation mock adapters", () => {
  test("curated target changes remain visible through the Learning query boundary", async () => {
    const store = createMockCurationStore();
    const curation = new MockCurationTargetAdapter(store);
    const learning = new MockTargetAdapter("success", store);

    const created = await curation.create({
      name: "Python backend interview",
      definition: "Prepared target for Python backend interview practice.",
    });
    expect(created.status).toBe("success");
    if (created.status !== "success") return;

    const result = await learning.get(created.value.id);
    expect(result).toEqual({
      status: "success",
      value: expect.objectContaining({
        id: created.value.id,
        name: "Python backend interview",
      }),
    });
  });

  test("RequirementSet membership rejects cycles without mutating the set", async () => {
    const store = createMockCurationStore();
    const requirements = new MockRequirementAdapter(store);

    const outcome = await requirements.addMember(
      "linux-resource-management",
      "linux-resource-management",
    );

    expect(outcome).toEqual({
      status: "validation_rejected",
      message: "RequirementSet membership would create a cycle.",
    });
    const current = await requirements.get("linux-resource-management");
    expect(current.status).toBe("success");
    if (current.status === "success" && current.value.kind === "requirement-set") {
      expect(current.value.memberIds).not.toContain("linux-resource-management");
    }
  });

  test("Knowledge relation mutations are visible through the shared global graph", async () => {
    const store = createMockCurationStore();
    const curation = new MockCurationKnowledgeAdapter(store);
    const query = new MockKnowledgeAdapter("success", store);

    const added = await curation.addRelation({
      sourceId: "linux-server-hardening",
      targetId: "resource-isolation",
      type: "addresses",
    });
    expect(added.status).toBe("success");

    const graph = await query.graph({ kind: "global" });
    expect(graph.status).toBe("success");
    if (graph.status === "success") {
      expect(graph.value.relations).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            sourceId: "linux-server-hardening",
            targetId: "resource-isolation",
            type: "addresses",
          }),
        ]),
      );
    }
  });

  test("prepared-data import applies valid items and reports rejected items independently", async () => {
    const store = createMockCurationStore();
    const targets = new MockCurationTargetAdapter(store);
    const knowledge = new MockCurationKnowledgeAdapter(store);
    const requirements = new MockRequirementAdapter(store);
    const questions = new MockCurationQuestionAdapter(store);
    const importer = new MockImportAdapter(
      store,
      targets,
      knowledge,
      requirements,
      questions,
    );

    const outcome = await importer.apply(
      JSON.stringify({
        schema_version: "1",
        data_kind: "questions",
        items: [
          {
            key: "python-gil",
            question_text: "What is the Python GIL?",
            answer_text: "A CPython interpreter lock governing bytecode execution.",
            knowledge: ["linux-cgroups"],
          },
          { key: "broken", question_text: "", answer_text: "" },
        ],
      }),
      "questions",
    );

    expect(outcome.status).toBe("success");
    if (outcome.status === "success") {
      expect(outcome.value).toMatchObject({
        total: 2,
        applied: 1,
        rejected: 1,
      });
      expect(outcome.value.items.map((item) => item.status)).toEqual([
        "created",
        "rejected",
      ]);
    }
  });
});

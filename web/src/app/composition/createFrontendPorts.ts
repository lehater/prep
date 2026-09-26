import type { RuntimeStatusPort } from "../shell/RuntimeStatusPort";
import type { GraphRenderer } from "../../features/knowledge-explorer/ports/GraphRenderer";
import type { KnowledgeQueryPort } from "../../features/knowledge-explorer/ports/KnowledgeQueryPort";
import type {
  CurationImportPort,
  KnowledgeCurationPort,
  QuestionCurationPort,
  RequirementCurationPort,
  TargetCurationPort,
} from "../../features/curation/ports/CurationPorts";
import type { LearningStatisticsPort } from "../../features/learning/ports/LearningStatisticsPort";
import type { QuestionQueryPort } from "../../features/learning/ports/QuestionQueryPort";
import type { StudyPort } from "../../features/learning/ports/StudyPort";
import type { TargetQueryPort } from "../../features/learning/ports/TargetQueryPort";
import { Rfg3dGraphRenderer } from "../../adapters/graph-rfg3d/Rfg3dGraphRenderer";
import {
  HttpCurationKnowledgeAdapter,
  HttpCurationQuestionAdapter,
  HttpCurationTargetAdapter,
  HttpImportAdapter,
  HttpRequirementAdapter,
} from "../../adapters/http/HttpCurationAdapters";
import {
  HttpKnowledgeAdapter,
  HttpLearningStatisticsAdapter,
  HttpQuestionAdapter,
  HttpStudyAdapter,
  HttpTargetAdapter,
} from "../../adapters/http/HttpLearningAdapters";
import { HttpOperationClient } from "../../adapters/http/HttpOperationClient";
import { HttpRuntimeStatusAdapter } from "../../adapters/http/HttpRuntimeStatusAdapter";
import {
  MockCurationKnowledgeAdapter,
  MockCurationQuestionAdapter,
  MockCurationTargetAdapter,
  MockImportAdapter,
  MockRequirementAdapter,
} from "../../adapters/mock/MockCurationAdapters";
import { createMockCurationStore } from "../../adapters/mock/MockCurationStore";
import { MockKnowledgeAdapter } from "../../adapters/mock/MockKnowledgeAdapter";
import { MockLearningStatisticsAdapter } from "../../adapters/mock/MockLearningStatisticsAdapter";
import { MockQuestionAdapter } from "../../adapters/mock/MockQuestionAdapter";
import { MockRuntimeStatusAdapter } from "../../adapters/mock/MockRuntimeStatusAdapter";
import { MockStudyAdapter } from "../../adapters/mock/MockStudyAdapter";
import { MockTargetAdapter } from "../../adapters/mock/MockTargetAdapter";
import type { DataProvider } from "../config/appConfig";

export interface FrontendPorts {
  readonly targetQueryPort: TargetQueryPort;
  readonly knowledgeQueryPort: KnowledgeQueryPort;
  readonly questionQueryPort: QuestionQueryPort;
  readonly studyPort: StudyPort;
  readonly statisticsPort: LearningStatisticsPort;
  readonly curationTargetPort: TargetCurationPort;
  readonly curationKnowledgePort: KnowledgeCurationPort;
  readonly curationRequirementPort: RequirementCurationPort;
  readonly curationQuestionPort: QuestionCurationPort;
  readonly curationImportPort: CurationImportPort;
  readonly runtimeStatusPort: RuntimeStatusPort;
  readonly Renderer: GraphRenderer;
}

export function createFrontendPorts(config: {
  readonly dataProvider: DataProvider;
  readonly apiBaseUrl: string;
}): FrontendPorts {
  if (config.dataProvider === "http") {
    const client = new HttpOperationClient(config.apiBaseUrl);
    return {
      targetQueryPort: new HttpTargetAdapter(client),
      knowledgeQueryPort: new HttpKnowledgeAdapter(client),
      questionQueryPort: new HttpQuestionAdapter(client),
      studyPort: new HttpStudyAdapter(client),
      statisticsPort: new HttpLearningStatisticsAdapter(client),
      curationTargetPort: new HttpCurationTargetAdapter(client),
      curationKnowledgePort: new HttpCurationKnowledgeAdapter(client),
      curationRequirementPort: new HttpRequirementAdapter(client),
      curationQuestionPort: new HttpCurationQuestionAdapter(client),
      curationImportPort: new HttpImportAdapter(client),
      runtimeStatusPort: new HttpRuntimeStatusAdapter(client),
      Renderer: Rfg3dGraphRenderer,
    };
  }

  const store = createMockCurationStore();
  const curationTargetPort = new MockCurationTargetAdapter(store);
  const curationKnowledgePort = new MockCurationKnowledgeAdapter(store);
  const curationRequirementPort = new MockRequirementAdapter(store);
  const curationQuestionPort = new MockCurationQuestionAdapter(store);

  return {
    targetQueryPort: new MockTargetAdapter("success", store),
    knowledgeQueryPort: new MockKnowledgeAdapter("success", store),
    questionQueryPort: new MockQuestionAdapter("success", store),
    studyPort: new MockStudyAdapter("success", "success", store),
    statisticsPort: new MockLearningStatisticsAdapter(),
    curationTargetPort,
    curationKnowledgePort,
    curationRequirementPort,
    curationQuestionPort,
    curationImportPort: new MockImportAdapter(
      store,
      curationTargetPort,
      curationKnowledgePort,
      curationRequirementPort,
      curationQuestionPort,
    ),
    runtimeStatusPort: new MockRuntimeStatusAdapter(),
    Renderer: Rfg3dGraphRenderer,
  };
}

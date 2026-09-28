import type { CurationOutcome } from "../../features/curation/model/curationModels";
import type {
  AssessmentCurationModel,
  CapabilityCurationModel,
  CorpusDiagnosticModel,
  LearningSupportCurationModel,
  TargetProfileModel,
} from "../../features/curation/model/userCenteredCurationModels";
import type {
  AssessmentCurationPortV2,
  CapabilityCurationPortV2,
  CorpusQualityPort,
  LearningSupportCurationPortV2,
  TargetProfileCurationPort,
} from "../../features/curation/ports/UserCenteredCurationPorts";

const unavailable = <T>(): CurationOutcome<T> => ({
  status: "unavailable",
  message: "This user-centered Curation backend contract is not implemented yet. Use the mock provider for the frontend-first prototype.",
});

export class PendingTargetProfileCurationAdapter implements TargetProfileCurationPort {
  async list() { return unavailable<{ items: readonly TargetProfileModel[]; totalCount: number }>(); }
  async get() { return unavailable<TargetProfileModel>(); }
  async create() { return unavailable<TargetProfileModel>(); }
  async update() { return unavailable<TargetProfileModel>(); }
  async setCapabilities() { return unavailable<TargetProfileModel>(); }
}

export class PendingCapabilityCurationAdapter implements CapabilityCurationPortV2 {
  async list() { return unavailable<{ items: readonly CapabilityCurationModel[]; totalCount: number }>(); }
  async get() { return unavailable<CapabilityCurationModel>(); }
  async create() { return unavailable<CapabilityCurationModel>(); }
  async update() { return unavailable<CapabilityCurationModel>(); }
}

export class PendingLearningSupportCurationAdapter implements LearningSupportCurationPortV2 {
  async list() { return unavailable<{ items: readonly LearningSupportCurationModel[]; totalCount: number }>(); }
  async get() { return unavailable<LearningSupportCurationModel>(); }
  async create() { return unavailable<LearningSupportCurationModel>(); }
  async update() { return unavailable<LearningSupportCurationModel>(); }
}

export class PendingAssessmentCurationAdapter implements AssessmentCurationPortV2 {
  async list() { return unavailable<{ items: readonly AssessmentCurationModel[]; totalCount: number }>(); }
  async get() { return unavailable<AssessmentCurationModel>(); }
  async create() { return unavailable<AssessmentCurationModel>(); }
  async update() { return unavailable<AssessmentCurationModel>(); }
}

export class PendingCorpusQualityAdapter implements CorpusQualityPort {
  async get() { return unavailable<readonly CorpusDiagnosticModel[]>(); }
}

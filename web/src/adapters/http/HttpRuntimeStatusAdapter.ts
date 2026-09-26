import type { RuntimeStatusPort } from "../../app/shell/RuntimeStatusPort";
import { HttpOperationClient } from "./HttpOperationClient";
import { mapRuntimeStatus } from "./mappers";
import { toRuntimeStatusOutcome } from "./outcomes";

export class HttpRuntimeStatusAdapter implements RuntimeStatusPort {
  constructor(private readonly client: HttpOperationClient) {}

  async get() {
    const envelope = await this.client.query(
      "integration.external_runtime.status.get",
    );
    return toRuntimeStatusOutcome(envelope, mapRuntimeStatus);
  }
}

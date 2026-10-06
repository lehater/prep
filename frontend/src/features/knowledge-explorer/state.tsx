import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

import type { CapabilityRef, KnowledgeRef } from "../contracts";

export interface KnowledgeExplorerStateValue {
  readonly queryDraft: string;
  readonly appliedQuery: string;
  readonly scope: "overview" | "detail";
  readonly requiredCapabilityRef: CapabilityRef | null;
  readonly selectedKnowledgeRef: KnowledgeRef | null;
  readonly setQueryDraft: (value: string) => void;
  readonly applyQuery: () => void;
  readonly setScope: (scope: "overview" | "detail") => void;
  readonly setRequiredCapabilityRef: (ref: CapabilityRef | null) => void;
  readonly setSelectedKnowledgeRef: (ref: KnowledgeRef | null) => void;
}

const KnowledgeExplorerStateContext =
  createContext<KnowledgeExplorerStateValue | null>(null);

export function KnowledgeExplorerStateProvider({
  children,
}: {
  readonly children: ReactNode;
}) {
  const [queryDraft, setQueryDraft] = useState("");
  const [appliedQuery, setAppliedQuery] = useState("");
  const [scope, setScope] = useState<"overview" | "detail">("overview");
  const [requiredCapabilityRef, setRequiredCapabilityRefState] =
    useState<CapabilityRef | null>(null);
  const [selectedKnowledgeRef, setSelectedKnowledgeRef] =
    useState<KnowledgeRef | null>(null);

  const applyQuery = useCallback(() => {
    setAppliedQuery(queryDraft);
  }, [queryDraft]);

  const setRequiredCapabilityRef = useCallback(
    (ref: CapabilityRef | null) => {
      setRequiredCapabilityRefState(ref);
      setSelectedKnowledgeRef(null);
    },
    [],
  );

  const value = useMemo<KnowledgeExplorerStateValue>(
    () => ({
      queryDraft,
      appliedQuery,
      scope,
      requiredCapabilityRef,
      selectedKnowledgeRef,
      setQueryDraft,
      applyQuery,
      setScope,
      setRequiredCapabilityRef,
      setSelectedKnowledgeRef,
    }),
    [
      appliedQuery,
      applyQuery,
      queryDraft,
      requiredCapabilityRef,
      scope,
      selectedKnowledgeRef,
      setRequiredCapabilityRef,
    ],
  );

  return (
    <KnowledgeExplorerStateContext.Provider value={value}>
      {children}
    </KnowledgeExplorerStateContext.Provider>
  );
}

export function useKnowledgeExplorerState(): KnowledgeExplorerStateValue {
  const value = useContext(KnowledgeExplorerStateContext);
  if (!value) {
    throw new Error(
      "KnowledgeExplorer state must be used inside KnowledgeExplorerStateProvider.",
    );
  }
  return value;
}

import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

import type { CapabilityRef, KnowledgeRef } from "../contracts";

export type KnowledgeKindFilter = "all" | "object" | "proposition";

export interface KnowledgeExplorerStateValue {
  readonly queryDraft: string;
  readonly appliedQuery: string;
  readonly scope: "overview" | "detail";
  readonly requiredCapabilityRef: CapabilityRef | null;
  readonly kindFilter: KnowledgeKindFilter;
  readonly knowledgeFormFilter: string;
  readonly relationFamilyFilter: string;
  readonly relationPredicateFilter: string;
  readonly selectedKnowledgeRef: KnowledgeRef | null;
  readonly setQueryDraft: (value: string) => void;
  readonly applyQuery: () => void;
  readonly setScope: (scope: "overview" | "detail") => void;
  readonly setRequiredCapabilityRef: (ref: CapabilityRef | null) => void;
  readonly setKindFilter: (value: KnowledgeKindFilter) => void;
  readonly setKnowledgeFormFilter: (value: string) => void;
  readonly setRelationFamilyFilter: (value: string) => void;
  readonly setRelationPredicateFilter: (value: string) => void;
  readonly setSelectedKnowledgeRef: (ref: KnowledgeRef | null) => void;
}

const KnowledgeExplorerStateContext =
  createContext<KnowledgeExplorerStateValue | null>(null);

export function KnowledgeExplorerStateProvider({
  children,
}: {
  readonly children: ReactNode;
}) {
  const [queryDraft, setQueryDraftState] = useState("");
  const [appliedQuery, setAppliedQuery] = useState("");
  const [scope, setScope] = useState<"overview" | "detail">("overview");
  const [requiredCapabilityRef, setRequiredCapabilityRefState] =
    useState<CapabilityRef | null>(null);
  const [kindFilter, setKindFilter] = useState<KnowledgeKindFilter>("all");
  const [knowledgeFormFilter, setKnowledgeFormFilter] = useState("all");
  const [relationFamilyFilter, setRelationFamilyFilter] = useState("all");
  const [relationPredicateFilter, setRelationPredicateFilter] = useState("all");
  const [selectedKnowledgeRef, setSelectedKnowledgeRef] =
    useState<KnowledgeRef | null>(null);

  const setQueryDraft = useCallback((value: string) => {
    setQueryDraftState(value);
    setAppliedQuery(value);
    setSelectedKnowledgeRef(null);
  }, []);

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
      kindFilter,
      knowledgeFormFilter,
      relationFamilyFilter,
      relationPredicateFilter,
      selectedKnowledgeRef,
      setQueryDraft,
      applyQuery,
      setScope,
      setRequiredCapabilityRef,
      setKindFilter,
      setKnowledgeFormFilter,
      setRelationFamilyFilter,
      setRelationPredicateFilter,
      setSelectedKnowledgeRef,
    }),
    [
      appliedQuery,
      applyQuery,
      kindFilter,
      knowledgeFormFilter,
      queryDraft,
      relationFamilyFilter,
      relationPredicateFilter,
      requiredCapabilityRef,
      scope,
      selectedKnowledgeRef,
      setQueryDraft,
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

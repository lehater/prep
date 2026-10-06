import {
  createContext,
  type ReactNode,
  useContext,
  useMemo,
  useState,
} from "react";

import type {
  FocusRef,
  SemanticBasisRef,
  TargetRef,
} from "../../features/contracts";

export interface AcceptedFocusContext {
  readonly focusRef: FocusRef;
  readonly purpose: string;
  readonly rationale: string;
  readonly semanticBasisRef: SemanticBasisRef;
}

export interface PreparationContextValue {
  readonly activeTargetRef: TargetRef | null;
  readonly activeFocus: AcceptedFocusContext | null;
  readonly activeFocusRef: FocusRef | null;
  readonly setAcceptedTarget: (targetRef: TargetRef | null) => void;
  readonly setAcceptedFocus: (focus: AcceptedFocusContext | null) => void;
}

const PreparationContext = createContext<PreparationContextValue | null>(null);

export function PreparationContextProvider({
  children,
}: {
  readonly children: ReactNode;
}) {
  const [activeTargetRef, setActiveTargetRef] = useState<TargetRef | null>(null);
  const [activeFocus, setActiveFocus] = useState<AcceptedFocusContext | null>(
    null,
  );

  const value = useMemo<PreparationContextValue>(
    () => ({
      activeTargetRef,
      activeFocus,
      activeFocusRef: activeFocus?.focusRef ?? null,
      setAcceptedTarget: (targetRef) => {
        setActiveTargetRef((current) => {
          if (current !== targetRef) {
            setActiveFocus(null);
          }
          return targetRef;
        });
      },
      setAcceptedFocus: setActiveFocus,
    }),
    [activeFocus, activeTargetRef],
  );

  return (
    <PreparationContext.Provider value={value}>
      {children}
    </PreparationContext.Provider>
  );
}

export function usePreparationContext(): PreparationContextValue {
  const value = useContext(PreparationContext);
  if (!value) {
    throw new Error("PreparationContext must be used inside its provider.");
  }
  return value;
}

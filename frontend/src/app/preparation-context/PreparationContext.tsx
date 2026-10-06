import {
  createContext,
  type ReactNode,
  useContext,
  useMemo,
  useState,
} from "react";

import type { FocusRef, TargetRef } from "../../features/contracts";

export interface PreparationContextValue {
  readonly activeTargetRef: TargetRef | null;
  readonly activeFocusRef: FocusRef | null;
  readonly setAcceptedTarget: (targetRef: TargetRef | null) => void;
  readonly setAcceptedFocus: (focusRef: FocusRef | null) => void;
}

const PreparationContext = createContext<PreparationContextValue | null>(null);

export function PreparationContextProvider({
  children,
}: {
  readonly children: ReactNode;
}) {
  const [activeTargetRef, setActiveTargetRef] = useState<TargetRef | null>(null);
  const [activeFocusRef, setActiveFocusRef] = useState<FocusRef | null>(null);

  const value = useMemo<PreparationContextValue>(
    () => ({
      activeTargetRef,
      activeFocusRef,
      setAcceptedTarget: (targetRef) => {
        setActiveTargetRef((current) => {
          if (current !== targetRef) {
            setActiveFocusRef(null);
          }
          return targetRef;
        });
      },
      setAcceptedFocus: setActiveFocusRef,
    }),
    [activeFocusRef, activeTargetRef],
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

"use client";

import { createContext, ReactNode, useContext, useMemo, useState } from "react";
import { RequestForm } from "@/components/shared/request-form";

type ModalState = {
  open: boolean;
  title?: string;
  source: string;
  productName?: string;
};

type RequestModalContextValue = {
  openModal: (state?: Partial<ModalState>) => void;
  closeModal: () => void;
};

const RequestModalContext = createContext<RequestModalContextValue | null>(null);

export function RequestModalProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<ModalState>({
    open: false,
    title: "Оставить заявку",
    source: "global-modal"
  });

  const value = useMemo(
    () => ({
      openModal: (next?: Partial<ModalState>) =>
        setState({
          open: true,
          title: next?.title ?? "Оставить заявку",
          source: next?.source ?? "global-modal",
          productName: next?.productName
        }),
      closeModal: () => setState((current) => ({ ...current, open: false }))
    }),
    []
  );

  return (
    <RequestModalContext.Provider value={value}>
      {children}
      {state.open ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="request-modal-title"
            className="max-h-[90vh] w-full max-w-3xl overflow-auto rounded-[32px] bg-white p-3"
          >
            <div className="mb-3 flex justify-end">
              <button
                type="button"
                className="rounded-full border border-line px-3 py-2 text-sm text-ink"
                onClick={value.closeModal}
                aria-label="Закрыть форму"
              >
                Закрыть
              </button>
            </div>
            <RequestForm
              source={state.source}
              title={state.title}
              productName={state.productName}
              compact
              titleId="request-modal-title"
              onSuccess={value.closeModal}
            />
          </div>
        </div>
      ) : null}
    </RequestModalContext.Provider>
  );
}

export function useRequestModal() {
  const context = useContext(RequestModalContext);
  if (!context) {
    throw new Error("useRequestModal must be used within RequestModalProvider");
  }
  return context;
}

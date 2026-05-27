"use client";

import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from "react";
import { RequestForm } from "@/components/shared/request-form";
import { getDefaultRequestFormText } from "@/lib/request-ui";

type ModalState = {
  open: boolean;
  source: string;
  productName?: string;
  title?: string;
  description?: string;
  hints?: string[];
  detailsPrefill?: string;
  submitLabel?: string;
  footerNote?: string;
};

type RequestModalContextValue = {
  openModal: (state?: Partial<ModalState>) => void;
  closeModal: () => void;
};

const RequestModalContext = createContext<RequestModalContextValue | null>(null);
const defaultCopy = getDefaultRequestFormText();

export function RequestModalProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<ModalState>({
    open: false,
    title: defaultCopy.title,
    description: defaultCopy.description,
    hints: defaultCopy.hints,
    submitLabel: defaultCopy.submitLabel,
    footerNote: defaultCopy.footerNote,
    source: "global-modal"
  });

  const closeModal = useMemo(
    () => () => setState((current) => ({ ...current, open: false })),
    []
  );

  const value = useMemo(
    () => ({
      openModal: (next?: Partial<ModalState>) =>
        setState({
          open: true,
          title: next?.title ?? defaultCopy.title,
          description: next?.description ?? defaultCopy.description,
          hints: next?.hints ?? defaultCopy.hints,
          detailsPrefill: next?.detailsPrefill,
          submitLabel: next?.submitLabel ?? defaultCopy.submitLabel,
          footerNote: next?.footerNote ?? defaultCopy.footerNote,
          source: next?.source ?? "global-modal",
          productName: next?.productName
        }),
      closeModal
    }),
    [closeModal]
  );

  useEffect(() => {
    if (!state.open) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeModal();
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [closeModal, state.open]);

  return (
    <RequestModalContext.Provider value={value}>
      {children}
      {state.open ? (
        <div
          className="fixed inset-0 z-50 overflow-y-auto bg-black/55 p-2 sm:p-3"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closeModal();
            }
          }}
        >
          <div className="flex min-h-full items-start justify-center sm:items-center" onMouseDown={(event) => { if (event.target === event.currentTarget) { closeModal(); } }}>
            <div
              role="dialog"
              aria-modal="true"
              aria-labelledby="request-modal-title"
              className="my-2 flex max-h-[calc(100vh-1rem)] w-full max-w-3xl flex-col overflow-hidden rounded-[28px] border border-line bg-white shadow-[0_24px_80px_rgba(15,23,42,0.24)] sm:my-3 sm:max-h-[calc(100vh-1.5rem)] sm:rounded-[32px]"
              onMouseDown={(event) => event.stopPropagation()}
            >
              <div className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-line bg-white/95 px-4 py-2.5 backdrop-blur sm:px-6 sm:py-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.12em] text-accent">Форма запроса</p>
                  <p className="sr-only mt-1 text-sm leading-6 text-body sm:not-sr-only">Можно закрыть окно по кнопке, по клику вне модалки или клавишей Esc.</p>
                </div>
                <button
                  type="button"
                  className="shrink-0 rounded-full border border-line bg-white px-4 py-2 text-sm font-medium text-ink transition hover:bg-surface"
                  onClick={closeModal}
                  aria-label="Закрыть форму"
                >
                  Закрыть
                </button>
              </div>

              <div className="overflow-y-auto px-4 py-3 sm:px-6 sm:py-5">
                <RequestForm
                  source={state.source}
                  title={state.title}
                  description={state.description}
                  hints={state.hints}
                  detailsPrefill={state.detailsPrefill}
                  submitLabel={state.submitLabel}
                  footerNote={state.footerNote}
                  productName={state.productName}
                  compact
                  chrome="embedded"
                  titleId="request-modal-title"
                  onSuccess={closeModal}
                />
              </div>
            </div>
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


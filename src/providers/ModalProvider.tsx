"use client";

import { TChildrenProps } from "@/types/children.types";
import React, { createContext, ReactElement, useContext, useEffect, useRef, useState } from "react";

type TModalContext = {
  openModal: (component: ReactElement) => void;
  closeModal: () => void;
};

const ModalContext = createContext<TModalContext | null>(null);

export const useModal = () => {
  const context = useContext(ModalContext);

  if (!context) {
    throw new Error("useModal must be used within ModalProvider.");
  }

  return context;
};

export default function ModalProvider({ children }: TChildrenProps) {
  const [modal, setModal] = useState<ReactElement | null>(null);
  const modalRef = useRef<HTMLDivElement | null>(null);

  const openModal = (component: ReactElement) => {
    setModal(component);
    document.body.style.overflow = "hidden";
  };

  const closeModal = () => {
    setModal(null);
    document.body.style.overflow = "auto";
  };

  useEffect(() => {
    if (!modal) return;

    const escCloseModal = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeModal();
      }
    };

    document.addEventListener("keydown", escCloseModal);

    return () => {
      document.removeEventListener("keydown", escCloseModal);
    };
  }, [modal]);

  return (
    <ModalContext.Provider value={{ openModal, closeModal }}>
      {children}
      {modal && (
        <div
          ref={modalRef}
          onClick={(e) => {
            if (modalRef.current && e.target === modalRef.current) {
              closeModal();
            }
          }}
          className="fixed inset-0 bg-white/60 backdrop-blur-[5px] z-100"
        >
          {modal}
        </div>
      )}
    </ModalContext.Provider>
  );
}

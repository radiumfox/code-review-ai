'use client';

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import { ModalBase } from '@/components/ModalBase';
import type { ModalConfig } from './types';

interface ModalContextType {
  showModal: (config: ModalConfig) => void;
  closeModal: () => void;
}

const ModalContext = createContext<ModalContextType | null>(null);

export function ModalProvider({ children }: { children: ReactNode }) {
  const [modal, setModal] = useState<ModalConfig | null>(null);

  const showModal = useCallback((config: ModalConfig) => {
    setModal(config);
  }, []);

  const closeModal = useCallback(() => {
    setModal(null);
  }, []);

  const value = useMemo(
    () => ({ showModal, closeModal }),
    [showModal, closeModal]
  );

  return (
    <ModalContext value={value}>
      {children}
      <ModalBase show={modal !== null} text={modal?.text ?? ''} onClose={closeModal}>
        {modal?.actions}
      </ModalBase>
    </ModalContext>
  );
}

export function useModal() {
  const context = useContext(ModalContext);

  if (!context) {
    throw new Error('useModal must be used within a ModalProvider');
  }

  return context;
}

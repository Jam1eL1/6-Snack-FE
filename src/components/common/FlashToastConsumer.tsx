"use client";

import { useEffect, useRef, useState } from "react";
import Toast from "@/components/common/Toast";
import { useFlashToast } from "@/stores/flashToast";
import type { TToastVariant } from "@/types/toast.types";

export default function FlashToastConsumer() {
  const message = useFlashToast((state) => state.message);
  const consume = useFlashToast((state) => state.consume);
  const [payload, setPayload] = useState<{ text: string; variant: TToastVariant } | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!message) return;

    const { message: consumedMessage, variant } = consume();
    if (!consumedMessage) return;

    setPayload({ text: consumedMessage, variant: variant ?? "success" });

    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    timerRef.current = setTimeout(() => {
      setPayload(null);
      timerRef.current = null;
    }, 3000);
  }, [message, consume]);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  if (!payload) return null;

  return <Toast text={payload.text} variant={payload.variant} isVisible />;
}

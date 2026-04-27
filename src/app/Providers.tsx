import ModalProvider from "@/providers/ModalProvider";
import AuthProvider from "@/providers/AuthProvider";
import { TChildrenProps } from "@/types/children.types";
import React from "react";
import QueryProvider from "@/providers/QueryProvider";
import FlashToastConsumer from "@/components/common/FlashToastConsumer";

export default function Providers({ children }: TChildrenProps) {
  return (
    <AuthProvider>
      <QueryProvider>
        <ModalProvider>{children}</ModalProvider>
        <FlashToastConsumer />
      </QueryProvider>
    </AuthProvider>
  );
}

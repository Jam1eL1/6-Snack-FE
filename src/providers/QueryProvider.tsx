"use client";

import { TChildrenProps } from "@/types/children.types";
import { SessionExpiredError } from "@/lib/api/auth.errors";
import { useAuth } from "@/providers/AuthProvider";
import { MutationCache, QueryCache, QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import React, { useEffect, useRef, useState } from "react";

export default function QueryProvider({ children }: TChildrenProps) {
  const { handleSessionExpired } = useAuth();
  const handleSessionExpiredRef = useRef(handleSessionExpired);

  useEffect(() => {
    handleSessionExpiredRef.current = handleSessionExpired;
  }, [handleSessionExpired]);

  const [queryClient] = useState(
    () =>
      new QueryClient({
        queryCache: new QueryCache({
          onError: (error) => {
            if (error instanceof SessionExpiredError) {
              handleSessionExpiredRef.current();
            }
          },
        }),
        mutationCache: new MutationCache({
          onError: (error) => {
            if (error instanceof SessionExpiredError) {
              handleSessionExpiredRef.current();
            }
          },
        }),
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      <div className="z-50 fixed bottom-17 right-3.5">
        <ReactQueryDevtools initialIsOpen={false} buttonPosition="relative" />
      </div>
      {children}
    </QueryClientProvider>
  );
}

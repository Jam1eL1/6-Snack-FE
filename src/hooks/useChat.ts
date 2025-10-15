"use client";

import { useState, useCallback, useEffect } from "react";
import { ChatMessage, ChatRequest, ChatResponse } from "@/types/chat.types";

function createMessage(partial: Omit<ChatMessage, "id" | "createdAt">): ChatMessage {
  return {
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    ...partial,
  };
}

export function useChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [lastUserMessage, setLastUserMessage] = useState<string | null>(null);

  // Initial welcome message
  useEffect(() => {
    setMessages([
      createMessage({
        role: "assistant",
        content:
          'Hello! I\'m the Snack AI assistant. How can I help you? Examples: "How is this month\'s budget looking?", "What are the purchase request approval permissions?"',
      }),
    ]);
  }, []);

  const sendMessage = useCallback(
    async (userMessage: string) => {
      if (!userMessage.trim() || isLoading) return;

      const userMsg = createMessage({ role: "user", content: userMessage.trim() });
      const optimistic = [...messages, userMsg];
      setMessages(optimistic);
      setLastUserMessage(userMessage.trim());
      setIsLoading(true);

      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messages: optimistic } as ChatRequest),
        });

        if (!res.ok) throw new Error(`API request failed with status ${res.status}`);

        const data: ChatResponse = await res.json();
        const aiMessage = createMessage({ role: "assistant", content: data.message });
        setMessages((prev) => [...prev, aiMessage]);
      } catch (error) {
        console.error("[useChat] Chat API error:", error);
        const errorMessage = createMessage({
          role: "assistant",
          content: "Sorry, an error occurred. You can try again by clicking the icon.",
          error: true,
        });
        setMessages((prev) => [...prev, errorMessage]);
      } finally {
        setIsLoading(false);
      }
    },
    [messages, isLoading],
  );

  const resendLast = useCallback(() => {
    if (lastUserMessage && !isLoading) {
      // 마지막 실패 메시지 제거 (error true)
      setMessages((prev) => prev.filter((m) => !m.error));
      sendMessage(lastUserMessage);
    }
  }, [lastUserMessage, isLoading, sendMessage]);

  return { messages, isLoading, sendMessage, resendLast };
}

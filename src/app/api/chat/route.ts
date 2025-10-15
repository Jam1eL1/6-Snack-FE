import { NextResponse } from "next/server";
import OpenAI from "openai";
import { ChatRequest, ChatResponse, ChatMessage } from "@/types/chat.types";

// OpenAI 클라이언트 초기화
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request): Promise<NextResponse<ChatResponse | { error: string }>> {
  try {
    const { messages }: ChatRequest = await req.json();

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: "Invalid or empty messages array" }, { status: 400 });
    }

    // Prompt engineering: Add system message
    const systemMessage: ChatMessage = {
      role: "system",
      content: `
        You are the AI assistant for the 'Snack' service. The main goal is to manage snack purchase history and support administrative tasks. Provide features based on user permissions:
        - Regular User: Product search/registration, shopping cart, purchase request/history management, information modification.
        - Admin: Product modification/deletion, budget/expense inquiry, purchase request approval/rejection.
        - Super Admin: Member management, budget setting, company information modification.
        Use only the provided information for responses and write in friendly English. Clearly explain features by permission level and respond politely when information is not available.
        `,
    };
    const messagesWithSystem = [systemMessage, ...messages];

    // OpenAI Chat Completion 호출
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: messagesWithSystem as OpenAI.Chat.ChatCompletionMessageParam[],
    });

    const aiResponse = completion.choices?.[0]?.message?.content;

    if (!aiResponse) {
      return NextResponse.json({ error: "No response from AI" }, { status: 500 });
    }

    return NextResponse.json({ message: aiResponse });
  } catch (error) {
    console.error("[API /api/chat] OpenAI Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

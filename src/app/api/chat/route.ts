import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    let prompt = "";

    // 🧠 CASE 1: Assignment AI
    if (body.question) {
      const { question, options, userAnswer, correctAnswer } = body;

      prompt = `
You are a helpful teacher.

Question: ${question}

Options:
A: ${options?.A}
B: ${options?.B}
C: ${options?.C}
D: ${options?.D}

Student Answer: ${userAnswer}
Correct Answer: ${correctAnswer}

Explain:
- Why correct answer is correct
- Why student answer is wrong (if wrong)
- Keep it simple and clear
`;
    }

    // 💬 CASE 2: Sidebar Chat
    else if (body.message) {
      prompt = body.message;
    }

    // ❌ Safety fallback
    else {
      return NextResponse.json({
        reply: "Invalid request",
      });
    }

    // 🔥 OpenRouter API call
    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            {
              role: "system",
              content: "You are a helpful AI assistant for students.",
            },
            {
              role: "user",
              content: prompt,
            },
          ],
        }),
      }
    );

    const data = await response.json();

    console.log("AI RESPONSE:", data);

    if (!response.ok) {
      return NextResponse.json({
        reply: data.error?.message || "AI error",
        explanation: data.error?.message || "AI error",
      });
    }

    const output =
      data?.choices?.[0]?.message?.content || "No response";

    // ✅ Return BOTH formats
    return NextResponse.json({
      reply: output,        // sidebar chat
      explanation: output,  // assignment AI
    });

  } catch (error) {
    console.error("SERVER ERROR:", error);

    return NextResponse.json({
      reply: "Server error",
      explanation: "Server error",
    });
  }
}
import { NextRequest, NextResponse } from "next/server";
import { OpenAI } from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const { workouts, userName, weekLabel } = await req.json();

    // ✅ Validate inputs
    if (!workouts || !Array.isArray(workouts) || workouts.length === 0) {
      return NextResponse.json({
        summary: "No workouts to summarize this week.",
      });
    }

    const exerciseList = workouts
      .flatMap((w: any) =>
        w.workout_exercises.map((e: any) => e.exercise.name)
      )
      .filter(Boolean);

    const distinctExercises = Array.from(new Set(exerciseList)).join(", ") || "None";

    const prompt = `
You are a knowledgeable and practical fitness assistant. Your goal is to help ${userName || "the user"} plan their next workout based on their recent training.

Analyze the following workout data for the week of ${weekLabel} and follow these steps:

1. Determine which major muscle groups have already been trained. Common groups include: chest, back, legs, shoulders, arms, core.
2. Identify the most frequently trained groups and those that may be undertrained.
3. Recommend the next muscle group(s) to target in their upcoming workout. Base this on:
   - Ensuring balanced development
   - Allowing for recovery of recently trained groups
   - Following general sports science principles for strength and hypertrophy training

Here is the workout data in JSON format:
${JSON.stringify(workouts, null, 2)}

Your response should:
- Be concise (2–4 sentences)
- Clearly state which muscle groups were trained this week
- Recommend 1–2 muscle groups to target next, with a brief reason why
- Use clear, simple, and helpful language
- Avoid technical jargon
- Do NOT include markdown or headings — just plain text

Example tone:
"You hit upper body hard this week with plenty of back and chest work. Your legs and core haven't seen much action — consider focusing on those next to keep things balanced and give your upper body time to recover."

Now write your recommendation.
`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
    });

    const summary = completion.choices[0]?.message?.content?.trim();

    if (!summary) {
      return NextResponse.json(
        { summary: null, error: "Empty response from OpenAI." },
        { status: 502 }
      );
    }

    return NextResponse.json({ summary });
  } catch (err) {
    console.error("AI summary generation error:", err);
    return NextResponse.json(
      { summary: null, error: "Failed to generate summary." },
      { status: 500 }
    );
  }
}

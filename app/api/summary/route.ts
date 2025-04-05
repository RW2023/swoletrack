// app/api/summary/route.ts
import { NextRequest, NextResponse } from "next/server";
import { OpenAI } from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  const { workouts, userName, weekLabel } = await req.json();

  const exerciseList = workouts
    .flatMap((w: any) =>
      w.workout_exercises.map((e: any) => e.exercise.name)
    )
    .filter(Boolean);

  const prompt = `
Generate a friendly weekly workout summary for ${userName || "the user"}.
This was their activity for the week of ${weekLabel}:
- Workouts: ${workouts.length}
- Exercises performed: ${Array.from(new Set(exerciseList)).join(", ") || "None"}
- Data is detailed below in JSON format.

Return a short motivational paragraph (2–3 sentences max).

Workout Data:
${JSON.stringify(workouts, null, 2)}
`;

  const completion = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [{ role: "user", content: prompt }],
  });

  const summary = completion.choices[0].message.content;
  return NextResponse.json({ summary });
}

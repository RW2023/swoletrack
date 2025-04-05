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
Generate a short, friendly weekly workout summary for ${userName || "the user"}.

This is their activity for the week of ${weekLabel}:
- Total workouts: ${workouts.length}
- Exercises performed: ${distinctExercises}

Workout Data (for context):
${JSON.stringify(workouts, null, 2)}

Respond with a short, motivational paragraph (2–3 sentences). Do not include a title or markdown.
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

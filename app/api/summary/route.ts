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
You are a smart and motivating fitness coach. Your goal is to provide a short weekly summary to help ${userName || "the user"} understand their progress and stay motivated.

Use the following workout data to analyze their activity for the week of ${weekLabel}:

- Number of workouts: ${workouts.length}
- Exercises performed: ${distinctExercises}

Here is detailed workout data in JSON format:
${JSON.stringify(workouts, null, 2)}

Your response should:
- Be concise (2–3 sentences)
- Highlight consistency, variety, or intensity if present
- Encourage improvement or celebrate effort
- Avoid technical jargon
- Use friendly, casual, encouraging language
- Do NOT include markdown or headings — just plain text

Example tone:
“Solid week of training! You showed consistency with compound lifts and made time for cardio. Keep it up and push for one more day next week!”

Now write the summary.
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
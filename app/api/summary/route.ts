import { NextRequest, NextResponse } from "next/server";
import { OpenAI } from "openai";
import { createClient } from "@/utils/supabase/server";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

function getPreviousWeekLabel(weekLabel: string): string {
  try {
    const dateStr = weekLabel.replace("Week of ", "");
    const parsed = new Date(`${dateStr}, ${new Date().getFullYear()}`);
    if (isNaN(parsed.getTime())) return "";
    const previousWeek = new Date(parsed);
    previousWeek.setDate(previousWeek.getDate() - 7);
    const formatted = previousWeek.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
    return `Week of ${formatted}`;
  } catch {
    return "";
  }
}

export async function POST(req: NextRequest) {
  try {
    const { workouts, userName, weekLabel, previousWeekLabel: clientPrevLabel } =
      await req.json();
    const force = req.nextUrl.searchParams.get("force") === "true";

    const supabase = await createClient();
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Validate workouts
    if (!workouts || !Array.isArray(workouts) || workouts.length === 0) {
      return NextResponse.json({
        summary: "No workouts to summarize this week.",
      });
    }

    // Determine previous week label (client or fallback)
    const previousWeekLabel =
      clientPrevLabel || getPreviousWeekLabel(weekLabel);

    // Fetch previous week's summary (if any)
    const { data: priorSummaryData } = await supabase
      .from("summaries")
      .select("summary")
      .eq("user_id", user.id)
      .eq("week_label", previousWeekLabel)
      .maybeSingle();

    const priorSummary = priorSummaryData?.summary || "";

    // Check for cached summary unless force is true
    if (!force) {
      const { data: existing } = await supabase
        .from("summaries")
        .select("summary, generated_at")
        .eq("user_id", user.id)
        .eq("week_label", weekLabel)
        .maybeSingle();

      if (existing?.summary) {
        const generatedAt = new Date(existing.generated_at);
        const now = new Date();
        const sameDay =
          generatedAt.getUTCFullYear() === now.getUTCFullYear() &&
          generatedAt.getUTCMonth() === now.getUTCMonth() &&
          generatedAt.getUTCDate() === now.getUTCDate();

        if (sameDay) {
          return NextResponse.json({ summary: existing.summary });
        }
      }
    }

    const exerciseList = workouts
      .flatMap((w: any) =>
        w.workout_exercises.map((e: any) => e.exercise.name)
      )
      .filter(Boolean);

    const distinctExercises =
      Array.from(new Set(exerciseList)).join(", ") || "None";

    const prompt = `
You are a knowledgeable and practical fitness assistant. Your goal is to help ${userName || "the user"} plan their next workout based on their recent training.

First, here's what the user did last week:
${priorSummary || "No summary available for last week."}

Now analyze the following workout data for the week of ${weekLabel}. Follow these steps:

1. Determine which major muscle groups were trained.
2. Compare this week's training to last week.
3. Recommend the next muscle group(s) to target.
4. Encourage progress or balance based on trends across both weeks.

Workout data in JSON:
${JSON.stringify(workouts, null, 2)}

Your response should:
- Be concise (2–4 sentences)
- Summarize what muscle groups were trained this week
- Acknowledge progress (or not) from last week
- Suggest what to train next and why
- Use plain, helpful language. No markdown or headings.

Example tone:
"Nice work adding legs and shoulders this week after skipping them last time. Now that your lower body is covered, consider focusing on your back and core next to round things out."

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

    await supabase
      .from("summaries")
      .upsert(
        {
          user_id: user.id,
          week_label: weekLabel,
          summary,
          generated_at: new Date().toISOString(),
        },
        { onConflict: "user_id,week_label" }
      );

    return NextResponse.json({ summary });
  } catch (err) {
    console.error("AI summary generation error:", err);
    return NextResponse.json(
      { summary: null, error: "Failed to generate summary." },
      { status: 500 }
    );
  }
}

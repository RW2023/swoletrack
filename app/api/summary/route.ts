import { NextRequest, NextResponse } from "next/server";
import { OpenAI } from "openai";
import { createClient } from "@/utils/supabase/server";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export async function POST(req: NextRequest) {
  try {
    const { workouts, userName, weekLabel } = await req.json();

    if (!workouts || !Array.isArray(workouts) || workouts.length === 0 || !weekLabel) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    const supabase = await createClient();
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const previousWeekStart = new Date(workouts[0].date);
    previousWeekStart.setDate(previousWeekStart.getDate() - 7);
    const previousWeekLabel = `Week of ${previousWeekStart.toLocaleDateString("en-US", { month: "short", day: "numeric" })}`;

    // Fetch prior summary from `summaries`
    const { data: priorSummaryData } = await supabase
      .from("summaries")
      .select("summary")
      .eq("user_id", user.id)
      .eq("week_label", previousWeekLabel)
      .maybeSingle();

    const priorSummary = priorSummaryData?.summary || "";

    const prompt = `
You are a helpful fitness assistant. Compare the user's recent workouts and give a short summary.

Last week's summary:
${priorSummary || "No summary"}

This week's workouts (${weekLabel}):
${JSON.stringify(workouts, null, 2)}

Write a 2-4 sentence summary of their training. Include encouragement, call out what was worked, and suggest a focus for next week. Use casual but supportive tone. Don't use markdown.
`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
    });

    const summary = completion.choices[0].message?.content?.trim();
    if (!summary) {
      return NextResponse.json({ error: "Empty response from OpenAI" }, { status: 502 });
    }

    // Save to `summaries` (textual cache for AI logic)
    await supabase.from("summaries").upsert({
      user_id: user.id,
      week_label: weekLabel,
      summary,
      generated_at: new Date().toISOString(),
    }, { onConflict: "user_id,week_label" });

    // Save to `weekly_summaries` (for future analytics)
    const weekStart = new Date(workouts[0].date);
    weekStart.setDate(weekStart.getDate() - weekStart.getDay()); // Sunday start

    await supabase.from("weekly_summaries").upsert({
      user_id: user.id,
      week_start: weekStart.toISOString(),
      summary,
      created_at: new Date().toISOString(),
    }, { onConflict: "user_id,week_start" });

    return NextResponse.json({ summary });
  } catch (err: any) {
    console.error("Summary API error:", err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

# 💪 SwoleTrac

**SwoleTrac** is a simple, personal workout tracker built with [Next.js](https://nextjs.org/) and [Supabase](https://supabase.com/). Designed to help you stay consistent, track progress, and build lasting workout habits — without the fluff.

Originally created as a personal project, now shared for anyone who wants to take control of their fitness journey.

## 🧠 Features

- 🏋️‍♂️ **Track workouts** by category: weight training, cardio (duration-based), and calisthenics
- 📋 **Log exercises** with detailed sets: reps, weight, and duration (for cardio)
- 📝 **Add workout notes** to track how you felt or what you focused on
- 📈 **View personal records** (PRs) by exercise
- 🔥 **See current and longest workout streaks**
- 📊 **Weekly breakdown** of total sets, volume, and exercises
- 🤖 **AI-generated weekly training guidance** using OpenAI — personalized suggestions for what to train next, based on your activity
  - Summaries are **generated once per day** and **stored in Supabase** for cost efficiency
  - A **"Regenerate" button** allows users to manually refresh their weekly summary on demand
- ⚡ **Quick add** workouts or exercises on the fly using a floating action button (FAB)
- 🌙 **Light & dark mode** support using Tailwind’s `dark:` classes and custom HSL-based theming
- 💅 Beautiful and responsive UI styled with Tailwind CSS and [DaisyUI](https://daisyui.com/)

## 🛠️ Tech Stack

- **Frontend:** Next.js 14 / App Router
- **Backend:** Supabase (PostgreSQL, Auth, RLS policies)
- **Styling:** Tailwind CSS + DaisyUI
- **Fonts:** [Poppins](https://fonts.google.com/specimen/Poppins) (titles), [Karla](https://fonts.google.com/specimen/Karla) (body text)
- **Charting:** (Planned) [Chart.js](https://www.chartjs.org/) via `react-chartjs-2` for future data visualizations
- **AI:** OpenAI GPT-4 for workout insights & recommendations

## 📁 Folder Structure (Key Parts)

```txt
app/
├── dashboard/               # User dashboards
├── workouts/                # New workout form, logs
├── exercises/
│   └── quick-add/           # Fast entry form for adding exercises
└── components/
    ├── QuickAddFAB.tsx      # Floating action button
    ├── WeeklySummary.tsx    # AI summary display and regenerate logic
    └── delete-workout-button.tsx  # Delete button component

utils/
└── supabase/                # Supabase server/client helpers
```

## 🔐 Example RLS Policy (for exercises table)

```sql
-- Allow inserting only for the logged-in user
CREATE POLICY "Users can insert their own exercises"
  ON exercises
  FOR INSERT
  WITH CHECK (user_id = auth.uid());
```

---

### 🚀 Getting Started

# Clone the repo
```bash
git clone https://github.com/RW2023/swoletrack
```

# Install dependencies
```bash
cd swoletrac
```
```bash
npm install
```

# Set up your Supabase project

# Add your Supabase URL and anon/public keys to .env.local
## 🔐 Environment Variables Example (`.env.local`)

```env
# Supabase Credentials
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Supabase Service Role (for server-side access, if needed)
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Optional: Customize Next.js base URL (helpful for SSR/redirects)
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

### 🧠 Notes:

- `NEXT_PUBLIC_` prefix exposes variables to the browser (client-side). Use carefully.
- **Never** expose `SUPABASE_SERVICE_ROLE_KEY` to the client/browser.
- Store this file as `.env.local` in your project root. It’s automatically loaded by Next.js.
- Add `.env.local` to `.gitignore` to keep it out of version control.

## 🔮 Planned Features

- 📈 Workout volume and streak charts
- ✅ Goal tracking
- ⌚ Integrating wearable data (Fitbit)

## 💬 Why SwoleTrac?

Most workout apps are bloated, ad-heavy, or too rigid. SwoleTrac is minimal, fast, and focused on **you** — with just the right balance of structure and flexibility to help you stay on track.

## 📄 License

MIT — use freely, remix boldly, and stay swole.

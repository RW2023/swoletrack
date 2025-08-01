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

## 🗃️ Database Tables

The app uses the following tables in Supabase:

- `profiles`
- `exercises`
- `workouts`
- `workout_exercises`
- `sets`
- `summaries`

### 🧱 Table Creation SQL

#### `profiles`
```sql
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text
);
```

#### `exercises`
```sql
create table exercises (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  name text not null,
  category text not null,
  created_at timestamp default now()
);
```

#### `workouts`
```sql
create table workouts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  date date not null,
  notes text,
  created_at timestamp default now()
);
```

#### `workout_exercises`
```sql
create table workout_exercises (
  id uuid primary key default gen_random_uuid(),
  workout_id uuid references workouts(id) on delete cascade,
  exercise_id uuid references exercises(id) on delete cascade,
  created_at timestamp default now()
);
```

#### `sets`
```sql
create table sets (
  id uuid primary key default gen_random_uuid(),
  workout_exercise_id uuid references workout_exercises(id) on delete cascade,
  set_number int,
  reps int,
  weight numeric,
  duration numeric, -- for cardio in minutes
  created_at timestamp default now()
);
```

#### `summaries`
```sql
create table summaries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  week_label text not null,
  summary text,
  generated_at timestamp default now(),
  unique (user_id, week_label)
);
```

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

## 🔐 Row-Level Security (RLS) Policies

All tables in SwoleTrac are secured with RLS (Row-Level Security). Below is a complete working example for the `exercises` table, along with prompts you can reuse with AI (like ChatGPT) to generate similar policies for your other tables.

### ✅ Enable RLS for each table
```sql
alter table exercises enable row level security;
```

### 🔐 Full Policy Example for `exercises`
```sql
-- Allow users to SELECT their own exercises
create policy "Users can select their own exercises" on exercises
  for select using (user_id = auth.uid());

-- Allow users to INSERT their own exercises
create policy "Users can insert their own exercises" on exercises
  for insert with check (user_id = auth.uid());

-- Allow users to UPDATE their own exercises
create policy "Users can update their own exercises" on exercises
  for update using (user_id = auth.uid());

-- Allow users to DELETE their own exercises
create policy "Users can delete their own exercises" on exercises
  for delete using (user_id = auth.uid());
```

### 🤖 Suggested Prompt to Generate RLS for Another Table

You can paste this into ChatGPT or use it as a template to generate similar policies:

> Generate full RLS policies for the `workouts` table in Supabase. The table has a `user_id` column that should be used to restrict access so each user can only select, insert, update, and delete their own records. The policies should follow best practices and be safe for production.

For join tables like `workout_exercises` or `sets`, update the prompt accordingly:

> Generate secure RLS policies for the `sets` table. Each row links to `workout_exercises`, which in turn links to `workouts`, which has a `user_id`. Users should only be able to access sets that belong to their own workouts. Include `select`, `insert`, `update`, and `delete` policies.

This setup lets you scale securely while keeping your schema clean and your logic DRY.sql
create policy "Users can manage their sets" on sets
  for all using (
    exists (
      select 1 from workout_exercises
      join workouts on workouts.id = workout_exercises.workout_id
      where workout_exercises.id = sets.workout_exercise_id and workouts.user_id = auth.uid()
    )
  ) with check (
    exists (
      select 1 from workout_exercises
      join workouts on workouts.id = workout_exercises.workout_id
      where workout_exercises.id = sets.workout_exercise_id and workouts.user_id = auth.uid()
    )
  );
```
sql
-- Allow inserting only for the logged-in user
CREATE POLICY "Users can insert their own exercises"
  ON exercises
  FOR INSERT
  WITH CHECK (user_id = auth.uid());
```

---

## 🚀 Getting Started

### 📦 Clone the repo
```bash
git clone https://github.com/RW2023/swoletrack
```

### 📥 Install dependencies
```bash
cd swoletrac
npm install
```

### 🔧 Set up your Supabase project

Create a project at [supabase.com](https://supabase.com/) and add your environment variables below.

### 🛠️ Add environment variables to `.env.local`

#### 🔐 Example (`.env.local`)

```env
# Supabase Credentials
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Supabase Service Role (for server-side access, if needed)
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Optional: Customize Next.js base URL (helpful for SSR/redirects)
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

#### 📌 Notes:

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

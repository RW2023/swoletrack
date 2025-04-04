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
- ⚡ **Quick add** workouts or exercises on the fly using a floating action button (FAB)
- 🌙 **Light & dark mode** support using Tailwind’s `dark:` classes and custom HSL-based theming
- 💅 Beautiful and responsive UI styled with Tailwind CSS and [DaisyUI](https://daisyui.com/)

## 🛠️ Tech Stack

- **Frontend:** Next.js 14 / App Router
- **Backend:** Supabase (PostgreSQL, Auth, RLS policies)
- **Styling:** Tailwind CSS + DaisyUI
- **Fonts:** [Poppins](https://fonts.google.com/specimen/Poppins) (titles), [Karla](https://fonts.google.com/specimen/Karla) (body text)
- **Charting:** (Planned) [Chart.js](https://www.chartjs.org/) via `react-chartjs-2` for future data visualizations

## 📁 Folder Structure (Key Parts)

```txt
app/
├── dashboard/               # User dashboards
├── workouts/                # New workout form, logs
├── exercises/
│   └── quick-add/           # Fast entry form for adding exercises
└── components/
    ├── QuickAddFAB.tsx      # Floating action button
    └── delete-workout-button.tsx  # Delete button component

utils/
└── supabase/                # Supabase server/client helpers


## 🔐 Example RLS Policy (for exercises table)

```sql
-- Allow inserting only for the logged-in user
CREATE POLICY "Users can insert their own exercises"
  ON exercises
  FOR INSERT
  WITH CHECK (user_id = auth.uid());


---

### 🚀 Getting Started



```bash
# Clone the repo
git clone https://github.com/RW2023/swoletrack

# Install dependencies
cd swoletrac
npm install

# Set up your Supabase project
# Add your Supabase URL and anon/public keys to .env.local


### 🧭 Planned Features

```md
## 🔮 Planned Features

- 📈 Workout volume and streak charts
- ✅ Goal tracking
- ⌚Integrating wearable data (FitbBit)



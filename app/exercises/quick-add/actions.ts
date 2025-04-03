'use server';

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function addExercise(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('Unauthorized');
  }

  const name = formData.get('name')?.toString().trim();
  const category = formData.get('category')?.toString();

  if (!name || !category) {
    throw new Error('Name and category are required');
  }

  const { error } = await supabase.from('exercises').insert([
    {
      user_id: user.id, // ✅ required for RLS
      name,
      category,
    },
  ]);

  if (error) {
    throw new Error(`Failed to add exercise: ${error.message}`);
  }

  revalidatePath('/profile/[id]/dashboard'); // Optional: revalidate dashboard if needed
  redirect('/profile/' + user.id + '/dashboard');
}

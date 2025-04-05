import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError) {
      console.error('Auth error:', authError.message);
      return NextResponse.json({ error: authError.message }, { status: 401 });
    }

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { name, category } = await req.json();

    const { error: insertError } = await supabase.from('exercises').insert([
      {
        name,
        category,
        user_id: user.id,
      },
    ]);

    if (insertError) {
      console.error('Insert error:', insertError.message);
      return NextResponse.json({ error: insertError.message }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    // This catches any **unexpected** error (network issue, bug, JSON parsing fail, etc.)
    console.error('Unexpected error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

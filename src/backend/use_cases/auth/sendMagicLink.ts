import supabaseAdmin from 'backend/supabase/admin';

export async function sendMagicLink(email: string): Promise<boolean> {
  await supabaseAdmin.auth.signInWithOtp({
    email,
    options: { shouldCreateUser: false },
  });

  return true;
}

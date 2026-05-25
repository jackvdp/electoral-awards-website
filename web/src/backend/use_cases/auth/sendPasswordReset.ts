import supabaseAdmin from 'backend/supabase/admin';

export async function sendPasswordReset(email: string): Promise<boolean> {
  const redirectTo = process.env.NEXT_PUBLIC_BASE_URL + '/reset-password';

  await supabaseAdmin.auth.resetPasswordForEmail(email, { redirectTo });

  return true;
}

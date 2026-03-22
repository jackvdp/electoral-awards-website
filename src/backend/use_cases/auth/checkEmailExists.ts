import supabaseAdmin from 'backend/supabase/admin';

export async function checkEmailExists(email: string): Promise<boolean> {
  const { data } = await supabaseAdmin
    .from('users')
    .select('id')
    .eq('email', email)
    .single();

  return !!data;
}

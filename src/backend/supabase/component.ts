import {createBrowserClient} from '@supabase/ssr'
import {createClient as createClientNotSSRClient} from '@supabase/supabase-js';

export function createClient() {
    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    return supabase
}

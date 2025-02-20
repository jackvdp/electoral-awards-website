import {createBrowserClient} from '@supabase/ssr'
import {createServerClient} from "@supabase/ssr";

export function createClient() {
    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    return supabase
}
import {type GetServerSidePropsContext} from 'next'
import {createServerClient, serializeCookieHeader} from '@supabase/ssr'

export function createClient({req, res}: GetServerSidePropsContext) {
    return createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!,
        {
            cookies: {
                getAll() {
                    return Object.keys(req.cookies).map((name) => ({name, value: req.cookies[name] || ''}))
                },
                setAll(cookiesToSet) {
                    res.setHeader(
                        'Set-Cookie',
                        cookiesToSet.map(({name, value, options}) =>
                            serializeCookieHeader(name, value, options)
                        )
                    )
                },
            },
        }
    )
}
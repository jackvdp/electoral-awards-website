import { track } from '@vercel/analytics/server';

type Props = Record<string, string | number | boolean>;

const clip = (value: string) => value.slice(0, 250);

// Fire-and-forget server-side analytics event. Only records on Vercel
// deployments; a no-op locally. Never throws and never blocks the response.
export function trackServerEvent(name: string, props?: Props): void {
    const cleaned: Props | undefined = props
        ? Object.fromEntries(
              Object.entries(props).map(([k, v]) => [k, typeof v === 'string' ? clip(v) : v])
          )
        : undefined;
    track(name, cleaned).catch(() => {});
}

// Records an API-route failure so server error rates show up in the Vercel
// Analytics dashboard, not just the runtime logs.
export function trackApiError(route: string, error: unknown, props?: Props): void {
    const message =
        error instanceof Error ? error.message : typeof error === 'string' ? error : 'Unknown error';
    trackServerEvent('API Error', { route, message: clip(message), ...props });
}

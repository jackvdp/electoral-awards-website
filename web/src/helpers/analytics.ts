import { track } from '@vercel/analytics';

// Custom event names used across the site. Keep this list small and stable so
// the Vercel Analytics dashboard stays readable.
export type AnalyticsEvent =
    | 'Event Viewed'
    | 'Event Registration'
    | 'Event Registration Failed'
    | 'Account Signup'
    | 'Account Signup Failed'
    | 'Nomination Submitted'
    | 'Nomination Updated'
    | 'Nomination Failed'
    | 'Client Error';

type Props = Record<string, string | number | boolean>;

// Vercel rejects property values over 255 characters.
const clip = (value: string) => value.slice(0, 250);

export function trackEvent(name: AnalyticsEvent, props?: Props): void {
    try {
        const cleaned: Props | undefined = props
            ? Object.fromEntries(
                  Object.entries(props).map(([k, v]) => [k, typeof v === 'string' ? clip(v) : v])
              )
            : undefined;
        track(name, cleaned);
    } catch {
        // Analytics must never break the page.
    }
}

// Records a failure as an analytics event so error rates are visible in the
// Vercel dashboard alongside the success events.
export function trackError(context: string, error: unknown, props?: Props): void {
    const message =
        error instanceof Error ? error.message : typeof error === 'string' ? error : 'Unknown error';
    trackEvent('Client Error', { context, message: clip(message), ...props });
}

// pages/reset-password.tsx
import React, {useEffect, useState} from 'react';
import {createClient} from "../src/backend/supabase/component";
import {useRouter} from 'next/router';
import NextLink from 'components/reuseable/links/NextLink';
import CustomHead from 'components/common/CustomHead';
import PageProgress from 'components/common/PageProgress';
import {Navbar} from 'components/blocks/navbar';
import {Footer} from 'components/blocks/footer';
import SimpleBanner from "../src/components/blocks/banner/SimpleBanner";

// Status of the password-recovery session we need before the user can set a new password.
//   checking  - still trying to establish the session from the reset link
//   ready     - a valid recovery session exists, show the form
//   invalid   - the link was missing, expired or already used, show guidance
type SessionStatus = 'checking' | 'ready' | 'invalid';

const ResetPassword: React.FC = () => {
    const supabase = createClient();
    const router = useRouter();
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [infoMessage, setInfoMessage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [sessionStatus, setSessionStatus] = useState<SessionStatus>('checking');

    useEffect(() => {
        let resolved = false;
        let fallbackTimer: ReturnType<typeof setTimeout>;

        const markReady = () => {
            resolved = true;
            setSessionStatus('ready');
            setInfoMessage('Please enter your new password below.');
        };

        const markInvalid = () => {
            resolved = true;
            setSessionStatus('invalid');
        };

        const establishSession = async () => {
            // 1. Supabase redirects invalid or expired links back with an error in the URL
            //    (e.g. ?error=access_denied&error_description=...). Surface that clearly.
            const hashParams = new URLSearchParams(
                typeof window !== 'undefined' ? window.location.hash.replace(/^#/, '') : ''
            );
            const errorDescription =
                router.query.error_description ??
                router.query.error ??
                hashParams.get('error_description') ??
                hashParams.get('error');
            if (errorDescription) {
                markInvalid();
                return;
            }

            // 2. Some Supabase email templates send a token hash rather than a PKCE code.
            //    detectSessionInUrl does not handle this automatically, and it works across
            //    devices/browsers (no code verifier required), so verify it ourselves.
            const tokenHash =
                (router.query.token_hash as string | undefined) ?? hashParams.get('token_hash') ?? undefined;
            const type = (router.query.type as string | undefined) ?? hashParams.get('type') ?? undefined;
            if (tokenHash && type === 'recovery') {
                const {error: verifyError} = await supabase.auth.verifyOtp({type: 'recovery', token_hash: tokenHash});
                if (verifyError) {
                    markInvalid();
                } else {
                    markReady();
                }
                return;
            }

            // 3. Otherwise rely on the browser client. For a PKCE link (?code=...) it exchanges
            //    the code for a session on load; for an implicit link (#access_token=...) it parses
            //    the hash. Either way a session should appear shortly.
            const {data: {session}} = await supabase.auth.getSession();
            if (session) {
                markReady();
            }
            // If there is no session yet the exchange may still be in flight; the auth state
            // listener below resolves it, and the fallback timer handles the give-up case.
        };

        // The exchange can complete after the initial getSession() call, so listen for it.
        const {data: authListener} = supabase.auth.onAuthStateChange((event, session) => {
            if ((event === 'PASSWORD_RECOVERY' || event === 'SIGNED_IN') && session) {
                if (fallbackTimer) clearTimeout(fallbackTimer);
                markReady();
            }
        });

        // If nothing has resolved after a short grace period, treat the link as invalid.
        fallbackTimer = setTimeout(() => {
            if (!resolved) markInvalid();
        }, 4000);

        establishSession();

        return () => {
            if (fallbackTimer) clearTimeout(fallbackTimer);
            authListener?.subscription.unsubscribe();
        };
        // router.query is populated after hydration, so re-run once it is available.
    }, [router.query, supabase.auth]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setInfoMessage(null);
        if (newPassword !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }
        setLoading(true);
        try {
            // Guard against submitting without a valid recovery session, which is what
            // produces the raw "Auth session missing!" error from Supabase.
            const {data: {session}} = await supabase.auth.getSession();
            if (!session) {
                setSessionStatus('invalid');
                setLoading(false);
                return;
            }

            const {error} = await supabase.auth.updateUser({password: newPassword});
            if (error) {
                setError(error.message);
            } else {
                setInfoMessage('Password updated successfully. Redirecting to login...');
                setTimeout(() => {
                    router.push('/');
                }, 3000);
            }
        } catch (err: any) {
            setError(err.message);
        }
        setLoading(false);
    };

    return (
        <>
            <CustomHead
                title="Set a New Password"
                description="Reset your password to regain access to your account."
            />
            <PageProgress/>
            <Navbar/>

            <SimpleBanner title={"Set a new password"}></SimpleBanner>
            <div className="container py-8">
                <h2 className="mb-4">Reset Password</h2>

                {sessionStatus === 'checking' && (
                    <p className="text-muted">Verifying your reset link, please wait...</p>
                )}

                {sessionStatus === 'invalid' && (
                    <div className="alert alert-warning" role="alert">
                        <p className="mb-2">
                            This password reset link is invalid or has expired. Reset links can only be used
                            once and time out after a short while.
                        </p>
                        <p className="mb-0">
                            Please <NextLink href="/forgot" title="request a new reset link"
                                             className="alert-link"/> and open it on the same device and browser,
                            using the most recent email.
                        </p>
                    </div>
                )}

                {error && <p className="text-danger">{error}</p>}
                {infoMessage && <p className="text-success">{infoMessage}</p>}

                {sessionStatus === 'ready' && (
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label htmlFor="newPassword" className="form-label">
                                New Password
                            </label>
                            <input
                                type="password"
                                id="newPassword"
                                className="form-control"
                                placeholder="Enter new password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="confirmPassword" className="form-label">
                                Confirm New Password
                            </label>
                            <input
                                type="password"
                                id="confirmPassword"
                                className="form-control"
                                placeholder="Confirm new password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                        </div>
                        <button type="submit" className="btn btn-primary" disabled={loading}>
                            {loading ? 'Updating...' : 'Update Password'}
                        </button>
                    </form>
                )}
            </div>
            <Footer/>
        </>
    );
};

export default ResetPassword;

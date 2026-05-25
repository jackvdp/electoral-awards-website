// pages/reset-password.tsx
import React, {useEffect, useState} from 'react';
import {createClient} from "../src/backend/supabase/component";
import {useRouter} from 'next/router';
import CustomHead from 'components/common/CustomHead';
import PageProgress from 'components/common/PageProgress';
import {Navbar} from 'components/blocks/navbar';
import {Footer} from 'components/blocks/footer';
import SimpleBanner from "../src/components/blocks/banner/SimpleBanner";

const ResetPassword: React.FC = () => {
    const supabase = createClient();
    const router = useRouter();
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [infoMessage, setInfoMessage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Listen for auth state changes.
        // When the user clicks the reset link in their email, Supabase emits a PASSWORD_RECOVERY event.
        const {data: authListener} = supabase.auth.onAuthStateChange((event, session) => {
            if (event === 'PASSWORD_RECOVERY') {
                setInfoMessage('Please enter your new password below.');
            }
        });
        return () => authListener?.subscription.unsubscribe();
    }, [supabase.auth]);

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
                {error && <p className="text-danger">{error}</p>}
                {infoMessage && <p className="text-success">{infoMessage}</p>}
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
            </div>
            <Footer/>
        </>
    );
};

export default ResetPassword;
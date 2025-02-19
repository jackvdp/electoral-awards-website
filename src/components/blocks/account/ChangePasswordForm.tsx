// components/account/ChangePasswordForm.tsx
import React, {FC, useState} from 'react';
import {createClient} from 'backend/supabase/component';

const ChangePasswordForm: FC = () => {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage(null);

        if (newPassword !== confirmPassword) {
            setMessage('New passwords do not match');
            return;
        }

        setLoading(true);
        try {
            const supabase = createClient();

            // Use getSession() to retrieve the current session
            const {data: {session}} = await supabase.auth.getSession();
            if (!session || !session.user || !session.user.email) {
                setMessage('User session not found');
                setLoading(false);
                return;
            }

            // Verify current password by re-authenticating
            const {error: signInError} = await supabase.auth.signInWithPassword({
                email: session.user.email,
                password: currentPassword,
            });

            if (signInError) {
                setMessage('Current password is incorrect');
                setLoading(false);
                return;
            }

            // Update password
            const {error} = await supabase.auth.updateUser({password: newPassword});
            if (error) {
                setMessage(error.message);
            } else {
                setMessage('Password updated successfully');
                setCurrentPassword('');
                setNewPassword('');
                setConfirmPassword('');
            }
        } catch (err: any) {
            setMessage(err.message);
        }
        setLoading(false);
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="mb-3">
                <label htmlFor="currentPassword" className="form-label">
                    Current Password
                </label>
                <input
                    type="password"
                    id="currentPassword"
                    className="form-control"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    required
                />
            </div>
            <div className="mb-3">
                <label htmlFor="newPassword" className="form-label">
                    New Password
                </label>
                <input
                    type="password"
                    id="newPassword"
                    className="form-control"
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
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                />
            </div>
            {message && <p>{message}</p>}
            <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Updating...' : 'Update Password'}
            </button>
        </form>
    );
};

export default ChangePasswordForm;
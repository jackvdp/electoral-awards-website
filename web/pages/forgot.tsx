// pages/forgot.tsx
import React, {Fragment, useState} from 'react';
import {createClient} from 'backend/supabase/component';
import {useRouter} from 'next/router';
import CustomHead from "../src/components/common/CustomHead";
import PageProgress from "../src/components/common/PageProgress";
import {Navbar} from "../src/components/blocks/navbar";
import {Footer} from "../src/components/blocks/footer";
import SimpleBanner from "../src/components/blocks/banner/SimpleBanner";

const ForgotPassword: React.FC = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);
        setError(null);
        const supabase = createClient();

        // Optionally, set a redirect URL for when the user clicks the link in the email.
        const redirectTo = process.env.NEXT_PUBLIC_BASE_URL + '/reset-password';

        const {error} = await supabase.auth.resetPasswordForEmail(email, {redirectTo});
        if (error) {
            setError(error.message);
        } else {
            setMessage('Password reset email sent. Please check your inbox.');
        }
        setLoading(false);
    };

    return (
        <Fragment>
            <CustomHead
                title="Forgot Password"
                description="Forgot your password? No worries! Enter your email address and we'll send you a password reset link."
            />
            <PageProgress/>

            <Navbar/>

            <SimpleBanner title={"Forgot your password?"}></SimpleBanner>

            <div className="container py-8">
                <h2 className="mb-4">Forgot Password</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group mb-3">
                        <label htmlFor="email" className="form-label">
                            Email Address
                        </label>
                        <input
                            type="email"
                            id="email"
                            className="form-control"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    {error && <p className="text-danger">{error}</p>}
                    {message && <p className="text-success">{message}</p>}
                    <button type="submit" className="btn btn-primary" disabled={loading}>
                        {loading ? 'Sending...' : 'Send Password Reset Email'}
                    </button>
                </form>
            </div>

            <Footer/>
        </Fragment>
    );
};

export default ForgotPassword;
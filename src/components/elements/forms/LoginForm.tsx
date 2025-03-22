import {FC, FormEvent, Fragment, useState} from 'react';
import NextLink from 'components/reuseable/links/NextLink';
import RegisterLink from 'components/reuseable/links/RegisterLink';
import {useAuth} from 'auth/useAuth';
import {useRouter} from 'next/router';

const LoginForm: FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [magicLinkSent, setMagicLinkSent] = useState(false);
    const [visiblePassword, setVisiblePassword] = useState(false);
    const [failedToLogin, setFailedToLogin] = useState(false);
    const {login, logInWithMagicLink} = useAuth();
    const router = useRouter();

    const handlePasswordSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setMagicLinkSent(false);
        try {
            await login(email, password);
            setFailedToLogin(false);
            const closeButton = document.querySelector('[data-bs-dismiss="modal"]') as HTMLButtonElement;
            closeButton?.click();
        } catch (error) {
            setFailedToLogin(true);
        }
    };

    const handleMagicLinkSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setMagicLinkSent(false);
        try {
            const currentPath = router.asPath;
            await logInWithMagicLink(email, currentPath);
            setFailedToLogin(false);
            setMagicLinkSent(true);
        } catch (error) {
            setFailedToLogin(true);
        }
    };

    const handleNavigateToRegister = () => {
        const currentPath = router.asPath;
        if (currentPath !== '/' && currentPath !== '/register') {
            router.push(`/register?redirect=${encodeURIComponent(currentPath)}`);
        } else {
            router.push('/register');
        }
    };

    const handleNavigateToForgotPassword = () => {
        router.push('/forgot');
    };

    function failedToLoginMessage() {
        return <p
            className="lead text-start ml-6"
            style={{fontSize: '12px', color: 'red', paddingLeft: '20px'}}
        >
            Incorrect username and/or password. Please try again.
        </p>;
    }

    function setMagicLinkMessage() {
        return <p
            className="lead text-start ml-6"
            style={{fontSize: '12px', color: 'green', paddingLeft: '20px'}}
        >
            Sign in link sent to your email address.
        </p>;
    }

    return (
        <Fragment>
            <h2 className="mb-3 text-start">Welcome Back</h2>
            <p className="lead text-start">
                Choose your sign in method below.
            </p>

            <ul className="nav nav-tabs nav-tabs-basic">
                <li className="nav-item">
                    <a className="nav-link active" data-bs-toggle="tab" href="#tab-password">
                        Password
                    </a>
                </li>
                <li className="nav-item">
                    <a className="nav-link" data-bs-toggle="tab" href="#tab-magic">
                        Email Link
                    </a>
                </li>
            </ul>

            <div className="tab-content mt-0 mt-md-5">
                <div className="tab-pane fade show active" id="tab-password">
                    <form onSubmit={handlePasswordSubmit} className="mb-3">
                        <div className="form-floating mb-4">
                            <input
                                type="email"
                                value={email}
                                id="loginEmail"
                                placeholder="Email"
                                className="form-control"
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            <label htmlFor="loginEmail">Email</label>
                        </div>

                        <div className="form-floating password-field mb-4">
                            <input
                                value={password}
                                id="loginPassword"
                                placeholder="Password"
                                className="form-control"
                                type={visiblePassword ? 'text' : 'password'}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <span
                                className="password-toggle"
                                onClick={() => setVisiblePassword(!visiblePassword)}
                            >
                                <i className={`uil ${visiblePassword ? 'uil-eye-slash' : 'uil-eye'}`}/>
                            </span>
                            <label htmlFor="loginPassword">Password</label>
                        </div>

                        {failedToLogin && failedToLoginMessage()}

                        <button
                            type="submit"
                            className="btn btn-primary rounded-pill btn-login w-100 mb-2"
                        >
                            Sign In
                        </button>
                        <p className="mb-1">
                            <a
                                onClick={handleNavigateToForgotPassword}
                                data-bs-dismiss="modal"
                                className="hover"
                            >
                                Forgot Password?
                            </a>
                        </p>
                    </form>
                </div>

                <div className="tab-pane fade" id="tab-magic">
                    <form onSubmit={handleMagicLinkSubmit} className="text-start mb-3">
                        <div className="form-floating mb-4">
                            <input
                                type="email"
                                value={email}
                                id="magicEmail"
                                placeholder="Email"
                                className="form-control"
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            <label htmlFor="magicEmail">Email</label>
                        </div>
                        {failedToLogin && failedToLoginMessage()}
                        {magicLinkSent && setMagicLinkMessage()}
                        <button
                            type="submit"
                            className="btn btn-primary rounded-pill btn-login w-100 mb-2"
                        >
                            Send Email Link
                        </button>
                    </form>
                </div>
            </div>

            <p className="mb-0">
                Don&apos;t have an account?{' '}
                <a
                    className="hover"
                    data-bs-dismiss="modal"
                    onClick={handleNavigateToRegister}
                >
                    Sign up
                </a>
            </p>
        </Fragment>
    );
};

export default LoginForm;
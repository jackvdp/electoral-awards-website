import {FC, FormEvent, Fragment, useState} from 'react';
import NextLink from 'components/reuseable/links/NextLink';
import {useAuth} from 'auth/useAuth';
import {useRouter} from 'next/router';

const LoginForm: FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [visiblePassword, setVisiblePassword] = useState(false);
    const [failedToLogin, setFailedToLogin] = useState(false)
    const {login} = useAuth()
    const router = useRouter();

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        try {
            await login(email, password)
            setFailedToLogin(false)
            const closeButton = document.querySelector('[data-bs-dismiss="modal"]') as HTMLButtonElement;
            closeButton?.click();
        } catch (error) {
            setFailedToLogin(true)
        }
    };

    const handleNavigateToRegister = () => {
        router.push('/register');
    };

    const handleNavigateToForgotPassword = () => {
        router.push('/forgot');
    };

    return (
        <Fragment>
            <h2 className="mb-3 text-start">Welcome Back</h2>
            <p className="lead mb-6 text-start">Fill your email and password to sign in.</p>

            <form onSubmit={handleSubmit} className="text-start mb-3">
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
                    <span className="password-toggle" onClick={() => setVisiblePassword(!visiblePassword)}>
                        <i className={`uil  ${visiblePassword ? 'uil-eye-slash' : 'uil-eye'}`}/>
                    </span>

                    <label htmlFor="loginPassword">Password</label>
                </div>

                {failedToLogin &&
                    <p className="lead text-start ml-6" style={{fontSize: '12px', color: 'red', paddingLeft: '20px'}}>
                        Incorrect username and/or password. Please try again.
                    </p>

                }

                <button type="submit" className="btn btn-primary rounded-pill btn-login w-100 mb-2">
                    Sign In
                </button>
            </form>

            <p className="mb-1">
                <a onClick={handleNavigateToForgotPassword} data-bs-dismiss="modal" className="hover">Forgot
                    Password?</a>
            </p>

            <p className="mb-0">
                Don&apos;t have an account? <a className="hover" onClick={handleNavigateToRegister}
                                               data-bs-dismiss="modal">Sign
                up</a>
            </p>
        </Fragment>
    );
};

export default LoginForm;

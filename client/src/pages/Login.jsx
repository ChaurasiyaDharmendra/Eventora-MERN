import React, { useState, useContext } from 'react';

import { AuthContext } from '../context/AuthContext';

import { useNavigate, Link } from 'react-router-dom';

const Login = () => {

    const [email, setEmail] = useState('');

    const [password, setPassword] = useState('');

    const [otp, setOtp] = useState('');

    const [showOTP, setShowOTP] = useState(false);

    const [showPassword, setShowPassword] = useState(false);

    const [showForgot, setShowForgot] = useState(false);

    const [forgotStep, setForgotStep] = useState(1);

    const [newPassword, setNewPassword] = useState('');

    const [confirmPassword, setConfirmPassword] = useState('');

    const [error, setError] = useState('');

    const [success, setSuccess] = useState('');

    const [loading, setLoading] = useState(false);

    const {
        login,
        verifyOTP,
        forgotPassword,
        verifyForgotOTP,
        resetPassword
    } = useContext(AuthContext);

    const navigate = useNavigate();


    // LOGIN
    const handleSubmit = async (e) => {

        e.preventDefault();

        setLoading(true);
        setError('');
        setSuccess('');

        try {

            if (!showOTP) {

                const data = await login(email, password);

                if (data.role === 'admin') {
                    navigate('/admin');
                } else {
                    navigate('/dashboard');
                }

            } else {

                const data = await verifyOTP(email, otp);

                if (data.role === 'admin') {
                    navigate('/admin');
                } else {
                    navigate('/dashboard');
                }
            }

        } catch (err) {

            if (err.needsVerification) {

                setShowOTP(true);

                setError(
                    'Account not verified. A new OTP has been sent to your email.'
                );

            } else {

                setError(err.message || err);
            }

        } finally {

            setLoading(false);
        }
    };


    // SEND FORGOT PASSWORD OTP
    const handleForgotPassword = async (e) => {

        e.preventDefault();

        setLoading(true);
        setError('');
        setSuccess('');

        try {

            await forgotPassword(email);

            setForgotStep(2);

            setSuccess(
                'OTP sent successfully to your email.'
            );

        } catch (err) {

            setError(err.message || err);

        } finally {

            setLoading(false);
        }
    };


    // VERIFY FORGOT PASSWORD OTP
    const handleVerifyForgotOTP = async (e) => {

        e.preventDefault();

        setLoading(true);
        setError('');
        setSuccess('');

        try {

            await verifyForgotOTP(email, otp);

            setForgotStep(3);

            setSuccess(
                'OTP verified. Please create your new password.'
            );

        } catch (err) {

            setError(err.message || err);

        } finally {

            setLoading(false);
        }
    };


    // RESET PASSWORD
    const handleResetPassword = async (e) => {

        e.preventDefault();

        setError('');
        setSuccess('');

        if (newPassword !== confirmPassword) {

            setError('Passwords do not match.');

            return;
        }

        if (newPassword.length < 6) {

            setError(
                'Password must be at least 6 characters.'
            );

            return;
        }

        setLoading(true);

        try {

            await resetPassword(
                email,
                otp,
                newPassword
            );

            setSuccess(
                'Password reset successfully. You can now login.'
            );

            setTimeout(() => {

                setShowForgot(false);
                setForgotStep(1);
                setOtp('');
                setNewPassword('');
                setConfirmPassword('');
                setSuccess('');

            }, 1500);

        } catch (err) {

            setError(err.message || err);

        } finally {

            setLoading(false);
        }
    };


    // FORGOT PASSWORD SCREEN
    if (showForgot) {

        return (

            <div className="max-w-md mx-auto mt-20 bg-white p-8 rounded-xl shadow-lg border border-gray-100">

                <div className="text-center mb-8">

                    <h2 className="text-3xl font-extrabold text-gray-900 mb-2">
                        Forgot Password
                    </h2>

                    <p className="text-gray-500">
                        Reset your Eventora account password
                    </p>

                </div>


                {error && (

                    <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-6 text-center border border-red-100">
                        {error}
                    </div>

                )}


                {success && (

                    <div className="bg-green-50 text-green-600 p-3 rounded-lg mb-6 text-center border border-green-100">
                        {success}
                    </div>

                )}


                {forgotStep === 1 && (

                    <form
                        onSubmit={handleForgotPassword}
                        className="space-y-6"
                    >

                        <div>

                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Email Address
                            </label>

                            <input
                                type="email"
                                required
                                placeholder="Enter your email"
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-gray-700 focus:border-gray-700 transition shadow-sm"
                                value={email}
                                onChange={(e) =>
                                    setEmail(e.target.value)
                                }
                            />

                        </div>


                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gray-900 text-white font-bold py-3 rounded-lg hover:bg-black transition shadow-md"
                        >

                            {loading
                                ? 'Sending...'
                                : 'Send OTP'}

                        </button>

                    </form>

                )}


                {forgotStep === 2 && (

                    <form
                        onSubmit={handleVerifyForgotOTP}
                        className="space-y-6"
                    >

                        <div>

                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Verification Code (OTP)
                            </label>

                            <input
                                type="text"
                                required
                                placeholder="6-digit OTP"
                                maxLength="6"
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-gray-700 transition shadow-sm font-bold tracking-widest text-center text-lg"
                                value={otp}
                                onChange={(e) =>
                                    setOtp(e.target.value)
                                }
                            />

                        </div>


                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gray-900 text-white font-bold py-3 rounded-lg hover:bg-black transition shadow-md"
                        >

                            {loading
                                ? 'Verifying...'
                                : 'Verify OTP'}

                        </button>

                    </form>

                )}


                {forgotStep === 3 && (

                    <form
                        onSubmit={handleResetPassword}
                        className="space-y-6"
                    >

                        <div>

                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                New Password
                            </label>

                            <input
                                type="password"
                                required
                                placeholder="Enter new password"
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-gray-700 transition shadow-sm"
                                value={newPassword}
                                onChange={(e) =>
                                    setNewPassword(e.target.value)
                                }
                            />

                        </div>


                        <div>

                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Confirm Password
                            </label>

                            <input
                                type="password"
                                required
                                placeholder="Confirm new password"
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-gray-700 transition shadow-sm"
                                value={confirmPassword}
                                onChange={(e) =>
                                    setConfirmPassword(e.target.value)
                                }
                            />

                        </div>


                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gray-900 text-white font-bold py-3 rounded-lg hover:bg-black transition shadow-md"
                        >

                            {loading
                                ? 'Resetting...'
                                : 'Reset Password'}

                        </button>

                    </form>

                )}


                <button
                    type="button"
                    onClick={() => {

                        setShowForgot(false);
                        setForgotStep(1);
                        setOtp('');
                        setError('');
                        setSuccess('');

                    }}
                    className="w-full text-center mt-6 text-gray-700 font-semibold hover:underline"
                >

                    ← Back to Login

                </button>

            </div>
        );
    }


    // NORMAL LOGIN SCREEN
    return (

        <div className="max-w-md mx-auto mt-20 bg-white p-8 rounded-xl shadow-lg border border-gray-100">

            <div className="text-center mb-8">

                <h2 className="text-3xl font-extrabold text-gray-900 mb-2">
                    Welcome Back
                </h2>

                <p className="text-gray-500">
                    Sign in to your Eventora account
                </p>

            </div>


            {error && (

                <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-6 text-center shadow-inner border border-red-100">
                    {error}
                </div>

            )}


            {success && (

                <div className="bg-green-50 text-green-600 p-3 rounded-lg mb-6 text-center border border-green-100">
                    {success}
                </div>

            )}


            <form
                onSubmit={handleSubmit}
                className="space-y-6"
            >

                {!showOTP ? (

                    <>

                        <div>

                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Email Address
                            </label>

                            <input
                                type="email"
                                required
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-gray-700 focus:border-gray-700 transition shadow-sm"
                                value={email}
                                onChange={(e) =>
                                    setEmail(e.target.value)
                                }
                            />

                        </div>


                        <div>

                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Password
                            </label>

                            <div className="relative">

                                <input
                                    type={
                                        showPassword
                                            ? 'text'
                                            : 'password'
                                    }
                                    required
                                    className="w-full px-4 py-3 pr-12 rounded-lg border border-gray-300 focus:ring-2 focus:ring-gray-700 focus:border-gray-700 transition shadow-sm"
                                    value={password}
                                    onChange={(e) =>
                                        setPassword(e.target.value)
                                    }
                                />


                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowPassword(!showPassword)
                                    }
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-900"
                                >

                                    {showPassword ? (

                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-5 w-5"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                        >

                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M13.875 18.825A10.05 10.05 0 0112 19c-5 0-9-7-9-7a16.75 16.75 0 013.19-4.03M9.88 4.47A9.97 9.97 0 0112 5c5 0 9 7 9 7a16.75 16.75 0 01-3.19 4.03M3 3l18 18"
                                            />

                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M10.58 10.58a2 2 0 102.83 2.83"
                                            />

                                        </svg>

                                    ) : (

                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-5 w-5"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                        >

                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                            />

                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                            />

                                        </svg>

                                    )}

                                </button>

                            </div>


                            <div className="text-right mt-2">

                                <button
                                    type="button"
                                    onClick={() => {

                                        setShowForgot(true);
                                        setError('');
                                        setSuccess('');

                                    }}
                                    className="text-sm text-gray-700 font-semibold hover:underline"
                                >

                                    Forgot Password?

                                </button>

                            </div>

                        </div>

                    </>

                ) : (

                    <div>

                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Verification Code (OTP)
                        </label>

                        <input
                            type="text"
                            required
                            placeholder="6-digit code"
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-gray-700 transition shadow-sm font-bold tracking-widest text-center text-lg"
                            value={otp}
                            onChange={(e) =>
                                setOtp(e.target.value)
                            }
                            maxLength="6"
                        />

                    </div>

                )}


                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gray-900 text-white font-bold py-3 rounded-lg hover:bg-black focus:ring-4 focus:ring-gray-200 transition shadow-md"
                >

                    {loading
                        ? 'Processing...'
                        : showOTP
                            ? 'Verify OTP & Log In'
                            : 'Sign In'}

                </button>

            </form>


            <p className="text-center mt-8 text-gray-600">

                Don't have an account?{' '}

                <Link
                    to="/register"
                    className="text-gray-900 font-bold hover:underline"
                >
                    Sign up
                </Link>

            </p>

        </div>
    );
};

export default Login;
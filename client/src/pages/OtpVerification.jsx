import { useState, useEffect, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { otpVerify, sendOtp } from "../services/otpServices";
import { fetchUser } from "../services/authServices";
import { UserContext } from "../context/AuthProvider";
import Input from "../components/ui/Input";
import ErrorMessage from "../components/ui/ErrorMessage";
import { Mail, ArrowLeft } from "lucide-react";

export default function OtpVerification() {
    const navigate = useNavigate();
    const location = useLocation();
    const { setUser } = useContext(UserContext);

    const [email, setEmail] = useState(location.state?.email || '');
    const [otp, setOtp] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isResending, setIsResending] = useState(false);
    const [resendCountdown, setResendCountdown] = useState(0);

    // Countdown timer for resend button
    useEffect(() => {
        if (resendCountdown <= 0) return;
        
        const timer = setTimeout(() => {
            setResendCountdown(resendCountdown - 1);
        }, 1000);

        return () => clearTimeout(timer);
    }, [resendCountdown]);

    // Redirect if no email provided
    useEffect(() => {
        if (!email) {
            navigate('/login');
        }
    }, [email, navigate]);

    const handleVerify = async () => {
        try {
            if (isLoading) return;

            if (!otp || otp.length !== 6) {
                setErrorMessage('Please enter a valid 6-digit OTP');
                return;
            }

            setIsLoading(true);
            setErrorMessage('');
            setSuccessMessage('');

            const result = await otpVerify({ email, otp });

            if (result.success) {
                setSuccessMessage('Email verified successfully! Redirecting...');
                
                // Fetch user data
                const userResult = await fetchUser();
                if (userResult) {
                    setUser(userResult);
                    
                    // Redirect to dashboard after 1.5 seconds
                    setTimeout(() => {
                        navigate('/dashboard');
                    }, 1500);
                } else {
                    setErrorMessage('Failed to fetch user information. Please try again.');
                    setIsLoading(false);
                }
            } else {
                setErrorMessage(result.message || 'Failed to verify OTP');
                setIsLoading(false);
            }
        } catch (error) {
            console.error('Error verifying OTP:', error);
            setErrorMessage('An unexpected error occurred. Please try again.');
            setIsLoading(false);
        }
    };

    const handleResendOtp = async () => {
        try {
            if (isResending) return;

            setIsResending(true);
            setErrorMessage('');
            setSuccessMessage('');

            const result = await sendOtp({ email });

            if (result.success) {
                setSuccessMessage('OTP resent successfully! Check your email.');
                setResendCountdown(60); // 60 second countdown
                setOtp(''); // Clear OTP input
                setIsResending(false);
            } else {
                setErrorMessage(result.message || 'Failed to resend OTP');
                setIsResending(false);
            }
        } catch (error) {
            console.error('Error resending OTP:', error);
            setErrorMessage('An unexpected error occurred. Please try again.');
            setIsResending(false);
        }
    };

    const handleOtpChange = (e) => {
        const value = e.target.value.replace(/[^0-9]/g, '').slice(0, 6);
        setOtp(value);
        setErrorMessage('');
    };

    return (
        <div className="flex-center flex-col min-h-screen bg-gray-50">
            <img
                src="/revier-icon.svg"
                alt="revier icon"
                className="h-16 mb-8"
            />
            <div className="border border-gray-200 rounded-xl p-6 shadow-lg w-[min(100%,450px)] bg-white">
                <button
                    onClick={() => navigate('/login')}
                    className="flex gap-2 font-semibold cursor-pointer mb-6 text-gray-700 hover:text-emerald-600"
                >
                    <ArrowLeft size={20} />
                    Back to Login
                </button>

                <div className="flex justify-center mb-6">
                    <div className="bg-emerald-100 p-4 rounded-full">
                        <Mail size={32} className="text-emerald-600" />
                    </div>
                </div>

                <p className="font-bold text-2xl mb-2 text-center">Verify Your Email</p>
                <p className="text-gray-500 mb-2 text-center">We've sent a 6-digit OTP to</p>
                <p className="text-emerald-600 font-semibold text-center mb-6">{email}</p>

                <div className="mb-6">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Enter OTP Code
                    </label>
                    <input
                        type="text"
                        inputMode="numeric"
                        maxLength={6}
                        placeholder="000000"
                        value={otp}
                        onChange={handleOtpChange}
                        className="w-full px-4 py-3 text-center text-2xl font-bold tracking-widest border-2 border-gray-300 rounded-lg focus:outline-none focus:border-emerald-500 transition-colors"
                    />
                    <p className="text-xs text-gray-500 mt-2">OTP expires in 5 minutes</p>
                </div>

                {errorMessage && (
                    <div className="mb-4">
                        <ErrorMessage>{errorMessage}</ErrorMessage>
                    </div>
                )}

                {successMessage && (
                    <div className="mb-4 p-3 bg-green-50 border border-green-300 rounded-lg">
                        <p className="text-green-700 text-sm font-semibold">{successMessage}</p>
                    </div>
                )}

                <button
                    onClick={handleVerify}
                    disabled={isLoading || otp.length !== 6}
                    className="btn bg-emerald-500 text-white py-3 w-full rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-emerald-600 transition-colors mb-4"
                >
                    {isLoading ? (
                        <div className="flex items-center justify-center gap-2">
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            Verifying...
                        </div>
                    ) : (
                        'Verify Email'
                    )}
                </button>

                <div className="relative mb-4">
                    <hr className="border-gray-200" />
                    <p className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white px-3 text-gray-500 text-sm">
                        or
                    </p>
                </div>

                <button
                    onClick={handleResendOtp}
                    disabled={isResending || resendCountdown > 0}
                    className="w-full py-3 rounded-lg font-semibold border border-emerald-500 text-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-emerald-50 transition-colors"
                >
                    {isResending ? (
                        <div className="flex items-center justify-center gap-2">
                            <div className="w-4 h-4 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
                            Sending...
                        </div>
                    ) : resendCountdown > 0 ? (
                        `Resend OTP in ${resendCountdown}s`
                    ) : (
                        'Resend OTP'
                    )}
                </button>

                <p className="text-xs text-gray-500 text-center mt-6">
                    Didn't receive the OTP? Make sure to check your spam folder
                </p>
            </div>
        </div>
    );
}

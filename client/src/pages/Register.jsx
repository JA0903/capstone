import { ArrowLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { handleRegister } from "../services/authServices";
import { useForm } from "../hooks/form";
import { useState } from "react";
import Input from "../components/ui/Input";
import ErrorMessage from "../components/ui/ErrorMessage";

export default function Register() {
    const navigate = useNavigate();

    const { formData, handleInputChange: handleInputChangeOriginal } = useForm({
        fullname: '',
        email: '',
        password: '',
        confirmPassword: '',
    });

    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleInputChange = (e) => {
        handleInputChangeOriginal(e);
        setErrorMessage('');
        setSuccessMessage('');
    };

    const handleSubmit = async () => {
        try {
            if (isLoading) return;

            if (!formData.fullname || !formData.email || !formData.password || !formData.confirmPassword) {
                setErrorMessage('Please fill in all fields');
                return;
            }

            if (formData.password !== formData.confirmPassword) {
                setErrorMessage('Passwords do not match');
                return;
            }

            if (formData.password.length < 8) {
                setErrorMessage('Password must be at least 8 characters long');
                return;
            }

            setIsLoading(true);
            const { success, message } = await handleRegister(formData);
            if (success) {
                setErrorMessage('');
                setSuccessMessage('Account created successfully! Redirecting to login...');
                setTimeout(() => {
                    navigate('/login');
                }, 2000);
            } else {
                setSuccessMessage('');
                setErrorMessage(message || 'Failed to create account');
                setIsLoading(false);
            }
        } catch (error) {
            console.error('Error on handleSubmit:', error);
            setErrorMessage('An unexpected error occurred. Please try again.');
            setIsLoading(false);
        }
    }

    return (
        <div className="flex-center flex-col min-h-screen">
            <img
                src="/revier-icon.svg"
                alt="revier icon"
                className="h-16 mb-8"
            />
            <div className="border border-gray-200 rounded-xl p-4 shadow-lg w-[min(100%,450px)]">
                <Link to={'/home'}>
                    <button className="flex gap-2 font-semibold cursor-pointer mb-6">
                        <ArrowLeft />
                        Back
                    </button>
                </Link>

                <p className="font-bold text-2xl mb-2">Create Account</p>
                <p className="text-gray-500 mb-6">Fill in your details to get started</p>

                <div className="mb-4">
                    <Input
                        label="Fullname"
                        required={true}
                        type="text"
                        name="fullname"
                        placeholder="Jahleel Casintahan"
                        value={formData.fullname}
                        onChange={handleInputChange}
                    />
                </div>

                <div className="mb-4">
                    <Input
                        label="Email Address"
                        required={true}
                        type="email"
                        name="email"
                        placeholder="jahleel@email.com"
                        value={formData.email}
                        onChange={handleInputChange}
                    />
                </div>

                <div className="mb-4">
                    <Input
                        label="Password"
                        required={true}
                        type="password"
                        name="password"
                        placeholder="••••••••"
                        value={formData.password}
                        onChange={handleInputChange}
                    />
                    <p className="text-xs text-gray-500 mt-1">Must contain: 8+ chars, uppercase, lowercase, number, special char (!@#$%^&*)</p>
                </div>

                <div className="mb-4">
                    <Input
                        label="Confirm Password"
                        required={true}
                        type="password"
                        name="confirmPassword"
                        placeholder="••••••••"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                    />
                </div>

                {errorMessage &&
                    <div className="mb-4">
                        <ErrorMessage>{errorMessage}</ErrorMessage>
                    </div>
                }

                {successMessage &&
                    <div className="mb-4 flex items-center justify-center bg-emerald-500/10 text-emerald-600 p-3 rounded-lg font-semibold">
                        ✓ {successMessage}
                    </div>
                }

                <button
                    className="btn bg-emerald-500 text-white py-6 w-full rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={handleSubmit}
                    disabled={isLoading}
                >
                    {isLoading ? 'Creating Account...' : 'Create Account'}
                </button>

                <hr className="border-gray-200 my-4" />

                <p className="text-gray-500 text-center">Already have an account? <Link to={'/login'}><span className="text-emerald-500">Sign in</span></Link></p>
            </div>
        </div>
    )
}
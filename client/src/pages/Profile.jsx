/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { useEffect } from "react";
import Topbar from "../components/Topbar";
import Input from "../components/ui/Input";
import TagInput from "../components/ui/TagInput";
import Textarea from "../components/ui/Textarea";
import { Link } from "react-router-dom";
import { editUserProfile, fetchUserProfile, updateResume } from "../services/userServices";
import { useForm } from "../hooks/form";
import { useState } from "react";
import { toast } from "react-toastify";
import VerifyEmail from "../components/VerifyEmail";
import { FileText, Upload } from "lucide-react";

export default function Profile() {

    const [errorMessage, setErrorMessage] = useState('');
    const [openOTPVerification, setOpenOTPVerification] = useState(false);
    const [resumeFile, setResumeFile] = useState(null);
    const [currentResume, setCurrentResume] = useState(null);
    const [isUploadingResume, setIsUploadingResume] = useState(false);

    const { formData, setFormData, handleInputChange } = useForm({
        fullname: '',
        email: '',
        password: '',
        confirmPassword: '',
    });

    const handleSubmit = async () => {
        try {
            const { success, message } = await editUserProfile(formData);
            if (success) return toast.success(message);
            setErrorMessage(message);
        } catch (error) {
            console.error('Error on handleSubmit:', error);
        }
    }

    const handleEnableOTP = () => {
        setOpenOTPVerification(true);
    }

    const handleResumeSelect = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            // Validate file type
            const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
            const allowedExtensions = ['.pdf', '.doc', '.docx'];
            const fileExtension = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();

            if (!allowedTypes.includes(file.type) && !allowedExtensions.includes(fileExtension)) {
                toast.error('Only PDF, DOC, and DOCX files are allowed');
                return;
            }

            // Validate file size (5MB)
            if (file.size > 5 * 1024 * 1024) {
                toast.error('File size exceeds 5MB limit');
                return;
            }

            setResumeFile(file);
        }
    };

    const handleResumeUpload = async () => {
        if (!resumeFile) {
            toast.error('Please select a resume file');
            return;
        }

        setIsUploadingResume(true);
        try {
            const { success, message } = await updateResume(resumeFile);
            if (success) {
                toast.success(message);
                setResumeFile(null);
                setCurrentResume(resumeFile.name);
                // Reset file input
                document.getElementById('resumeInput').value = '';
            } else {
                toast.error(message);
            }
        } catch (error) {
            console.error('Error on handleResumeUpload:', error);
            toast.error('Failed to upload resume');
        } finally {
            setIsUploadingResume(false);
        }
    };

    const downloadResume = () => {
        if (currentResume) {
            const link = document.createElement('a');
            link.href = `/server/uploads/resumes/${currentResume}`;
            link.download = currentResume;
            document.body.appendChild(link);
            link.click();
            link.parentElement.removeChild(link);
        }
    };

    useEffect(() => {
        const loadProfile = async () => {
            try {
                const { success, message, user } = await fetchUserProfile();
                if (success) {
                    setFormData(user);
                    if (user?.applicationResume || user?.resume) {
                        setCurrentResume(user.applicationResume || user.resume);
                    }
                }
            } catch (error) {
                console.error('Error on loadProfile:', error);
            }
        }
        loadProfile();
    }, []);

    return (
        <div className="flex flex-col max-h-screen">
            <Topbar />
            <div className="relative grow overflow-auto px-[10vw]">
                <div className="sticky top-0 bg-white flex justify-end gap-4 py-4 z-10">
                    <Link to="/dashboard">
                        <button className="btn btn-ghost rounded-lg">Cancel</button>
                    </Link>
                    <button
                        className="btn bg-emerald-500 text-white rounded-lg"
                        onClick={handleSubmit}
                    >
                        Save Changes
                    </button>
                </div>

                <section className="rounded-xl border border-gray-200 p-4 mb-8">
                    <p className="text-lg font-semibold mb-4">Personal Information</p>

                    <div className="mb-4">
                        <Input
                            label="Full Name"
                            name="fullname"
                            value={formData?.fullname}
                            placeholder="Jahleel Casintahan"
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                        <Input
                            disabled={true}
                            label="Email Address"
                            name="email"
                            value={formData?.email}
                            placeholder="jahleel@gmail.com"
                            onChange={handleInputChange}
                        />
                        <Input
                            label="Phone Number"
                            name="phone"
                            value={formData?.phone}
                            placeholder="+63 91 234 5678"
                            onChange={handleInputChange}
                        />
                    </div>
                </section>

                <section className="rounded-xl border border-gray-200 p-4 mb-8">
                    <p className="text-lg font-semibold mb-2">Resume / CV</p>
                    <p className="text-gray-500 text-sm mb-4">Upload your resume to apply faster. Supported formats: PDF, DOC, DOCX (Max 5MB)</p>
                    
                    <div className="flex flex-col gap-4">
                        {/* Current Resume Display */}
                        {currentResume && (
                            <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
                                <div className="flex items-center gap-3 mb-3">
                                    <FileText className="text-emerald-600" size={20} />
                                    <div className="flex-1">
                                        <p className="font-medium text-gray-800 truncate">{currentResume}</p>
                                        <p className="text-xs text-gray-500">Current resume</p>
                                    </div>
                                </div>
                                <button
                                    onClick={downloadResume}
                                    className="text-sm text-emerald-600 hover:text-emerald-700 font-medium"
                                >
                                    Download Current Resume
                                </button>
                            </div>
                        )}

                        {/* Resume Upload Area */}
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-emerald-500 transition-colors">
                            <input
                                id="resumeInput"
                                type="file"
                                accept=".pdf,.doc,.docx"
                                onChange={handleResumeSelect}
                                className="hidden"
                            />
                            
                            {!resumeFile ? (
                                <label htmlFor="resumeInput" className="cursor-pointer flex flex-col items-center gap-2">
                                    <Upload size={32} className="text-gray-400" />
                                    <p className="text-gray-700 font-medium">Click to upload your resume</p>
                                    <p className="text-xs text-gray-500">PDF, DOC, or DOCX • Max 5MB</p>
                                </label>
                            ) : (
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <FileText className="text-blue-500" size={24} />
                                        <div>
                                            <p className="font-medium text-gray-800 truncate">{resumeFile.name}</p>
                                            <p className="text-xs text-gray-500">{(resumeFile.size / 1024).toFixed(2)} KB</p>
                                        </div>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setResumeFile(null);
                                            document.getElementById('resumeInput').value = '';
                                        }}
                                        className="text-red-500 hover:text-red-700 font-medium text-sm"
                                    >
                                        Remove
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Upload Button */}
                        {resumeFile && (
                            <button
                                onClick={handleResumeUpload}
                                disabled={isUploadingResume}
                                className="btn bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isUploadingResume ? 'Uploading...' : 'Update Resume'}
                            </button>
                        )}
                    </div>
                </section>

                <section className="rounded-xl border border-gray-200 p-4 mb-8">
                    <p className="text-lg font-semibold mb-2">Security Settings</p>
                    <p className="text-gray-500 text-sm mb-4">Enhance your account security with two-factor authentication</p>
                    
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="font-semibold text-gray-700">Email Verification (OTP)</p>
                            <p className="text-sm text-gray-500">Receive a one-time password via email for additional security</p>
                        </div>
                        <button
                            className="btn bg-emerald-500 text-white rounded-lg px-6"
                            onClick={handleEnableOTP}
                        >
                            Enable
                        </button>
                    </div>
                </section>
            </div>

            {openOTPVerification &&
                <VerifyEmail
                    onClose={() => setOpenOTPVerification(false)}
                    email={formData?.email}
                    successFunction={() => {
                        toast.success('Email verification enabled successfully!');
                    }}
                />
            }
        </div>
    )
}
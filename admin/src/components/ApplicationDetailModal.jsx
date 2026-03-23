import { Modal, ModalBackground, ModalHeader } from "./ui/ui-modal";
import { FileText, Mail, Phone, MapPin, Award, GraduationCap, Building2, ExternalLink } from "lucide-react";

export default function ApplicationDetailModal({ applicant, onClose = () => { } }) {

    if (!applicant) return null;

    const viewResume = () => {
        if (applicant?.resume) {
            window.open(`http://localhost:8001/uploads/resumes/${applicant.resume}`, '_blank');
        }
    };

    const downloadResume = () => {
        if (applicant?.resume) {
            const link = document.createElement('a');
            link.href = `http://localhost:8001/uploads/resumes/${applicant.resume}`;
            link.download = applicant.resume;
            document.body.appendChild(link);
            link.click();
            link.parentElement.removeChild(link);
        }
    };

    return (
        <ModalBackground>
            <Modal maxWidth={600}>
                <ModalHeader
                    icon={FileText}
                    title="Application Details"
                    subTitle={applicant?.fullname}
                    onClose={onClose}
                />

                <div className="grid grid-cols-1 gap-6 mt-6">

                    {/* Personal Information */}
                    <section>
                        <p className="text-lg font-semibold mb-4">Personal Information</p>
                        <div className="space-y-3">
                            <div className="flex items-start gap-3">
                                <Mail size={18} className="text-emerald-500 mt-0.5 shrink-0" />
                                <div>
                                    <p className="text-xs text-gray-500">Email</p>
                                    <p className="text-sm font-medium">{applicant?.user?.email || 'N/A'}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <Phone size={18} className="text-emerald-500 mt-0.5 shrink-0" />
                                <div>
                                    <p className="text-xs text-gray-500">Phone</p>
                                    <p className="text-sm font-medium">{applicant?.phone || 'N/A'}</p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Position Information */}
                    <section>
                        <p className="text-lg font-semibold mb-4">Position</p>
                        <div className="space-y-3">
                            <div className="flex items-start gap-3">
                                <Award size={18} className="text-emerald-500 mt-0.5 shrink-0" />
                                <div>
                                    <p className="text-xs text-gray-500">Job Title</p>
                                    <p className="text-sm font-medium">{applicant?.job?.jobTitle || 'N/A'}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <Building2 size={18} className="text-emerald-500 mt-0.5 shrink-0" />
                                <div>
                                    <p className="text-xs text-gray-500">Company</p>
                                    <p className="text-sm font-medium">{applicant?.job?.company?.companyName || 'N/A'}</p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Optional Links */}
                    {(applicant?.linkedIn || applicant?.portfolio) && (
                        <section>
                            <p className="text-lg font-semibold mb-4">Links</p>
                            <div className="space-y-2">
                                {applicant?.linkedIn && (
                                    <a href={applicant.linkedIn} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-emerald-500 hover:underline text-sm">
                                        <ExternalLink size={16} />
                                        LinkedIn Profile
                                    </a>
                                )}
                                {applicant?.portfolio && (
                                    <a href={applicant.portfolio} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-emerald-500 hover:underline text-sm">
                                        <ExternalLink size={16} />
                                        Portfolio
                                    </a>
                                )}
                            </div>
                        </section>
                    )}

                    {/* Resume */}
                    {applicant?.resume && (
                        <section>
                            <p className="text-lg font-semibold mb-4">Resume</p>
                            <div className="bg-gray-100 p-4 rounded-lg border border-gray-300">
                                <div className="flex items-center gap-2 mb-3">
                                    <FileText size={18} className="text-emerald-500" />
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-gray-700 truncate">{applicant.resume}</p>
                                        <p className="text-xs text-gray-500">PDF or Document File</p>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={viewResume}
                                        className="flex-1 btn btn-primary text-sm bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 px-3 py-1.5 font-medium"
                                    >
                                        View Resume
                                    </button>
                                    <button
                                        onClick={downloadResume}
                                        className="flex-1 btn btn-secondary text-sm bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 px-3 py-1.5 font-medium"
                                    >
                                        Download
                                    </button>
                                </div>
                            </div>
                        </section>
                    )}

                    {/* Application Status */}
                    <section>
                        <p className="text-lg font-semibold mb-4">Status</p>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="bg-gray-100 p-3 rounded-lg">
                                <p className="text-xs text-gray-500 mb-1">Application Status</p>
                                <p className="text-sm font-medium">{applicant?.applicantStatus || 'N/A'}</p>
                            </div>
                            <div className="bg-gray-100 p-3 rounded-lg">
                                <p className="text-xs text-gray-500 mb-1">Interview Status</p>
                                <p className="text-sm font-medium">{applicant?.interviewStatus || 'N/A'}</p>
                            </div>
                        </div>
                    </section>

                    {/* Action Button */}
                    <div className="flex gap-2 pt-4">
                        <button
                            className="flex-1 btn btn-ghost rounded-lg"
                            onClick={onClose}
                        >
                            Close
                        </button>
                    </div>
                </div>
            </Modal>
        </ModalBackground>
    );
}

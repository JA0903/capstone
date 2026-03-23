import { Modal, ModalBackground, ModalHeader } from "./ui/ui-modal";
import { Calendar, FileText, Award, Building2, ExternalLink } from "lucide-react";

export default function ApplicationDetailsModal({ application, onClose = () => { } }) {

    if (!application) return null;

    const viewResume = () => {
        if (application?.resume) {
            window.open(`http://localhost:8001/uploads/resumes/${application.resume}`, '_blank');
        }
    };

    const downloadResume = () => {
        if (application?.resume) {
            const link = document.createElement('a');
            link.href = `http://localhost:8001/uploads/resumes/${application.resume}`;
            link.download = application.resume;
            document.body.appendChild(link);
            link.click();
            link.parentElement.removeChild(link);
        }
    };

    return (
        <ModalBackground>
            <Modal maxWidth={500}>
                <ModalHeader
                    icon={FileText}
                    title="Application Details"
                    subTitle={application?.job?.jobTitle}
                    onClose={onClose}
                />

                <div className="grid grid-cols-1 gap-4 mt-6">

                    {/* Job Information */}
                    <section>
                        <p className="text-lg font-semibold mb-3">Job Information</p>
                        <div className="space-y-2">
                            <div className="flex items-start gap-3">
                                <Award size={18} className="text-emerald-500 mt-0.5 shrink-0" />
                                <div>
                                    <p className="text-xs text-gray-500">Job Title</p>
                                    <p className="text-sm font-medium">{application?.job?.jobTitle || 'N/A'}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <Building2 size={18} className="text-emerald-500 mt-0.5 shrink-0" />
                                <div>
                                    <p className="text-xs text-gray-500">Company</p>
                                    <p className="text-sm font-medium">{application?.job?.company?.companyName || 'N/A'}</p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Status Information */}
                    <section>
                        <p className="text-lg font-semibold mb-3">Application Status</p>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="bg-gray-100 p-3 rounded-lg">
                                <p className="text-xs text-gray-500 mb-1">Current Status</p>
                                <div className="flex items-center gap-2">
                                    <div className="h-2 w-2 rounded-full bg-emerald-500"></div>
                                    <p className="text-sm font-medium">{application?.applicantStatus || 'N/A'}</p>
                                </div>
                            </div>
                            <div className="bg-gray-100 p-3 rounded-lg">
                                <p className="text-xs text-gray-500 mb-1">Applied Date</p>
                                <p className="text-sm font-medium">{new Date(application?.createdAt).toLocaleDateString()}</p>
                            </div>
                        </div>
                    </section>

                    {/* Interview Status */}
                    {application?.interviewStatus && (
                        <section>
                            <p className="text-lg font-semibold mb-3">Interview Status</p>
                            <div className="bg-blue-50 border border-blue-200 p-3 rounded-lg">
                                <p className="text-xs text-gray-500 mb-1">Interview Result</p>
                                <p className="text-sm font-medium text-blue-600">{application?.interviewStatus}</p>
                                {application?.interviewAt && (
                                    <p className="text-xs text-gray-500 mt-2">
                                        Scheduled: {new Date(application.interviewAt).toLocaleString()}
                                    </p>
                                )}
                            </div>
                        </section>
                    )}

                    {/* Orientation Status */}
                    {application?.orientationStatus && (
                        <section>
                            <p className="text-lg font-semibold mb-3">Orientation Status</p>
                            <div className="bg-green-50 border border-green-200 p-3 rounded-lg">
                                <p className="text-xs text-gray-500 mb-1">Orientation Attendance</p>
                                <p className="text-sm font-medium text-green-600">{application?.orientationStatus}</p>
                            </div>
                        </section>
                    )}

                    {/* Optional Links */}
                    {(application?.linkedIn || application?.portfolio) && (
                        <section>
                            <p className="text-lg font-semibold mb-3">Links</p>
                            <div className="space-y-2">
                                {application?.linkedIn && (
                                    <a href={application.linkedIn} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-emerald-500 hover:underline text-sm">
                                        <ExternalLink size={16} />
                                        LinkedIn Profile
                                    </a>
                                )}
                                {application?.portfolio && (
                                    <a href={application.portfolio} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-emerald-500 hover:underline text-sm">
                                        <ExternalLink size={16} />
                                        Portfolio
                                    </a>
                                )}
                            </div>
                        </section>
                    )}

                    {/* Resume */}
                    {application?.resume && (
                        <section>
                            <p className="text-lg font-semibold mb-3">Resume</p>
                            <div className="bg-gray-100 p-4 rounded-lg border border-gray-300">
                                <div className="flex items-center gap-2 mb-3">
                                    <FileText size={18} className="text-emerald-500" />
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-gray-700 truncate">{application.resume}</p>
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

                    {/* Action Button */}
                    <div className="pt-4">
                        <button
                            className="w-full btn btn-ghost rounded-lg"
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

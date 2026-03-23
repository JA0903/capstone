import { fetchAllInterviewsService, fetchApplicantPipelineService, fetchApplicantStatusHistoryService, fetchApplicantTotalService, fetchInterviewTotalService, fetchOneInterviewsService, interviewResultService, isRejectedService, moveApplicantService, RescheduleInterviewService, scheduleInterviewService, fetchAllApplicantsService } from "../services/applicantsServices.js";

// FETCH APPLICANTS PIPELINE
export const fetchApplicantPipelineControllter = async (req, res) => {
    try {
        const admin = req.admin;
        const result = await fetchApplicantPipelineService(admin.id);

        return res.json(result);

    } catch (error) {
        console.error(error);

        return res.json({
            success: false,
            message: error.message
        });
    }
}

// MOVE APPLICANT
export const moveApplicantController = async (req, res) => {
    try {
        const { applicantId } = req.params;
        const { applicantStatus } = req.body;
        const result = await moveApplicantService(applicantId, applicantStatus);

        if (result.success) {
            // Get applicant and job details for notification
            const { Applicants, Jobs, Users } = await import('../models/index.js');
            const applicant = await Applicants.findByPk(applicantId, {
                include: [
                    { model: Jobs, as: 'job', attributes: ['jobTitle'] },
                    { model: Users, attributes: ['id'] }
                ]
            });

            if (applicant && globalThis.io) {
                // Emit to admin for real-time update
                globalThis.io.emit('applicant-updated', {
                    applicantId: applicant.id,
                    fullname: applicant.fullname,
                    jobTitle: applicant.job?.jobTitle,
                    applicantStatus: applicantStatus,
                    timestamp: new Date()
                });

                // Notify the client/applicant about status change
                if (applicant.user?.id) {
                    globalThis.io.emit('application-status-changed', {
                        applicantId: applicant.id,
                        applicantName: applicant.fullname,
                        jobTitle: applicant.job?.jobTitle,
                        applicantStatus: applicantStatus,
                        message: `Your application status has been moved to ${applicantStatus}`,
                        timestamp: new Date()
                    });
                }

                if (applicantStatus === 'Hired') {
                    // Notify admin that applicant has been hired
                    globalThis.io.emit('applicant-hired', {
                        applicantId: applicant.id,
                        fullname: applicant.fullname,
                        jobTitle: applicant.job?.jobTitle,
                        timestamp: new Date()
                    });
                }
            }
        }

        return res.json(result);

    } catch (error) {
        console.error(error);

        return res.json({
            success: false,
            message: error.message
        });
    }
}

// IS REJECTED
export const isRejectedController = async (req, res) => {
    try {
        const { applicantId } = req.params;
        const { isRejected } = req.body;
        const result = await isRejectedService(applicantId, isRejected);

        if (result.success && result.applicant.isRejected === 'Yes') {
            // Emit rejection notification to the user
            if (globalThis.io) {
                globalThis.io.emit('applicant-rejected', {
                    userId: result.applicant.userId,
                    applicantName: result.applicant.fullname,
                    jobTitle: result.applicant.jobTitle || 'Unknown Job',
                    timestamp: new Date()
                });
            }
        }

        return res.json(result);

    } catch (error) {
        console.error(error);

        return res.json({
            success: false,
            message: error.message
        });
    }
}

// FETCH APPLICANT STATUS HISTORY
export const fetchApplicantStatusHistoryController = async (req, res) => {
    try {
        const { applicantId } = req.params;
        const result = await fetchApplicantStatusHistoryService(applicantId);

        return res.json(result);

    } catch (error) {
        console.error(error);

        return res.json({
            success: false,
            message: error.message
        });
    }
}

// FETCH ALL INTERVIEWS
export const fetchAllInterviewsController = async (req, res) => {
    try {
        const { interviewStatus } = req.query;
        const result = await fetchAllInterviewsService(interviewStatus);

        return res.json(result);

    } catch (error) {
        console.error(error);

        return res.json({
            success: false,
            message: error.message
        });
    }
}

// FETCH ONE INTERVIEW
export const fetchOneInterviewsController = async (req, res) => {
    try {
        const { applicantId } = req.params;
        const result = await fetchOneInterviewsService(applicantId);

        return res.json(result);

    } catch (error) {
        console.error(error);

        return res.json({
            success: false,
            message: error.message
        });
    }
}

// RESCHEDULE INTERVIEW
export const RescheduleInterviewController = async (req, res) => {
    try {
        const { applicantId } = req.params;
        const {
            interviewAt,
            interviewMode,
            interviewLocation,
            interviewNotes,
        } = req.body;
        const result = await RescheduleInterviewService(
            applicantId,
            interviewAt,
            interviewMode,
            interviewLocation,
            interviewNotes,
        );

        if (result.success) {
            const { Applicants, Jobs } = await import('../models/index.js');
            const applicant = await Applicants.findByPk(applicantId, {
                include: [{ model: Jobs, as: 'job', attributes: ['jobTitle'] }]
            });

            if (applicant && globalThis.io) {
                globalThis.io.emit('interview-rescheduled', {
                    applicantId: applicant.id,
                    fullname: applicant.fullname,
                    jobTitle: applicant.job?.jobTitle,
                    interviewAt: interviewAt,
                    interviewMode: interviewMode,
                    timestamp: new Date()
                });
            }
        }

        return res.json(result);

    } catch (error) {
        console.error(error);

        return res.json({
            success: false,
            message: error.message
        });
    }
}

// SCHEDULE INTERVIEW
export const scheduleInterviewController = async (req, res) => {
    try {
        const { applicantId } = req.params;
        const {
            interviewAt,
            interviewMode,
            interviewLocation,
            interviewNotes
        } = req.body;
        const result = await scheduleInterviewService(
            applicantId,
            interviewAt,
            interviewMode,
            interviewLocation,
            interviewNotes
        );

        if (result.success) {
            const { Applicants, Jobs } = await import('../models/index.js');
            const applicant = await Applicants.findByPk(applicantId, {
                include: [{ model: Jobs, as: 'job', attributes: ['jobTitle'] }]
            });

            if (applicant && globalThis.io) {
                globalThis.io.emit('interview-scheduled', {
                    applicantId: applicant.id,
                    fullname: applicant.fullname,
                    jobTitle: applicant.job?.jobTitle,
                    interviewAt: interviewAt,
                    interviewMode: interviewMode,
                    timestamp: new Date()
                });
            }
        }

        return res.json(result);

    } catch (error) {
        console.error(error);

        return res.json({
            success: false,
            message: error.message
        });
    }
}

// INTERVIEW RESULT
export const interviewResultController = async (req, res) => {
    try {
        const { applicantId } = req.params;
        const { interviewStatus } = req.body;
        const result = await interviewResultService(applicantId, interviewStatus);

        return res.json(result);

    } catch (error) {
        console.error(error);

        return res.json({
            success: false,
            message: error.message
        });
    }
}

// FETCH APPLICANT TOTALS
export const fetchApplicantTotalController = async (req, res) => {
    try {

        const admin = req.admin;
        const result = await fetchApplicantTotalService(admin.id);

        return res.json(result);

    } catch (error) {
        console.error(error);

        return res.json({
            success: false,
            message: error.message
        });
    }
}

// FETCH INTERVIEW TOTALS
export const fetchInterviewTotalController = async (req, res) => {
    try {

        const admin = req.admin;
        const result = await fetchInterviewTotalService(admin.id);

        return res.json(result);

    } catch (error) {
        console.error(error);

        return res.json({
            success: false,
            message: error.message
        });
    }
}

// FETCH ALL APPLICANTS (FOR GRAPHS/CHARTS)
export const fetchAllApplicantsController = async (req, res) => {
    try {
        const result = await fetchAllApplicantsService();

        return res.json(result);

    } catch (error) {
        console.error(error);

        return res.json({
            success: false,
            message: error.message
        });
    }
}

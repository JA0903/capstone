import { blacklistService, fetchAllRejectedAndBlacklistedService, fetchBlacklistReasonService, fetchRejectedTotalService } from "../services/rejectedBlacklistedServices.js";

// FETCH ALL REJECTED AND BLACKLISTED
export const fetchAllRejectedAndBlacklistedController = async (req, res) => {
    try {
        const { search } = req.query;
        const result = await fetchAllRejectedAndBlacklistedService(search);

        return res.json(result);

    } catch (error) {
        console.error(error);

        return res.json({
            success: false,
            message: error.message
        });
    }
}

// FETCH BLACKLIST REASON
export const fetchBlacklistReasonController = async (req, res) => {
    try {
        const { applicantId } = req.params;

        const result = await fetchBlacklistReasonService(applicantId);

        return res.json(result);

    } catch (error) {
        console.error(error);

        return res.json({
            success: false,
            message: error.message
        });
    }
}

// BLACKLIST
export const blacklistController = async (req, res) => {
    try {
        const { applicantId } = req.params;
        const { blacklistedReason } = req.body;

        const result = await blacklistService(applicantId, blacklistedReason);

        if (result.success) {
            const { Applicants, Jobs } = await import('../models/index.js');
            const applicant = await Applicants.findByPk(applicantId, {
                include: [{ model: Jobs, as: 'job', attributes: ['jobTitle'] }]
            });

            if (applicant && globalThis.io) {
                globalThis.io.emit('applicant-blacklisted', {
                    applicantId: applicant.id,
                    fullname: applicant.fullname,
                    jobTitle: applicant.job?.jobTitle,
                    reason: blacklistedReason,
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

// FETCH REJECTED TOTALS
export const fetchRejectedTotalController = async (req, res) => {
    try {
        const result = await fetchRejectedTotalService();

        return res.json(result);

    } catch (error) {
        console.error(error);

        return res.json({
            success: false,
            message: error.message
        });
    }
}
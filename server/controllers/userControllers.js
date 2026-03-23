import { applyUserService, fetchUserProfileService, recentApplicantionService, userLoginService, userRegistrationService, userUpdateService, updateResumeService } from "../services/userServices.js";
import { cookieOptions } from "../utils/cookie.js";

// REGISTER USER 
export const userRegistrationController = async (req, res) => {
    try {
        const { fullname, email, password, confirmPassword } = req.body;
        const result = await userRegistrationService(fullname, email, password, confirmPassword);

        return res.json(result);

    } catch (error) {
        console.error(error);

        return res.json({
            success: false,
            message: error.message
        });
    }
}

// LOGIN USER
export const userLoginController = async (req, res) => {
    try {
        const { email, password } = req.body;
        const result = await userLoginService(email, password);

        if (!result.success) {
            return res.json(result)
        }

        res.cookie('userToken', result.token, cookieOptions);

        return res.json({
            success: true,
            message: "Login successful"
        });

    } catch (error) {
        console.error(error);

        return res.json({
            success: false,
            message: error.message
        });
    }
}

// FETCH USER
export const fetchUserController = async (req, res) => {
    try {
        const user = req.user;
        if (!user) {
            return res.json({
                success: false,
                user: null
            });
        }

        return res.json({
            success: true,
            user
        });

    } catch (error) {
        console.error(error);
        return res.json({
            success: false,
            user: null,
            message: error.message
        });
    }
};

// LOGOUT USER
export const logoutUserController = (req, res) => {
    res.clearCookie('userToken', cookieOptions);
    return res.json({ success: true, message: 'Logged out successfully' });
};

// UPDATE USER PROFILE
export const userUpdateController = async (req, res) => {
    try {
        const user = req.user;
        const {
            fullname,
            phone
        } = req.body;

        const result = await userUpdateService(
            user.id,
            fullname,
            phone
        );

        return res.json(result);

    } catch (error) {
        console.error(error);
        return res.json({
            success: false,
            message: error.message
        });
    }
}

// FETCH USER PROFILE
export const fetchUserProfileController = async (req, res) => {
    try {
        const user = req.user;
        const result = await fetchUserProfileService(user.id);

        return res.json(result);

    } catch (error) {
        console.error(error);
        return res.json({
            success: false,
            message: error.message
        });
    }
}

// UPDATE USER PROFILE
export const applyUserController = async (req, res) => {
    try {
        const user = req.user;
        const { jobId } = req.params;
        const resume = req.file;
        const {
            fullname,
            phone,
            linkedIn,
            portfolio
        } = req.body;

        // Validate file upload
        if (!resume) {
            return res.status(400).json({
                success: false,
                message: 'Resume file is required. Please upload a PDF or DOCX file.'
            });
        }

        const result = await applyUserService(
            user.id,
            jobId,
            fullname,
            phone,
            linkedIn,
            portfolio,
            resume
        );

        if (result.success) {
            // Get job details for notification
            const { Jobs } = await import('../models/index.js');
            const job = await Jobs.findByPk(jobId, { attributes: ['jobTitle'] });

            if (job && globalThis.io) {
                globalThis.io.emit('new-applicant', {
                    applicantName: fullname,
                    jobTitle: job.jobTitle,
                    timestamp: new Date()
                });
            }
        }

        return res.json(result);

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: error.message || 'An error occurred during application submission'
        });
    }
}

// RECENT APPLICATIONS
export const recentApplicantionController = async (req, res) => {
    try {
        const user = req.user;
        const result = await recentApplicantionService(user.id);

        return res.json(result);

    } catch (error) {
        console.error(error);
        return res.json({
            success: false,
            message: error.message
        });
    }
}

// UPDATE RESUME
export const updateResumeController = async (req, res) => {
    try {
        const user = req.user;
        const resume = req.file;

        // Validate file upload
        if (!resume) {
            return res.status(400).json({
                success: false,
                message: 'Resume file is required. Please upload a PDF or DOCX file.'
            });
        }

        const result = await updateResumeService(user.id, resume);

        return res.json(result);

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: error.message || 'An error occurred while updating resume'
        });
    }
}
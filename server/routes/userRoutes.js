import express from 'express';
import { applyUserController, fetchUserController, fetchUserProfileController, logoutUserController, recentApplicantionController, userLoginController, userRegistrationController, userUpdateController, updateResumeController } from '../controllers/userControllers.js';
import { authenticateUserJWT } from '../middleware/auth.js';
import { upload, handleUploadError } from '../middleware/uploads.js';

const userRouter = express.Router();

// REGISTER USER 
userRouter.post('/register', userRegistrationController);

// LOGIN USER 
userRouter.post('/login', userLoginController);

// FETCH USER
userRouter.get('/fetch', authenticateUserJWT, fetchUserController);

// LOGOUT USER
userRouter.get('/logout', authenticateUserJWT, logoutUserController);

// UPDATE USER PROFILE
userRouter.put('/profile/update', authenticateUserJWT, userUpdateController);

// READ PROFILE
userRouter.get('/profile/fetch', authenticateUserJWT, fetchUserProfileController);

// READ PROFILE
userRouter.post('/apply/:jobId', authenticateUserJWT, upload.single('resume'), handleUploadError, applyUserController);

// UPDATE RESUME
userRouter.put('/profile/resume/update', authenticateUserJWT, upload.single('resume'), handleUploadError, updateResumeController);

// RECENT APPLICATIONS
userRouter.get('/recentApplications', authenticateUserJWT, recentApplicantionController);

export default userRouter;
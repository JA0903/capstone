import express from 'express';
import { createJobController, deleteJobController, editJobController, editJobStatusController, fetchJobTotalController, getSavedJobsController, jobPostingController, readAllJobController, readOneJobController, saveJobController, unsaveJobController } from '../controllers/jobControllers.js';
import { authenticateAdminJWT, authenticateUserJWT } from '../middleware/auth.js';

const jobRouter = express.Router();

// CREATE JOB 
jobRouter.post('/create', authenticateAdminJWT, createJobController);

// JOB POSTING
jobRouter.get('/jobposting', jobPostingController);

// READ ONE JOB
jobRouter.get('/read/:jobId', readOneJobController);

// READ ALL JOB
jobRouter.get('/readAll', authenticateAdminJWT, readAllJobController);

// DELETE JOB
jobRouter.delete('/delete/:jobId', authenticateAdminJWT, deleteJobController);

// EDIT JOB
jobRouter.put('/edit/:jobId', authenticateAdminJWT, editJobController);

// EDIT JOB STATUS
jobRouter.put('/status/edit/:jobId', authenticateAdminJWT, editJobStatusController);

// FETCH JOB TOTALS
jobRouter.get('/totals', authenticateAdminJWT, fetchJobTotalController);

// SAVE JOB
jobRouter.post('/save', authenticateUserJWT, saveJobController);

// UNSAVE JOB
jobRouter.delete('/unsave/:jobId', authenticateUserJWT, unsaveJobController);

// GET SAVED JOBS
jobRouter.get('/saved', authenticateUserJWT, getSavedJobsController);

export default jobRouter;
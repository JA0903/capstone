import express from 'express';
import { sequelize } from '../config/sequelize.js';
import { generateHiringReport, generateReportBuffer } from '../services/reportService.js';
import { authenticateAdminJWT } from '../middleware/auth.js';

const router = express.Router();

// Generate DOCX Report
router.post('/export-docx', authenticateAdminJWT, async (req, res) => {
    try {
        console.log('📝 Generating report...');
        const { companyId } = req.body;

        // Fetch all hiring metrics
        let metricsQuery = `
            SELECT 
                COUNT(*) as totalApplications,
                SUM(CASE WHEN a.applicantStatus = 'Hired' THEN 1 ELSE 0 END) as totalHires,
                SUM(CASE WHEN a.interviewStatus = 'Pending' THEN 1 ELSE 0 END) as pendingInterviews,
                SUM(CASE WHEN a.interviewStatus = 'Passed' THEN 1 ELSE 0 END) as passedInterviews,
                SUM(CASE WHEN a.interviewStatus = 'Failed' THEN 1 ELSE 0 END) as failedInterviews
            FROM applicants a
        `;

        if (companyId) {
            metricsQuery += ` WHERE a.jobId IN (SELECT id FROM jobs WHERE companyId = ?)`;
        }

        const metricsResult = await sequelize.query(metricsQuery, {
            replacements: companyId ? [companyId] : [],
            type: sequelize.QueryTypes.SELECT
        });

        const metrics = metricsResult[0] || {
            totalApplications: 0,
            totalHires: 0,
            pendingInterviews: 0,
            passedInterviews: 0,
            failedInterviews: 0
        };

        console.log('✅ Metrics fetched:', metrics);

        // Fetch company name
        let companyName = 'All Companies';
        if (companyId) {
            const companyResult = await sequelize.query(
                'SELECT companyName FROM companies WHERE id = ?',
                { replacements: [companyId], type: sequelize.QueryTypes.SELECT }
            );
            if (companyResult.length > 0) {
                companyName = companyResult[0].companyName;
            }
        }

        console.log('✅ Company name:', companyName);

        // Fetch hired applicants (simplified - using only applicant data)
        let hiredQuery = `
            SELECT 
                a.fullname, 
                'Hired Position' as jobTitle,
                'Company' as companyName, 
                DATE_FORMAT(a.updatedAt, '%Y-%m-%d') as hireDate
            FROM applicants a
            WHERE a.applicantStatus = 'Hired'
            ORDER BY a.updatedAt DESC
            LIMIT 50
        `;

        const hiredApplicants = await sequelize.query(hiredQuery, {
            type: sequelize.QueryTypes.SELECT
        });

        console.log('✅ Hired applicants fetched:', hiredApplicants.length);

        // Fetch status distribution
        const statusQuery = `
            SELECT applicantStatus as status, COUNT(*) as count
            FROM applicants
            WHERE applicantStatus IS NOT NULL
            GROUP BY applicantStatus
        `;

        const statusDistribution = await sequelize.query(statusQuery, {
            type: sequelize.QueryTypes.SELECT
        });

        const applicantsByStatus = {};
        statusDistribution.forEach(row => {
            applicantsByStatus[row.status] = row.count;
        });

        console.log('✅ Status distribution:', applicantsByStatus);

        // Prepare report data
        const reportData = {
            companyName: companyName,
            totalHires: metrics.totalHires || 0,
            totalApplications: metrics.totalApplications || 0,
            pendingInterviews: metrics.pendingInterviews || 0,
            passedInterviews: metrics.passedInterviews || 0,
            failedInterviews: metrics.failedInterviews || 0,
            hiredApplicants: hiredApplicants || [],
            applicantsByStatus: applicantsByStatus,
            generatedDate: new Date().toLocaleDateString()
        };

        console.log('📊 Report data prepared');

        // Generate DOCX
        const doc = await generateHiringReport(reportData);
        const buffer = await generateReportBuffer(doc);

        console.log('✅ DOCX generated, size:', buffer.length);

        // Send file
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
        res.setHeader('Content-Disposition', `attachment; filename="hiring_report_${Date.now()}.docx"`);
        res.send(buffer);

        console.log('✅ Report sent successfully');

        // Emit real-time event
        if (globalThis.io) {
            globalThis.io.emit('report-generated', {
                admin: req.admin?.id,
                company: companyId || 'All',
                timestamp: new Date()
            });
        }

    } catch (error) {
        console.error('❌ Error generating report:', error);
        console.error('Error stack:', error.stack);
        
        // Make sure we're sending JSON, not HTML
        res.status(500);
        res.setHeader('Content-Type', 'application/json');
        res.json({
            success: false,
            message: 'Failed to generate report: ' + error.message,
            error: error.message
        });
    }
});

// Get Report Data (JSON format for preview)
router.get('/data', authenticateAdminJWT, async (req, res) => {
    try {
        const { companyId } = req.query;

        let query = `
            SELECT 
                COUNT(*) as totalApplications,
                SUM(CASE WHEN applicantStatus = 'Hired' THEN 1 ELSE 0 END) as totalHires,
                SUM(CASE WHEN interviewStatus = 'Pending' THEN 1 ELSE 0 END) as pendingInterviews
            FROM applicants
        `;

        if (companyId) {
            query += ` WHERE jobId IN (SELECT id FROM jobs WHERE companyId = ?)`;
        }

        const result = await sequelize.query(query, {
            replacements: companyId ? [companyId] : [],
            type: sequelize.QueryTypes.SELECT
        });

        res.json({
            success: true,
            data: result
        });
    } catch (error) {
        console.error('Error fetching report data:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch report data'
        });
    }
});

export default router;

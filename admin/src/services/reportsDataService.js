import axios from 'axios';

const API_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8001';

// Fetch comprehensive report data connected to database
export const fetchReportMetrics = async (companyId = null, selectedMonth = null) => {
    try {
        // Fetch all applicants and jobs in parallel
        const [applicantsRes, jobsRes, companiesRes] = await Promise.all([
            axios.get(`${API_URL}/api/applicants/all`, { withCredentials: true }),
            axios.get(`${API_URL}/api/job/readAll`, { withCredentials: true }),
            axios.get(`${API_URL}/api/company/fetchAll`, { withCredentials: true })
        ]);

        if (!applicantsRes.data.success || !jobsRes.data.jobs || !companiesRes.data.companies) {
            throw new Error('Failed to fetch report data');
        }

        let applicants = applicantsRes.data.applicants || [];
        const jobs = jobsRes.data.jobs || [];
        const companies = companiesRes.data.companies || [];

        // Filter by company if specified
        if (companyId) {
            const companyJobIds = jobs
                .filter(job => job.company?.id == companyId)
                .map(job => job.id);
            applicants = applicants.filter(app => companyJobIds.includes(app.job?.id));
        }

        // Filter by month if specified (format: YYYY-MM)
        if (selectedMonth) {
            applicants = applicants.filter(app => {
                const createdDate = new Date(app.createdAt);
                const appMonth = createdDate.toISOString().slice(0, 7); // Format: YYYY-MM
                return appMonth === selectedMonth;
            });
        }

        // Calculate metrics
        const totalApplications = applicants.length;
        const totalHires = applicants.filter(app => app.applicantStatus === 'Hired').length;
        const totalRejected = applicants.filter(app => app.isRejected === 'Yes').length;
        const totalInterviews = applicants.filter(app => 
            app.interviewStatus === 'Pending' || app.interviewStatus === 'Passed'
        ).length;
        const activeCompanies = new Set(applicants.map(app => app.job?.companyId)).size || companies.length;
        
        // Calculate attrition rate (rejected / total applicants)
        const attritionRate = totalApplications > 0 
            ? ((totalRejected / totalApplications) * 100).toFixed(1) 
            : 0;

        // Calculate conversion rate (hires / applications)
        const conversionRate = totalApplications > 0 
            ? ((totalHires / totalApplications) * 100).toFixed(1) 
            : 0;

        // Calculate interview success rate (hires / interviews)
        const interviewSuccessRate = totalInterviews > 0 
            ? ((totalHires / totalInterviews) * 100).toFixed(1) 
            : 0;

        // Calculate average time to hire (days between application and hire)
        let avgTimeToHire = 0;
        const hiredApplicants = applicants.filter(app => app.applicantStatus === 'Hired');
        if (hiredApplicants.length > 0) {
            const totalDays = hiredApplicants.reduce((sum, app) => {
                const createdDate = new Date(app.createdAt);
                const today = new Date();
                const days = Math.floor((today - createdDate) / (1000 * 60 * 60 * 24));
                return sum + days;
            }, 0);
            avgTimeToHire = Math.round(totalDays / hiredApplicants.length);
        }

        return {
            success: true,
            metrics: {
                totalApplications,
                totalHires,
                totalRejected,
                activeCompanies,
                attritionRate: parseFloat(attritionRate),
                conversionRate: parseFloat(conversionRate),
                interviewSuccessRate: parseFloat(interviewSuccessRate),
                avgTimeToHire,
                applicants,
                jobs,
                companies
            }
        };
    } catch (error) {
        console.error('Error fetching report metrics:', error);
        return {
            success: false,
            message: error.message,
            metrics: {
                totalApplications: 0,
                totalHires: 0,
                totalRejected: 0,
                activeCompanies: 0,
                attritionRate: 0,
                conversionRate: 0,
                interviewSuccessRate: 0,
                avgTimeToHire: 0,
                applicants: [],
                jobs: [],
                companies: []
            }
        };
    }
};

// Fetch jobs by company/industry
export const fetchJobsByIndustry = async () => {
    try {
        const [jobsRes, companiesRes] = await Promise.all([
            axios.get(`${API_URL}/api/job/readAll`, { withCredentials: true }),
            axios.get(`${API_URL}/api/company/fetchAll`, { withCredentials: true })
        ]);

        const jobs = jobsRes.data.jobs || [];
        const companies = companiesRes.data.companies || [];

        // Count jobs by company
        const jobsByCompany = {};
        jobs.forEach(job => {
            const companyName = job.company?.companyName || 'Unknown';
            jobsByCompany[companyName] = (jobsByCompany[companyName] || 0) + 1;
        });

        const chartData = Object.entries(jobsByCompany)
            .map(([company, activeJobs]) => ({
                industry: company,
                activeJobs
            }))
            .sort((a, b) => b.activeJobs - a.activeJobs)
            .slice(0, 10);

        return {
            success: true,
            data: chartData
        };
    } catch (error) {
        console.error('Error fetching jobs by industry:', error);
        return {
            success: false,
            message: error.message,
            data: []
        };
    }
};

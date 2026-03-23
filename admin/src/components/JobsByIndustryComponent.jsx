import {
    ResponsiveContainer,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Bar,
    Legend,
    BarChart

} from 'recharts';
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function JobsByIndustryComponent() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchJobsByCompany = async () => {
            try {
                setLoading(true);
                setError(null);
                const API_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8001';
                
                const [jobsRes, companiesRes] = await Promise.all([
                    axios.get(`${API_URL}/api/job/readAll`, { withCredentials: true }),
                    axios.get(`${API_URL}/api/company/fetchAll`, { withCredentials: true })
                ]);

                const jobs = jobsRes.data.jobs || [];
                const companies = companiesRes.data.companies || [];

                console.log('Jobs fetched:', jobs.length);
                console.log('Companies fetched:', companies.length);

                if (!companies || companies.length === 0) {
                    setError('No companies available');
                    setData([]);
                    setLoading(false);
                    return;
                }

                // If no jobs, that's ok - just show companies with 0 jobs
                if (!jobs || jobs.length === 0) {
                    console.warn('No jobs found in database');
                }

                // Count jobs per company (all jobs)
                const jobsByCompany = {};
                companies.forEach(company => {
                    const jobCount = jobs.filter(job => job.companyId === company.id).length;
                    if (jobCount > 0) {
                        jobsByCompany[company.companyName] = jobCount;
                    }
                });

                const chartData = Object.entries(jobsByCompany)
                    .map(([company, activeJobs]) => ({
                        industry: company,
                        activeJobs
                    }))
                    .sort((a, b) => b.activeJobs - a.activeJobs)
                    .slice(0, 10);

                if (chartData.length === 0) {
                    setData([]);
                    setLoading(false);
                    return;
                }

                setData(chartData);
            } catch (error) {
                console.error('Error fetching jobs by industry:', error);
                setError(error.message);
                setData([]);
            } finally {
                setLoading(false);
            }
        };

        fetchJobsByCompany();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full w-full">
                <span>Loading...</span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center h-full w-full">
                <span className="text-red-500">Error: {error}</span>
            </div>
        );
    }

    if (!data || data.length === 0) {
        return (
            <div className="flex items-center justify-center h-full w-full">
                <span className="text-gray-500">No data available</span>
            </div>
        );
    }

    return (
        <ResponsiveContainer width="100%" height="100%" >
            <BarChart data={data}>
                <YAxis />
                <XAxis dataKey="industry" />
                <CartesianGrid />

                <Tooltip />
                <Legend />

                <Bar
                    dataKey="activeJobs"
                    fill="#10B981"
                    name="Active Jobs"
                    radius={[8, 8, 0, 0]}
                />
            </BarChart>
        </ResponsiveContainer>
    )
}
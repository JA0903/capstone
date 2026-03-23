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

    useEffect(() => {
        const fetchJobsByCompany = async () => {
            try {
                const API_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8001';
                
                const [jobsRes, companiesRes] = await Promise.all([
                    axios.get(`${API_URL}/api/job/readAll`, { withCredentials: true }),
                    axios.get(`${API_URL}/api/company/fetchAll`, { withCredentials: true })
                ]);

                const jobs = jobsRes.data.jobs || [];
                const companies = companiesRes.data.companies || [];

                // Count jobs per company
                const jobsByCompany = {};
                companies.forEach(company => {
                    const jobCount = jobs.filter(job => job.companyId === company.id && job.status === 'open').length;
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

                setData(chartData);
            } catch (error) {
                console.error('Error fetching jobs by industry:', error);
                setData([]);
            } finally {
                setLoading(false);
            }
        };

        fetchJobsByCompany();
    }, []);

    if (loading) {
        return (
            <ResponsiveContainer width="100%" height="100%">
                <div className="flex items-center justify-center h-full">
                    <span>Loading...</span>
                </div>
            </ResponsiveContainer>
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
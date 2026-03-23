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
import { fetchAllApplicants } from '../services/applicants';
import { fetchAllSelectCompany } from '../services/companyServices';

export default function TopPerformingCompaniesComponent() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTopCompanies = async () => {
            try {
                setLoading(true);
                setError(null);
                const [applicantsRes, companiesRes] = await Promise.all([
                    fetchAllApplicants(),
                    fetchAllSelectCompany()
                ]);

                if (!applicantsRes.success) {
                    throw new Error(applicantsRes.message || 'Failed to fetch applicants');
                }

                if (!companiesRes.success) {
                    throw new Error(companiesRes.message || 'Failed to fetch companies');
                }

                const applicants = applicantsRes.applicants || [];
                const companies = companiesRes.companies || [];

                // Count hires and applications per company
                const companyStats = {};
                companies.forEach(company => {
                    companyStats[company.id] = {
                        company: company.companyName,
                        hires: 0,
                        applications: 0
                    };
                });

                applicants.forEach(app => {
                    const companyId = app.job?.companyId;
                    if (companyId && companyStats[companyId]) {
                        companyStats[companyId].applications++;
                        if (app.applicantStatus === 'Hired') {
                            companyStats[companyId].hires++;
                        }
                    }
                });

                const chartData = Object.values(companyStats)
                    .filter(stat => stat.hires > 0 || stat.applications > 0)
                    .sort((a, b) => (b.hires + b.applications) - (a.hires + a.applications))
                    .slice(0, 10);

                if (chartData.length === 0) {
                    throw new Error('No company data available');
                }

                setData(chartData);
            } catch (error) {
                console.error('Error fetching top companies:', error);
                setError(error.message);
                setData([]);
            } finally {
                setLoading(false);
            }
        };

        fetchTopCompanies();
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
            <BarChart data={data} layout="vertical">
                <XAxis type="number" />
                <YAxis dataKey="company" type="category" width={150} />
                <CartesianGrid />

                <Tooltip />
                <Legend />

                <Bar
                    dataKey="hires"
                    fill="#10B981"
                    name="Hires"
                    radius={[0, 8, 8, 0]}
                />
                <Bar
                    dataKey="applications"
                    fill="#34d399"
                    name="Applications"
                    radius={[0, 8, 8, 0]}
                />
            </BarChart>
        </ResponsiveContainer>
    )
}
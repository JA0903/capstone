import {
    AreaChart,
    Area,
    ResponsiveContainer,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend

} from 'recharts';
import { useEffect, useState } from 'react';
import { fetchAllApplicants } from '../services/applicants';

export default function HiringTrendsAnalysisComponent() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTrendData = async () => {
            try {
                setLoading(true);
                setError(null);
                const response = await fetchAllApplicants();

                if (!response.success) {
                    throw new Error(response.message || 'Failed to fetch data');
                }

                // Process applicants to group by month
                const applicants = response.applicants || [];
                const trendData = {};

                // Initialize last 6 months
                for (let i = 5; i >= 0; i--) {
                    const date = new Date();
                    date.setMonth(date.getMonth() - i);
                    const monthKey = date.toLocaleString('default', { month: 'short' });
                    trendData[monthKey] = { applications: 0, interviews: 0, hires: 0 };
                }

                // Count by status and approximate month
                applicants.forEach(app => {
                    const createdDate = new Date(app.createdAt);
                    const monthKey = createdDate.toLocaleString('default', { month: 'short' });
                    
                    if (trendData[monthKey]) {
                        trendData[monthKey].applications++;
                        if (app.interviewStatus === 'Pending' || app.interviewStatus === 'Passed') {
                            trendData[monthKey].interviews++;
                        }
                        if (app.applicantStatus === 'Hired') {
                            trendData[monthKey].hires++;
                        }
                    }
                });

                const chartData = Object.entries(trendData).map(([month, counts]) => ({
                    month,
                    ...counts
                }));

                setData(chartData);
            } catch (error) {
                console.error('Error fetching hiring trends:', error);
                setError(error.message);
                setData([]);
            } finally {
                setLoading(false);
            }
        };

        fetchTrendData();
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
            <AreaChart data={data}>
                <YAxis />
                <XAxis dataKey="month" />
                <CartesianGrid />

                <Tooltip />
                <Legend />

                <Area
                    dataKey="applications"
                    name='Applications'
                    fill="#10B981"
                />
                <Area
                    dataKey="interviews"
                    name='Interviews'
                    fill="#3B82F6"
                />
                <Area
                    dataKey="hires"
                    name='Hires'
                    fill="#8B5CF6"
                />
            </AreaChart>
        </ResponsiveContainer>
    )
}
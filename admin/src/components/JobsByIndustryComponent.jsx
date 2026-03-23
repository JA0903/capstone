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
import { fetchJobsByIndustry } from '../services/reportsDataService';

export default function JobsByIndustryComponent() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchJobsByCompany = async () => {
            try {
                setLoading(true);
                setError(null);
                
                const result = await fetchJobsByIndustry();

                if (!result.success) {
                    throw new Error(result.message || 'Failed to fetch jobs');
                }

                if (!result.data || result.data.length === 0) {
                    console.warn('No jobs found in database');
                    setData([]);
                    setLoading(false);
                    return;
                }

                setData(result.data);
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
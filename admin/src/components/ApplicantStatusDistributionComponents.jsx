import {
    ResponsiveContainer,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    PieChart,
    Pie,
    Cell,

} from 'recharts';
import { useEffect, useState } from 'react';
import { fetchApplicantsPipeline } from '../services/applicants';

export default function ApplicantStatusDistributionComponent() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);
                const response = await fetchApplicantsPipeline();
                
                if (!response.success) {
                    throw new Error(response.message || 'Failed to fetch data');
                }
                
                // Count applicants by status from pipeline data
                const statusCounts = {
                    'New': response.new?.length || 0,
                    'Interview': response.interview?.length || 0,
                    'Orientation': response.orientation?.length || 0,
                };

                const chartData = [
                    { name: 'New', value: statusCounts['New'], color: '#f59e0b' },
                    { name: 'Interview', value: statusCounts['Interview'], color: '#3b82f6' },
                    { name: 'Orientation', value: statusCounts['Orientation'], color: '#10b981' },
                ];

                setData(chartData);
            } catch (error) {
                console.error('Error fetching applicant status data:', error);
                setError(error.message);
                setData([]);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
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
            <PieChart data={data}>

                <Tooltip />

                <Pie
                    data={data}
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    fill="#8884d8"
                    dataKey="value"
                >
                    {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                </Pie>

            </PieChart>
        </ResponsiveContainer>
    )
}
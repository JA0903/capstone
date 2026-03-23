import {
    ResponsiveContainer,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    Line,
    LineChart

} from 'recharts';
import { useEffect, useState } from 'react';
import { fetchAllApplicants } from '../services/applicants';

export default function AttritionRateTrendComponent() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAttritionData = async () => {
            try {
                const response = await fetchAllApplicants();

                const applicants = response.applicants || [];
                const attritionData = {};

                // Initialize last 6 months
                for (let i = 5; i >= 0; i--) {
                    const date = new Date();
                    date.setMonth(date.getMonth() - i);
                    const monthKey = date.toLocaleString('default', { month: 'short' });
                    attritionData[monthKey] = { totalEmployees: 0, hired: 0, rejected: 0 };
                }

                // Process applicants
                applicants.forEach(app => {
                    const createdDate = new Date(app.createdAt);
                    const monthKey = createdDate.toLocaleString('default', { month: 'short' });
                    
                    if (attritionData[monthKey]) {
                        attritionData[monthKey].totalEmployees++;
                        if (app.applicantStatus === 'Hired') {
                            attritionData[monthKey].hired++;
                        } else if (app.isRejected === 'Yes') {
                            attritionData[monthKey].rejected++;
                        }
                    }
                });

                // Calculate attrition rates
                const chartData = Object.entries(attritionData).map(([month, counts]) => {
                    const attritionRate = counts.totalEmployees > 0 
                        ? ((counts.rejected / counts.totalEmployees) * 100).toFixed(1)
                        : 0;
                    
                    return {
                        month,
                        attritionRate: parseFloat(attritionRate),
                        employees: counts.totalEmployees
                    };
                });

                setData(chartData);
            } catch (error) {
                console.error('Error fetching attrition data:', error);
                setData([]);
            } finally {
                setLoading(false);
            }
        };

        fetchAttritionData();
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
            <LineChart data={data}>
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <XAxis dataKey="month" />
                <CartesianGrid />

                <Tooltip />
                <Legend />

                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="attritionRate"
                  fill="#10B981"
                  name="Attrition Rate %"
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="employees"
                  fill="#3B82F6"
                  name="Total Employees"
                />
            </LineChart>
        </ResponsiveContainer>
    )
}
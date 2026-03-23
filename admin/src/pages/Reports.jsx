import { Briefcase, Building2, FileText, TrendingDown, TrendingUp, Users, Loader } from "lucide-react";
import HiringTrendsAnalysisComponent from "../components/HiringTrendsAnalysisComponent";
import Sidemenu from "../components/Sidemenu";
import Topbar from "../components/topbar";
import JobsByIndustryComponent from "../components/JobsByIndustryComponent";
import AttritionRateTrendComponent from "../components/AttritionRateTrendComponent";
import ApplicantStatusDistributionComponent from "../components/ApplicantStatusDistributionComponents";
import TopPerformingCompaniesComponent from "../components/TopPerformingCompaniesComponents";
import { fetchAllSelectCompany } from "../services/companyServices";
import { exportReportToDocx } from "../services/reportsServices";
import { fetchReportMetrics } from "../services/reportsDataService";
import { useState, useEffect } from "react";
import Select from "../components/ui/Select";
import { toast } from "react-toastify";
import useSocket from "../hooks/useSocket";

export default function Reports() {

    const [company, setCompany] = useState('');
    const [selectCompanies, setSelectCompanies] = useState([]);
    const [isExporting, setIsExporting] = useState(false);
    const [metrics, setMetrics] = useState({
        totalApplications: 0,
        totalHires: 0,
        activeCompanies: 0,
        attritionRate: 0,
        conversionRate: 0,
        interviewSuccessRate: 0,
        avgTimeToHire: 0
    });
    const [metricsLoading, setMetricsLoading] = useState(true);
    const { isConnected, notifications } = useSocket();

    useEffect(() => {
        const runFetchAllCompany = async () => {
            const { success, message, companies } = await fetchAllSelectCompany();

            if (success) {
                setSelectCompanies(companies);
            } else {
                console.error(message);
            }
        };
        runFetchAllCompany();
    }, [])

    useEffect(() => {
        const loadMetrics = async () => {
            try {
                setMetricsLoading(true);
                const result = await fetchReportMetrics(company || null);
                if (result.success) {
                    setMetrics(result.metrics);
                } else {
                    console.error('Failed to load metrics:', result.message);
                }
            } catch (error) {
                console.error('Error loading metrics:', error);
            } finally {
                setMetricsLoading(false);
            }
        };
        loadMetrics();
    }, [company])

    const handleExportDocx = async () => {
        setIsExporting(true);
        const result = await exportReportToDocx(company || null);
        
        if (result.success) {
            toast.success('Report exported successfully!');
        } else {
            toast.error(result.message);
        }
        
        setIsExporting(false);
    }

    return (
        <div className="flex h-screen max-w-screen">
            <Sidemenu />
            <div className="grow max-h-screen flex flex-col overflow-auto">
                <Topbar />
                <div className="p-8 overflow-autos grow">

                    {/* Socket.IO Status Indicator */}
                    <div className="mb-4 flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
                        <span className="text-sm text-gray-600">
                            {isConnected ? 'Real-time updates connected' : 'Reconnecting...'}
                        </span>
                    </div>

                    {/* report header */}
                    <section className="flex items-center justify-between flex-wrap gap-4 mb-8">
                        <div>
                            <p className="text-2xl font-semibold">Reports & Analytics</p>
                            <p className="text-gray-500">Comprehensive insights and data analysis</p>
                        </div>
                        <div className="flex gap-4 flex-wrap">
                            <button
                                onClick={handleExportDocx}
                                disabled={isExporting}
                                className="grow btn btn-ghost border-gray-300 rounded-lg disabled:opacity-50"
                            >
                                {isExporting ? (
                                    <>
                                        <Loader size={16} className="animate-spin" />
                                        <p className="font-semibold text-sm">Exporting...</p>
                                    </>
                                ) : (
                                    <>
                                        <FileText size={16} />
                                        <p className="font-semibold text-sm cursor-pointer">Export Docx</p>
                                    </>
                                )}
                            </button>
                        </div>
                    </section>

                    <section className="flex items-center justify-between gap-4 border border-gray-300 p-4 rounded-xl mb-8 flex-wrap">
                        <div className="grow">
                            <p className="font-semibold">Report Filters</p>
                            <p className="text-gray-500">Select company and date range for detailed reports</p>
                        </div>
                        <div className="grow flex gap-4">
                            <Select
                                placeholder="All Companies"
                                options={selectCompanies?.map(company => ({ value: company.id, name: company.companyName }))}
                                value={company}
                                onChange={(e) => setCompany(e.target.value)}
                            />

                            <select
                                name="industry"
                                className="select grow"
                            >
                                <option value="30">Last 30 Days</option>
                                <option value="90">Last 90 Days</option>
                                <option value="180">Last 180 Days</option>
                                <option value="365">Last 365 Days</option>
                                <option value="All Time">All Time</option>
                            </select>
                        </div>
                    </section>

                    <section className="grid lg:grid-cols-4 gap-4 mb-8">
                        <div className="border border-gray-300 px-4 py-6 rounded-xl">
                            <div className="flex items-center justify-between mb-8">
                                <p className="font-semibold text-sm">Total Hires</p>
                                <Users size={16} className="text-emerald-500 shrink-0" />
                            </div>
                            <p className="font-bold text-2xl mb-2">{metrics.totalHires}</p>
                            <p className="flex gap-2 text-xs items-center"><TrendingUp size={12} className="text-emerald-500" />
                                <span className="text-emerald-500">Conversion: {metrics.conversionRate}%</span>
                            </p>
                        </div>
                        <div className="border border-gray-300 px-4 py-6 rounded-xl">
                            <div className="flex items-center justify-between mb-8">
                                <p className="font-semibold text-sm">Total Applications</p>
                                <Briefcase size={16} className="text-emerald-500 shrink-0" />
                            </div>
                            <p className="font-bold text-2xl">{metrics.totalApplications}</p>
                            <p className="flex gap-2 text-xs items-center"><TrendingUp size={12} className="text-emerald-500" />
                                <span className="text-emerald-500">+{metrics.conversionRate}%</span> conversion
                            </p>
                        </div>
                        <div className="border border-gray-300 px-4 py-6 rounded-xl">
                            <div className="flex items-center justify-between mb-8">
                                <p className="font-semibold text-sm">Active Companies</p>
                                <Building2 size={16} className="text-emerald-500 shrink-0" />
                            </div>
                            <p className="font-bold text-2xl">{metrics.activeCompanies}</p>
                            <p className="flex gap-2 text-xs items-center"><TrendingUp size={12} className="text-emerald-500" />
                                <span className="text-emerald-500">Hiring</span>
                            </p>
                        </div>
                        <div className="border border-gray-300 px-4 py-6 rounded-xl">
                            <div className="flex items-center justify-between mb-8">
                                <p className="font-semibold text-sm">Attrition Rate</p>
                                <TrendingDown size={16} className="text-emerald-500 shrink-0" />
                            </div>
                            <p className="font-bold text-2xl">{metrics.attritionRate}%</p>
                            <p className="flex gap-2 text-xs items-center"><TrendingDown size={12} className={metrics.attritionRate > 10 ? "text-red-500" : "text-emerald-500"} />
                                <span className={metrics.attritionRate > 10 ? "text-red-500" : "text-emerald-500"}>{metrics.attritionRate > 10 ? "Higher" : "Lower"} than avg</span>
                            </p>
                        </div>
                    </section>

                    <section className="grid lg:grid-cols-2 gap-4 mb-4">
                        <div className="flex flex-col border border-gray-300 h-100 p-4 rounded-xl">
                            <p className="font-semibold">Hiring Trends Analysis</p>
                            <p className="text-gray-500 mb-4">Applications, interviews, and hires over time</p>
                            <div className="grow">
                                <HiringTrendsAnalysisComponent />
                            </div>
                        </div>
                        <div className="flex flex-col border border-gray-300 h-100 p-4 rounded-xl">
                            <p className="font-semibold">Attrition Rate Trend</p>
                            <p className="text-gray-500 mb-4">Employee retention and attrition over time</p>
                            <div className="grow">
                                <AttritionRateTrendComponent />
                            </div>
                        </div>
                        <div className="flex flex-col border border-gray-300 h-100 p-4 rounded-xl">
                            <p className="font-semibold">Applicant Status Distribution</p>
                            <p className="text-gray-500 mb-4">Current status breakdown of all applicants</p>
                            <div className="grow">
                                <ApplicantStatusDistributionComponent />
                            </div>
                        </div>
                        <div className="flex flex-col border border-gray-300 h-100 p-4 rounded-xl">
                            <p className="font-semibold">Jobs by Industry</p>
                            <p className="text-gray-500 mb-4">Distribution of job postings across industries</p>
                            <div className="grow">
                                <JobsByIndustryComponent />
                            </div>
                        </div>
                    </section>
                    <div className="flex flex-col border border-gray-300 h-100 p-4 rounded-xl mb-8">
                        <p className="font-semibold">Top Performing Companies</p>
                        <p className="text-gray-500 mb-4">Companies with highest hiring activity</p>
                        <div className="grow">
                            <TopPerformingCompaniesComponent />
                        </div>
                    </div>

                    <section className="grid lg:grid-cols-3 gap-4">
                        <div className="border border-gray-300 p-4 rounded-xl">
                            <p className="font-semibold">Conversion Rate</p>
                            <p className="text-gray-500 mb-4">Applications to hires</p>
                            <p className="font-bold text-3xl text-emerald-500 mb-2">{metrics.conversionRate}%</p>
                            <p className="text-gray-500 mb-4">{metrics.totalHires} hires from {metrics.totalApplications} applications</p>
                        </div>
                        <div className="border border-gray-300 p-4 rounded-xl">
                            <p className="font-semibold">Avg. Time to Hire</p>
                            <p className="text-gray-500 mb-4">Average hiring duration</p>
                            <p className="font-bold text-3xl text-emerald-500 mb-2">{metrics.avgTimeToHire} days</p>
                            <p className="text-gray-500 mb-4">Based on {metrics.totalHires} recent hires</p>
                        </div>
                        <div className="border border-gray-300 p-4 rounded-xl">
                            <p className="font-semibold">Interview Success Rate</p>
                            <p className="text-gray-500 mb-4">Interviews resulting in hires</p>
                            <p className="font-bold text-3xl text-emerald-500 mb-2">{metrics.interviewSuccessRate}%</p>
                            <p className="text-gray-500 mb-4">Successfully moving to next stage</p>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    )
}
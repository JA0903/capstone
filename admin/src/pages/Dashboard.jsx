import AttritionRateTrendComponent from "../components/AttritionRateTrendComponent";
import HiringTrendsAnalysisComponent from "../components/HiringTrendsAnalysisComponent";
import Sidemenu from "../components/Sidemenu";
import Topbar from "../components/topbar";
import { Briefcase, Calendar, FileText, TrendingDown, Users } from 'lucide-react';
import { useEffect, useState } from "react";
import useSocket from "../hooks/useSocket";
import { fetchApplicantTotals } from "../services/applicants";
import { fetchInterviewTotals } from "../services/applicants";
import { fetchHiredTotals } from "../services/hiredServices";
import { fetchJobTotals } from "../services/jobServices";
import { fetchCompanyTotals } from "../services/companyServices";

export default function Dashboard() {

    const { socket } = useSocket();
    const [stats, setStats] = useState({
        totalJobs: 0,
        activeApplicants: 0,
        openPositions: 0,
        scheduledInterviews: 0,
        attritionRate: 0
    });

    const loadStats = async () => {
        try {
            const [jobsRes, applicantsRes, interviewsRes, hiredRes] = await Promise.all([
                fetchJobTotals(),
                fetchApplicantTotals(),
                fetchInterviewTotals(),
                fetchHiredTotals()
            ]);

            const totalJobs = jobsRes.totals?.totalJobs || 0;
            const activeApplicants = applicantsRes.totals?.totalApplicants || 0;
            const scheduledInterviews = interviewsRes.totals?.pendingInterviews || 0;
            const totalHired = hiredRes.totals?.totalHired || 0;
            
            // Get open positions from job totals
            const openPositions = jobsRes.totals?.openPositions || 0;
            
            // Calculate attrition rate (simple calculation: hired / active applicants)
            const attritionRate = activeApplicants > 0 ? ((totalHired / activeApplicants) * 100).toFixed(1) : 0;

            setStats({
                totalJobs,
                activeApplicants,
                openPositions,
                scheduledInterviews,
                attritionRate
            });
        } catch (error) {
            console.error('Error loading dashboard stats:', error);
        }
    };

    useEffect(() => {
        loadStats();
    }, []);

    // Real-time updates via Socket.IO
    useEffect(() => {
        if (!socket) return;

        const handleUpdate = () => {
            loadStats();
        };

        socket.on('job-posted', handleUpdate);
        socket.on('applicant-updated', handleUpdate);
        socket.on('interview-scheduled', handleUpdate);
        socket.on('applicant-hired', handleUpdate);

        return () => {
            socket.off('job-posted', handleUpdate);
            socket.off('applicant-updated', handleUpdate);
            socket.off('interview-scheduled', handleUpdate);
            socket.off('applicant-hired', handleUpdate);
        };
    }, [socket]);

    return (
        <div className="flex h-screen max-w-screen">
            <Sidemenu />
            <div className="grow max-h-screen flex flex-col overflow-auto">
                <Topbar />
                <div className="p-8 overflow-auto grow">

                    {/* Dashboard header */}
                    <section className="flex items-center justify-between flex-wrap gap-4 mb-8">
                        <div>
                            <p className="text-2xl font-semibold">Dashboard</p>
                            <p className="text-gray-500">Welcome back! Here's your overview</p>
                        </div>
                    </section>

                    <section className="grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-4 mb-8">
                        <div className="p-6 border border-gray-300 rounded-xl">
                            <div className="flex items-center justify-between mb-8">
                                <p className="font-semibold text-sm">Total Jobs</p>
                                <span className="bg-blue-500/10 text-blue-500 p-2 rounded-full">
                                    <Briefcase size={16} />
                                </span>
                            </div>
                            <p className="text-2xl font-bold">{stats.totalJobs}</p>
                        </div>

                        <div className="p-6 border border-gray-300 rounded-xl">
                            <div className="flex items-center justify-between mb-8">
                                <p className="font-semibold text-sm">Active Applicants</p>
                                <span className="bg-emerald-500/10 text-emerald-500 p-2 rounded-full">
                                    <Users size={16} />
                                </span>
                            </div>
                            <p className="text-2xl font-bold">{stats.activeApplicants}</p>
                        </div>

                        <div className="p-6 border border-gray-300 rounded-xl">
                            <div className="flex items-center justify-between mb-8">
                                <p className="font-semibold text-sm">Open Positions</p>
                                <span className="bg-orange-500/10 text-orange-500 p-2 rounded-full">
                                    <FileText size={16} />
                                </span>
                            </div>
                            <p className="text-2xl font-bold">{stats.openPositions}</p>
                        </div>

                        <div className="p-6 border border-gray-300 rounded-xl">
                            <div className="flex items-center justify-between mb-8">
                                <p className="font-semibold text-sm">Scheduled Interviews</p>
                                <span className="bg-purple-500/10 text-purple-500 p-2 rounded-full">
                                    <Calendar size={16} />
                                </span>
                            </div>
                            <p className="text-2xl font-bold">{stats.scheduledInterviews}</p>
                        </div>

                        <div className="p-6 border border-gray-300 rounded-xl">
                            <div className="flex items-center justify-between mb-8">
                                <p className="font-semibold text-sm">Attrition Rate</p>
                                <span className="bg-red-500/10 text-red-500 p-2 rounded-full">
                                    <TrendingDown size={16} />
                                </span>
                            </div>
                            <p className="text-2xl font-bold">{stats.attritionRate}%</p>
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
                    </section>
                </div>
            </div>
        </div>
    )
}
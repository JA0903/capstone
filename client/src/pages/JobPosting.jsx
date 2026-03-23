/* eslint-disable no-unused-vars */
import { Briefcase, ChevronsLeft, ChevronsRight, MapPin, Search } from "lucide-react";
import Topbar from "../components/Topbar";
import { useState, useEffect } from "react";
import { industries } from "../utils/data";
import { locations } from "../utils/locations";
import Card from "../components/Card";
import { readJobPosting, readOneJob } from "../services/jobServices";
import ViewJob from "../components/ViewJob";
import Input from "../components/ui/Input";
import { useLocation } from "react-router-dom";

export default function JobPosting() {

    const locationState = useLocation();
    const searchParams = locationState.state;

    const [search, setSearch] = useState(searchParams?.searchJob || '');
    const [toSearch, setToSearch] = useState(searchParams?.searchJob || '');
    const [location, setLocation] = useState(searchParams?.searchCity || '');
    const [showLocationDropdown, setShowLocationDropdown] = useState(false);
    const [showJobDropdown, setShowJobDropdown] = useState(false);
    const [industry, setIndustry] = useState('');
    const [type, setType] = useState('');
    const [uniqueJobTitles, setUniqueJobTitles] = useState([]);

    const [showJobDetails, setShowJobDetails] = useState(false);

    const [jobs, setJobs] = useState([]);
    const [filteredJobs, setFilteredJobs] = useState([]);

    const [jobDetails, setJobDetails] = useState(null);

    const handleShowJobDetails = async (jobId) => {
        try {
            const { success, job, message } = await readOneJob(jobId);
            if (success) {
                setJobDetails(job);
                setShowJobDetails(true);
            } else {
                console.error(message);
            }
        } catch (error) {
            console.error(error);
        }
    }

    // Filter jobs based on search criteria
    useEffect(() => {
        let filtered = jobs;

        // Filter by search term (job title or company)
        if (toSearch.trim() !== '') {
            filtered = filtered.filter(job =>
                job?.jobTitle?.toLowerCase().includes(toSearch.toLowerCase()) ||
                job?.company?.companyName?.toLowerCase().includes(toSearch.toLowerCase())
            );
        }

        // Filter by location
        if (location.trim() !== '') {
            filtered = filtered.filter(job =>
                job?.company?.location?.toLowerCase().includes(location.toLowerCase())
            );
        }

        // Filter by type
        if (type !== '') {
            filtered = filtered.filter(job => job?.type === type);
        }

        // Filter by industry (if needed)
        if (industry !== '') {
            filtered = filtered.filter(job => job?.industry === industry);
        }

        // Prioritize Cavite and Laguna
        const caviteLaguna = filtered.filter(job =>
            job?.company?.location?.includes('Cavite') || 
            job?.company?.location?.includes('Laguna')
        );
        const others = filtered.filter(job =>
            !job?.company?.location?.includes('Cavite') && 
            !job?.company?.location?.includes('Laguna')
        );

        setFilteredJobs([...caviteLaguna, ...others]);
    }, [jobs, toSearch, location, type, industry]);

    useEffect(() => {
        try {
            const readJobs = async () => {
                const { success, jobs, message } = await readJobPosting();
                if (success) {
                    setJobs(jobs);
                    // Extract unique job titles
                    const titles = [...new Set(jobs.map(job => job?.jobTitle))].filter(Boolean);
                    setUniqueJobTitles(titles);
                } else {
                    console.error(message);
                }
            }
            readJobs();
        } catch (error) {
            console.error(error);
        }
    }, []);

    return (
        <div>
            <Topbar />
                <div className="bg-emerald-500 py-8 px-[10vw]">
                    <div className="flex items-center gap-2 text-white mb-4">
                        <Briefcase size={32} />
                        <p className="font-bold text-2xl">Find Your Next Job</p>
                    </div>
                    <p className="text-white text-lg">Browse through {jobs.length}+ job openings and find your perfect match</p>
                </div>
                <section className="py-8 px-[10vw]">
                    <div className="p-4 border border-gray-200 rounded-xl">
                        <div className="flex gap-4 flex-wrap border-b border-gray-200 pb-4 mb-4">
                            <div className="relative flex input-search-container grow bg-gray-100 rounded-lg">
                                <div className="grow">
                                    <Input
                                        placeholder="Search Jobs or Companies..."
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        onFocus={() => setShowJobDropdown(true)}
                                    />
                                </div>
                                <button
                                    className="btn bg-emerald-500 text-white rounded-l rounded-lg"
                                    onClick={() => setToSearch(search)}
                                >
                                    <Search size={16} />
                                    <p className="max-md:hidden">Search</p>
                                </button>
                                {showJobDropdown && (
                                    <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg mt-1 max-h-64 overflow-y-auto z-50">
                                        {uniqueJobTitles.length > 0 ? (
                                            uniqueJobTitles
                                                .filter(title => title.toLowerCase().includes(search.toLowerCase()))
                                                .map((title, index) => (
                                                    <div
                                                        key={index}
                                                        onClick={() => {
                                                            setSearch(title);
                                                            setToSearch(title);
                                                            setShowJobDropdown(false);
                                                        }}
                                                        className="px-4 py-2 hover:bg-emerald-100 cursor-pointer text-sm border-b last:border-b-0"
                                                    >
                                                        {title}
                                                    </div>
                                                ))
                                        ) : (
                                            <div className="px-4 py-2 text-sm text-gray-500">
                                                No jobs available
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="flex gap-4 flex-wrap">
                            
                            {/* Location Dropdown */}
                            <div className="relative">
                                <button
                                    onClick={() => setShowLocationDropdown(!showLocationDropdown)}
                                    className="flex-1 min-w-50 select rounded-lg border-0 outline-0 bg-gray-100 px-4 py-2 text-left flex items-center justify-between"
                                >
                                    <span>{location || 'Select Location'}</span>
                                    <MapPin size={16} className="shrink-0" />
                                </button>
                                {showLocationDropdown && (
                                    <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg mt-1 max-h-64 overflow-y-auto z-50">
                                        {locations.map(loc => (
                                            <div
                                                key={loc.id}
                                                onClick={() => {
                                                    setLocation(loc.name);
                                                    setShowLocationDropdown(false);
                                                }}
                                                className="px-4 py-2 hover:bg-emerald-100 cursor-pointer text-sm"
                                            >
                                                {loc.name}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <select
                                className="flex-1 min-w-50 select rounded-lg border-0 outline-0 bg-gray-100"
                                value={industry}
                                onChange={(e) => setIndustry(e.target.value)}
                            >
                                <option value="">Select Industry</option>
                                {industries.map((ind, index) => (
                                    <option key={index} value={ind.value}>{ind.name}</option>
                                ))}
                            </select>

                            {/* <div className="bg-gray-300 w-px"></div> */}

                            <button
                                className={`btn btn-ghost rounded-lg ${type === '' ? 'bg-emerald-500 text-white' : ''}`}
                                onClick={() => setType('')}
                            >
                                All Jobs
                            </button>
                            <button
                                className={`btn btn-ghost rounded-lg ${type === 'Full-Time' ? 'bg-emerald-500 text-white' : ''}`}
                                onClick={() => setType('Full-Time')}
                            >
                                Full-Time
                            </button>
                            <button
                                className={`btn btn-ghost rounded-lg ${type === 'Part-Time' ? 'bg-emerald-500 text-white' : ''}`}
                                onClick={() => setType('Part-Time')}
                            >
                                Part-Time
                            </button>
                            <button
                                className={`btn btn-ghost rounded-lg ${type === 'Contract' ? 'bg-emerald-500 text-white' : ''}`}
                                onClick={() => setType('Contract')}
                            >
                                Contact
                            </button>
                            <button
                                className={`btn btn-ghost rounded-lg ${type === 'Internship' ? 'bg-emerald-500 text-white' : ''}`}
                                onClick={() => setType('Internship')}
                            >
                                Internship
                            </button>
                        </div>
                    </div>
                </section>

                <section className="px-[10vw]">
                    <p className="text-sm text-gray-500 mb-8">Showing <span className="font-semibold text-black">{filteredJobs.length} {filteredJobs.length > 1 ? 'jobs' : 'job'}</span></p>
                    <div className="grid lg:grid-cols-2 gap-4">
                        <div>
                            <div className="grid gap-4 mb-4">
                                {filteredJobs.length > 0 ? (
                                    filteredJobs.map(job => (
                                        <Card
                                            key={job.id}
                                            job={job}
                                            showDetails={(id) => {
                                                handleShowJobDetails(id);
                                            }}
                                        />
                                    ))
                                ) : (
                                    <p className="text-gray-500 text-center">No jobs found</p>
                                )
                                }
                            </div>
                            <div className="flex justify-center gap-2">
                                <button className="btn btn-square">
                                    <ChevronsLeft size={16} />
                                </button>
                                <button className="btn btn-square">
                                    1
                                </button>
                                <button className="btn btn-square">
                                    2
                                </button>
                                <button className="btn btn-square">
                                    3
                                </button>
                                <button className="btn btn-square">
                                    <ChevronsRight size={16} />
                                </button>
                            </div>
                        </div>
                        <div>
                            {showJobDetails &&
                                <ViewJob
                                    job={jobDetails}
                                    show={showJobDetails}
                                    onClose={() => setShowJobDetails(false)}
                                />
                            }
                        </div>
                    </div>
                </section>
        </div>
    )
}
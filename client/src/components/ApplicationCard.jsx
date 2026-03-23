import { Calendar, Clock, FileText } from "lucide-react";
import { cleanDateTime } from "../utils/format";

export default function ApplicationCard({ application, onClick = () => { } }) {

    return (
        <div 
            className="relative flex gap-2 border border-gray-200 rounded-lg p-4 cursor-pointer hover:shadow-lg duration-200 hover:border-emerald-400"
            onClick={onClick}
        >
            <p className="flex-center font-semibold h-12 aspect-square rounded-lg bg-gray-200 text-gray-500">
                <FileText className="shrink-0" />
            </p>
            <div className="w-full">
                <p className="text-lg font-semibold">{application?.job?.jobTitle}</p>
                <p className="text-sm text-gray-500 mb-4">{application?.job?.company?.companyName}</p>
                <div className="flex gap-2 items-center flex-wrap">                    
                    <p className="flex gap-2 items-center text-gray-500 text-sm">
                        <Calendar size={16} className="shrink-0" />
                        {cleanDateTime(application?.createdAt)}
                    </p>
                    <div className="h-1 w-1 rounded-full bg-gray-300"></div>
                    <span className="px-2 py-0.5 text-xs bg-emerald-100 text-emerald-700 rounded-full">
                        {application?.applicantStatus || 'pending'}
                    </span>
                </div>
            </div>
        </div>
    )
}
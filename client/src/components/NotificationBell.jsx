import { Bell, X } from "lucide-react";
import { useContext, useState } from "react";
import { SocketContext } from "../context/SocketProvider";

export default function NotificationBell() {
    const { updates, clearUpdates } = useContext(SocketContext);
    const [showPanel, setShowPanel] = useState(false);

    const getNotificationColor = (type) => {
        switch (type) {
            case 'rejected':
                return 'border-l-4 border-l-red-500';
            case 'job':
                return 'border-l-4 border-l-emerald-500';
            case 'interview':
                return 'border-l-4 border-l-blue-500';
            case 'orientation':
                return 'border-l-4 border-l-purple-500';
            default:
                return 'border-l-4 border-l-gray-500';
        }
    };

    return (
        <div className="relative">
            <button
                className="relative btn btn-square btn-ghost hover:bg-gray-200"
                onClick={() => setShowPanel(!showPanel)}
            >
                {updates.length > 0 && (
                    <span className="flex-center absolute bg-red-500 text-white h-6 w-6 text-xs rounded-full -top-1/3 -right-1/3">
                        {updates.length}
                    </span>
                )}
                <Bell size={20} />
            </button>

            {showPanel && (
                <div className="absolute top-[calc(100%+0.5rem)] right-0 bg-white border border-gray-200 rounded-lg shadow-xl w-96 max-h-96 overflow-y-auto z-50">
                    <div className="border-b border-gray-300 p-4 flex justify-between items-center sticky top-0 bg-white rounded-t-lg">
                        <p className="font-semibold text-sm">Notifications</p>
                        <button
                            className="text-gray-500 hover:text-gray-700"
                            onClick={() => {
                                clearUpdates();
                                setShowPanel(false);
                            }}
                        >
                            <X size={18} />
                        </button>
                    </div>

                    {updates.length === 0 ? (
                        <div className="p-8 text-center text-gray-500">
                            <Bell size={32} className="mx-auto mb-3 text-gray-400" />
                            <p className="text-sm">No notifications</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-200">
                            {updates.map((notif) => (
                                <div
                                    key={notif.id}
                                    className={`p-4 hover:bg-gray-50 transition-colors ${getNotificationColor(
                                        notif.type
                                    )}`}
                                >
                                    <div className="flex justify-between items-start">
                                        <div className="flex-1">
                                            <p className="font-semibold text-sm text-gray-900">
                                                {notif.title}
                                            </p>
                                            <p className="text-xs text-gray-600 mt-1">
                                                {notif.message}
                                            </p>
                                            <p className="text-xs text-gray-400 mt-2">
                                                {new Date(notif.timestamp).toLocaleTimeString()}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

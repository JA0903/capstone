import { useContext, useEffect, useState } from 'react';
import { SocketContext } from '../context/SocketProvider';
import { Bell, X, CheckCircle, AlertCircle, Info } from 'lucide-react';

export default function NotificationCenter() {
    const { updates, clearUpdates } = useContext(SocketContext);
    const [isOpen, setIsOpen] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);

    useEffect(() => {
        setUnreadCount(updates.length);
    }, [updates]);

    const getNotificationIcon = (type) => {
        switch (type) {
            case 'status-change':
                return <CheckCircle size={20} className="text-emerald-500" />;
            case 'rejected':
                return <AlertCircle size={20} className="text-red-500" />;
            case 'interview':
                return <Info size={20} className="text-blue-500" />;
            case 'orientation':
                return <Info size={20} className="text-purple-500" />;
            case 'job':
                return <Bell size={20} className="text-emerald-500" />;
            default:
                return <Info size={20} className="text-gray-500" />;
        }
    };

    return (
        <div className="relative">
            {/* Notification Bell Icon */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
                <Bell size={24} className="text-gray-600" />
                {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>

            {/* Dropdown Panel */}
            {isOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                    <div className="flex items-center justify-between p-4 border-b border-gray-200">
                        <h3 className="font-semibold text-gray-800">Notifications</h3>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="text-gray-500 hover:text-gray-700"
                        >
                            <X size={18} />
                        </button>
                    </div>

                    <div className="max-h-96 overflow-auto">
                        {updates.length === 0 ? (
                            <div className="p-8 text-center text-gray-500">
                                <Bell size={32} className="mx-auto mb-2 opacity-50" />
                                <p>No notifications yet</p>
                            </div>
                        ) : (
                            <ul className="divide-y divide-gray-100">
                                {updates.map((update) => (
                                    <li
                                        key={update.id}
                                        className="p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                                    >
                                        <div className="flex gap-3">
                                            <div className="flex-shrink-0 mt-1">
                                                {getNotificationIcon(update.type)}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-semibold text-sm text-gray-900">
                                                    {update.title}
                                                </p>
                                                <p className="text-sm text-gray-600 break-words">
                                                    {update.message}
                                                </p>
                                                <p className="text-xs text-gray-400 mt-1">
                                                    {new Date(update.timestamp).toLocaleTimeString()}
                                                </p>
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    {updates.length > 0 && (
                        <div className="p-3 border-t border-gray-200 text-center">
                            <button
                                onClick={() => {
                                    clearUpdates();
                                    setIsOpen(false);
                                }}
                                className="text-sm text-emerald-500 hover:text-emerald-600 font-medium"
                            >
                                Clear All
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

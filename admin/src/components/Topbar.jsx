import { Bell, ChevronDown, LogOut, Settings, User, X } from "lucide-react";
import { useContext, useState } from "react";
import { UserContext } from "../context/AuthProvider";
import { useNavigate } from "react-router-dom";
import { logoutAdmin } from "../services/authServices";
import useSocket from "../hooks/useSocket";

export default function Topbar() {

    const { admin, setAdmin } = useContext(UserContext);
    const { notifications, clearNotifications } = useSocket();

    const navigate = useNavigate();

    const [openMenu, setOpenMenu] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);

    const handleLogout = async () => {
        try {
            const { success } = await logoutAdmin();
            if (success) {
                setAdmin(null);
                navigate('/');
                return;
            }
        } catch (error) {
            console.error('Error on handleLogout:', error);
        }
    }

    return (
        <div className="relative flex justify-between items-center border-b border-gray-300 py-4 px-8">
            <button
                className="btn btn-ghost hover:bg-gray-200"
                onClick={() => setOpenMenu((prev) => !prev)}
            >
                <span className="profile-logo h-8 w-8 font-semibold">
                    JC
                </span>
                <div className="max-md:hidden">
                    <p className="font-semibold text-sm text-left">{admin?.fullname}</p>
                    <p className="font-semibold text-xs text-gray-500 text-left">{admin?.role}</p>
                </div>
                <ChevronDown size={16} />
            </button>

            <div className="flex items-center gap-4">
                <button 
                    className="relative btn btn-square btn-ghost hover:bg-gray-200"
                    onClick={() => setShowNotifications(!showNotifications)}
                >
                    <span className="flex-center absolute bg-emerald-500 text-white h-6 w-6 text-xs rounded-full -top-1/3 -right-1/3">
                        {notifications.length}
                    </span>
                    <Bell size={16} />
                </button>
            </div>

            {/* Notifications Panel */}
            {showNotifications && (
                <div className="absolute top-[calc(100%-1rem)] right-8 bg-white border border-gray-200 rounded-md shadow-lg w-80 max-h-96 overflow-y-auto z-50">
                    <div className="border-b border-gray-300 p-4 flex justify-between items-center sticky top-0 bg-white">
                        <p className="font-semibold text-sm">Notifications</p>
                        <button
                            className="text-gray-500 hover:text-gray-700"
                            onClick={() => {
                                clearNotifications();
                                setShowNotifications(false);
                            }}
                        >
                            <X size={16} />
                        </button>
                    </div>
                    {notifications.length === 0 ? (
                        <div className="p-4 text-center text-gray-500">
                            <p className="text-sm">No notifications</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-200">
                            {notifications.map(notif => (
                                <div key={notif.id} className="p-4 hover:bg-gray-50 transition-colors">
                                    <p className="font-semibold text-sm">{notif.title}</p>
                                    <p className="text-xs text-gray-500 mt-1">{notif.message}</p>
                                    <p className="text-xs text-gray-400 mt-2">
                                        {new Date(notif.timestamp).toLocaleTimeString()}
                                    </p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Account Menu */}
            {openMenu &&
                <div className="absolute top-[calc(100%-1rem)] left-8 bg-white border border-gray-200 rounded-md shadow-lg w-50 max-w-50 overflow-hidden z-50">
                    <div className="border-b border-gray-300 p-2">
                        <p className="font-semibold text-sm pb-2">My Account</p>
                        <p className="text-sm text-gray-500">{admin?.email}</p>
                    </div>
                    <button className="flex items-center gap-2 p-2 text-sm cursor-pointer w-full hover:bg-gray-200">
                        <User size={16} />
                        Profile
                    </button>
                    <button className="border-b border-gray-300 flex items-center gap-2 p-2 text-sm cursor-pointer w-full hover:bg-gray-200">
                        <Settings size={16} />
                        Settings
                    </button>
                    <button
                        className="flex items-center gap-2 p-2 text-sm text-red-500 cursor-pointer w-full hover:bg-red-200"
                        onClick={handleLogout}
                    >
                        <LogOut size={16} />
                        Logout
                    </button>
                </div>
            }
        </div>
    )
}
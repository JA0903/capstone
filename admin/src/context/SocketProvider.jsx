import { createContext, useEffect, useState, useCallback } from 'react';
import io from 'socket.io-client';

export const SocketContext = createContext();

const SOCKET_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8001';

export function SocketProvider({ children }) {
    const [socket, setSocket] = useState(null);
    const [isConnected, setIsConnected] = useState(false);
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        const newSocket = io(SOCKET_URL, {
            reconnection: true,
            reconnectionDelay: 1000,
            reconnectionDelayMax: 5000,
            reconnectionAttempts: 5,
            transports: ['websocket', 'polling']
        });

        newSocket.on('connect', () => {
            console.log('🟢 Connected to Socket.IO');
            setIsConnected(true);
        });

        newSocket.on('disconnect', () => {
            console.log('🔴 Disconnected from Socket.IO');
            setIsConnected(false);
        });

        // Real-time event listeners
        newSocket.on('applicant-updated', (data) => {
            addNotification('Applicant Updated', `${data.fullname}'s application status changed`);
        });

        newSocket.on('new-applicant', (data) => {
            addNotification('🎯 New Application', `${data.applicantName} applied for ${data.jobTitle}!`);
        });

        newSocket.on('interview-scheduled', (data) => {
            addNotification('Interview Scheduled', `${data.fullname} - ${data.jobTitle} on ${new Date(data.interviewAt).toLocaleDateString()}`);
        });

        newSocket.on('interview-rescheduled', (data) => {
            addNotification('Interview Rescheduled', `${data.fullname} - ${data.jobTitle} rescheduled to ${new Date(data.interviewAt).toLocaleDateString()}`);
        });

        newSocket.on('job-posted', (data) => {
            addNotification('Job Posted', `New job: ${data.jobTitle}`);
        });

        newSocket.on('admin-action', (data) => {
            addNotification('Admin Action', data.message);
        });

        newSocket.on('orientation-event-created', (data) => {
            addNotification('Orientation Created', `${data.eventTitle} scheduled for ${new Date(data.eventAt).toLocaleDateString()}`);
        });

        newSocket.on('orientation-assigned', (data) => {
            addNotification('Orientation Assigned', `${data.applicantName} assigned to ${data.eventTitle}`);
        });

        newSocket.on('applicant-hired', (data) => {
            addNotification('Applicant Hired', `${data.fullname} has been hired for ${data.jobTitle}! 🎉`);
        });

        newSocket.on('applicant-rejected', (data) => {
            addNotification('Applicant Rejected', `${data.applicantName}'s application for ${data.jobTitle} was rejected`);
        });

        newSocket.on('applicant-blacklisted', (data) => {
            addNotification('Applicant Blacklisted', `${data.fullname} blacklisted - ${data.reason}`);
        });

        newSocket.on('report-generated', (data) => {
            addNotification('Report Generated', 'A hiring report was generated');
        });

        setSocket(newSocket);

        return () => {
            newSocket.disconnect();
        };
    }, []);

    const addNotification = useCallback((title, message) => {
        const id = Date.now();
        const notification = { id, title, message, timestamp: new Date() };
        setNotifications(prev => [notification, ...prev].slice(0, 10)); // Keep last 10
    }, []);

    const emitEvent = useCallback((event, data) => {
        if (socket && isConnected) {
            socket.emit(event, data);
        }
    }, [socket, isConnected]);

    const clearNotifications = useCallback(() => {
        setNotifications([]);
    }, []);

    return (
        <SocketContext.Provider value={{
            socket,
            isConnected,
            notifications,
            addNotification,
            emitEvent,
            clearNotifications
        }}>
            {children}
        </SocketContext.Provider>
    );
}

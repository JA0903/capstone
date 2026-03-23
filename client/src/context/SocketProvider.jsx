import { createContext, useEffect, useState, useCallback } from 'react';
import io from 'socket.io-client';
import { toast } from 'react-toastify';

export const SocketContext = createContext();

const SOCKET_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8001';

export function SocketProvider({ children }) {
    const [socket, setSocket] = useState(null);
    const [isConnected, setIsConnected] = useState(false);
    const [updates, setUpdates] = useState([]);

    useEffect(() => {
        const newSocket = io(SOCKET_URL, {
            reconnection: true,
            reconnectionDelay: 1000,
            reconnectionDelayMax: 5000,
            reconnectionAttempts: 5,
            transports: ['websocket', 'polling']
        });

        newSocket.on('connect', () => {
            console.log('🟢 Client connected to Socket.IO');
            setIsConnected(true);
        });

        newSocket.on('disconnect', () => {
            console.log('🔴 Client disconnected from Socket.IO');
            setIsConnected(false);
        });

        // User/Client specific events
        newSocket.on('job-posted', (data) => {
            addUpdate('New Job Posted', `Check out the new job: ${data.jobTitle}`, 'job');
            toast.info(`New Job Posted: ${data.jobTitle}`);
        });

        newSocket.on('interview-scheduled', (data) => {
            addUpdate('Interview Update', `Your interview has been scheduled`, 'interview');
            toast.info('Your interview has been scheduled!');
        });

        newSocket.on('applicant-updated', (data) => {
            addUpdate('Application Update', `Your application status has changed`, 'update');
        });

        newSocket.on('application-status-changed', (data) => {
            const message = `Your application for ${data.jobTitle} moved to ${data.applicantStatus}`;
            addUpdate('Application Status Changed', message, 'status-change');
            toast.success(message, { 
                autoClose: 5000,
                position: 'bottom-center'
            });
        });

        newSocket.on('orientation-event', (data) => {
            addUpdate('Orientation Scheduled', `${data.eventTitle} has been scheduled`, 'orientation');
            toast.info(`Orientation Scheduled: ${data.eventTitle}`);
        });

        newSocket.on('applicant-rejected', (data) => {
            addUpdate('Application Rejected', `Your application for ${data.jobTitle} has been rejected`, 'rejected');
            toast.error(`Application Rejected: ${data.jobTitle}`, { autoClose: 5000 });
        });

        setSocket(newSocket);

        return () => {
            newSocket.disconnect();
        };
    }, []);

    const addUpdate = useCallback((title, message, type = 'info') => {
        const id = Date.now();
        const update = { id, title, message, type, timestamp: new Date() };
        setUpdates(prev => [update, ...prev].slice(0, 10)); // Keep last 10
    }, []);

    const emitEvent = useCallback((event, data) => {
        if (socket && isConnected) {
            socket.emit(event, data);
        }
    }, [socket, isConnected]);

    const clearUpdates = useCallback(() => {
        setUpdates([]);
    }, []);

    return (
        <SocketContext.Provider value={{
            socket,
            isConnected,
            updates,
            addUpdate,
            emitEvent,
            clearUpdates
        }}>
            {children}
        </SocketContext.Provider>
    );
}

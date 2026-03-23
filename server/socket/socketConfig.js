import express from 'express';
import http from 'http';
import { Server } from 'socket.io';

export const setupSocket = (app) => {
    const server = http.createServer(app);
    const io = new Server(server, {
        cors: {
            origin: ['http://localhost:5173', 'http://localhost:5174'],
            credentials: true,
        },
    });

    // Real-time events
    io.on('connection', (socket) => {
        console.log('🔌 User connected:', socket.id);

        // Applicant status update
        socket.on('applicant-updated', (data) => {
            io.emit('applicant-updated', data);
        });

        // Interview scheduled
        socket.on('interview-scheduled', (data) => {
            io.emit('interview-scheduled', data);
        });

        // Orientation event
        socket.on('orientation-event', (data) => {
            io.emit('orientation-event', data);
        });

        // Job posted
        socket.on('job-posted', (data) => {
            io.emit('job-posted', data);
        });

        // Admin action (visible to all admins)
        socket.on('admin-action', (data) => {
            io.emit('admin-action', data);
        });

        socket.on('disconnect', () => {
            console.log('🔌 User disconnected:', socket.id);
        });
    });

    return { server, io };
};

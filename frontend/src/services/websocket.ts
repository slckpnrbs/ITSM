import { io, Socket } from 'socket.io-client';
import { useEffect, useRef, useCallback } from 'react';
import { useAuthStore } from '../store/authStore';

const NOTIFICATION_URL = import.meta.env.VITE_NOTIFICATION_URL || 'http://localhost:3003';

class WebSocketService {
    private socket: Socket | null = null;
    private listeners: Map<string, Set<(data: any) => void>> = new Map();

    connect(userId: string) {
        if (this.socket?.connected) return;

        this.socket = io(`${NOTIFICATION_URL}/notifications`, {
            transports: ['websocket'],
            autoConnect: true,
        });

        this.socket.on('connect', () => {
            console.log('🔌 WebSocket connected');
            this.socket?.emit('authenticate', { userId });
        });

        this.socket.on('disconnect', () => {
            console.log('🔌 WebSocket disconnected');
        });

        // Register all listeners
        this.listeners.forEach((callbacks, event) => {
            callbacks.forEach((callback) => {
                this.socket?.on(event, callback);
            });
        });
    }

    disconnect() {
        this.socket?.disconnect();
        this.socket = null;
    }

    on(event: string, callback: (data: any) => void) {
        if (!this.listeners.has(event)) {
            this.listeners.set(event, new Set());
        }
        this.listeners.get(event)?.add(callback);
        this.socket?.on(event, callback);
    }

    off(event: string, callback: (data: any) => void) {
        this.listeners.get(event)?.delete(callback);
        this.socket?.off(event, callback);
    }

    joinIncident(incidentId: string) {
        this.socket?.emit('joinIncident', { incidentId });
    }

    leaveIncident(incidentId: string) {
        this.socket?.emit('leaveIncident', { incidentId });
    }
}

export const wsService = new WebSocketService();

// React hook for WebSocket events
export function useWebSocket(event: string, callback: (data: any) => void) {
    const { user } = useAuthStore();
    const callbackRef = useRef(callback);
    callbackRef.current = callback;

    useEffect(() => {
        if (user?.id) {
            wsService.connect(user.id);
        }

        const handler = (data: any) => callbackRef.current(data);
        wsService.on(event, handler);

        return () => {
            wsService.off(event, handler);
        };
    }, [event, user?.id]);
}

// Hook for incident-specific notifications
export function useIncidentNotifications() {
    const { user } = useAuthStore();

    useEffect(() => {
        if (user?.id) {
            wsService.connect(user.id);
        }

        return () => {
            // Keep connection alive for global notifications
        };
    }, [user?.id]);

    const joinIncident = useCallback((incidentId: string) => {
        wsService.joinIncident(incidentId);
    }, []);

    const leaveIncident = useCallback((incidentId: string) => {
        wsService.leaveIncident(incidentId);
    }, []);

    return { joinIncident, leaveIncident };
}

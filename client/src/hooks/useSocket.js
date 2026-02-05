import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export function useSocket() {
    const [socket, setSocket] = useState(null);
    const [connected, setConnected] = useState(false);

    useEffect(() => {
        console.log('🔌 Attempting to connect to:', SOCKET_URL);

        const socketInstance = io(SOCKET_URL, {
            transports: ['websocket', 'polling'],
            withCredentials: true,
            reconnectionAttempts: 5,
            reconnectionDelay: 1000
        });

        socketInstance.on('connect', () => {
            console.log('✅ Connected to server');
            setConnected(true);
        });

        socketInstance.on('connect_error', (error) => {
            console.error('❌ Connection error:', error.message);
            console.error('Error type:', error.type);
            console.error('Error description:', error.description);
        });

        socketInstance.on('disconnect', () => {
            console.log('❌ Disconnected from server');
            setConnected(false);
        });

        setSocket(socketInstance);

        return () => {
            socketInstance.close();
        };
    }, []);

    return { socket, connected };
}

import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export function useSocket() {
    const [socket, setSocket] = useState(null);
    const [connected, setConnected] = useState(false);

    useEffect(() => {
        const socketInstance = io(SOCKET_URL);

        socketInstance.on('connect', () => {
            console.log('✅ Connected to server');
            setConnected(true);
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

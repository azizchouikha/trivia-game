import { useEffect, useRef } from 'react';
import io from 'socket.io-client';

export function useSocket() {
  const socket = useRef();

  useEffect(() => {
    socket.current = io(process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001');

    return () => {
      if (socket.current) {
        socket.current.disconnect();
      }
    };
  }, []);

  return socket.current;
} 
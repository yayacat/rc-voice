import { useState, useEffect, useCallback, useRef } from "react";
import { io, Socket } from "socket.io-client";

const WS_URL = "ws://localhost:4500";

export const useWebSocket = (userId, serverId) => {
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState(null);
  const [socketInstance, setSocketInstance] = useState(null);

  useEffect(() => {
    const socket = io(WS_URL, {
      transports: ["websocket"],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      timeout: 20000,
    });

    setSocketInstance(socket);

    socket.on("connect", () => {
      setIsConnected(true);
      console.log("Connected to server");
      socket.emit("connectServer", { userId: userId, serverId });
    });
    socket.on("error", (error) => {
      setError(error);
    });

    return () => {
      socket.disconnect();
    };
  }, [userId, serverId]);

  return { socketInstance, isConnected, error };
};

export default useWebSocket;

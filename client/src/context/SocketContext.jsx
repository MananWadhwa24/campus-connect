import { createContext, useContext, useEffect, useState, useMemo } from "react";
import { io } from "socket.io-client";
import { useAuth } from "./AuthContext";

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const { token, user } = useAuth();
  const [socket, setSocket] = useState(null);
  const [onlineCount, setOnlineCount] = useState(1);
  const [isConnected, setIsConnected] = useState(false);
  const [lastEvent, setLastEvent] = useState(null);
  const [reconnectCount, setReconnectCount] = useState(0);

  useEffect(() => {
    const host =
      typeof window !== "undefined" && window.location.hostname
        ? window.location.hostname
        : "localhost";

    const socketUrl = `http://${host}:5000`;

    const socketInstance = io(socketUrl, {
      auth: { token: token || localStorage.getItem("token") },
      transports: ["websocket", "polling"],
      reconnectionAttempts: 10,
      reconnectionDelay: 2000,
    });

    socketInstance.on("connect", () => {
      setIsConnected(true);
      setLastEvent({ type: "connect", time: new Date().toLocaleTimeString() });
    });

    socketInstance.on("disconnect", (reason) => {
      setIsConnected(false);
      setLastEvent({
        type: `disconnect (${reason})`,
        time: new Date().toLocaleTimeString(),
      });
    });

    socketInstance.on("reconnect_attempt", (attempt) => {
      setReconnectCount(attempt);
      setLastEvent({
        type: `reconnecting (#${attempt})`,
        time: new Date().toLocaleTimeString(),
      });
    });

    socketInstance.on("users:count", ({ count }) => {
      setOnlineCount(count > 0 ? count : 1);
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, [token]);

  return (
    <SocketContext.Provider
      value={{
        socket,
        onlineCount,
        isConnected,
        lastEvent,
        reconnectCount,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);

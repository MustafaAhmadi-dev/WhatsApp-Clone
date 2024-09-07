import React, { createContext, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

type SocketContextValue = {
  socket: Socket | undefined;
  id: string;
};
const SocketContext = createContext<SocketContextValue | undefined>(undefined);

type SocketProviderProps = {
  children: React.ReactNode;
  id: string;
};
export function SocketProvider({ children, id }: SocketProviderProps) {
  const [socket, setSocket] = useState<Socket>();

  useEffect(() => {
    const newSocket = io("http://localhost:5000", { query: { id } });
    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, [id]);

  return (
    <SocketContext.Provider value={{ socket, id }}>
      {children}
    </SocketContext.Provider>
  );
}

export function useSocket() {
  const context = useContext(SocketContext);
  if (context === undefined) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return context;
}

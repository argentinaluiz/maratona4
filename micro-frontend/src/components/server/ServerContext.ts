import { createContext, Dispatch, SetStateAction } from "react";
import { Server } from "../../models";

interface ServerContextProps {
  serverSelected: {
    serverSelected: Server | null;
    setServerSelected: Dispatch<SetStateAction<Server | null>>;
  };
  servers: {
    servers: Server[];
    setServers: Dispatch<SetStateAction<Server[]>>;
  };
}

const ServerContext = createContext<ServerContextProps>({
  serverSelected: {
    serverSelected: {} as any,
    setServerSelected: (server) => {},
  },
  servers: { servers: [], setServers: (servers) => {} },
});

export default ServerContext;

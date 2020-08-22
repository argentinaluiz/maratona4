// @flow
import * as React from "react";
import ServerContext from "./ServerContext";
import { useKeycloak } from "@react-keycloak/web";
import { useAxios } from "../../hooks/useAxios";
import { Server } from "../../models";
import { useHistory, matchPath, useLocation } from "react-router-dom";
import {useDispatch, useSelector} from 'react-redux';
import { Creators as MessageCreators } from "../../store/message";
import { MessageState } from "../../store/message/types";
import { Creators as MemberCreators } from "../../store/member";
import { Creators as WebSocketCreators } from "../../store/socket";
import { http } from "../../util/http";
import { WebSocketState } from "../../store/socket/types";
type Props = {};
export const ServerProvider: React.FC<Props> = (props) => {
  const location = useLocation();
  const match = matchPath(location.pathname, {
    path: "/:serverId?/:channelId?",
    exact: true,
    strict: false,
  }) || { params: {} };
  // @ts-ignore
  const {serverId} = match.params
  const history = useHistory();
  const [serverSelected, setServerSelected] = React.useState<Server | null>(
    null
  );
  const [servers, setServers] = React.useState<Server[]>([]);
  const { keycloak } = useKeycloak();
  //const axios = useAxios();
  //http
  const dispatch = useDispatch();
  const token = keycloak?.token;

  React.useEffect(() => {
    if (!token) {
      return;
    }
    dispatch(WebSocketCreators.initWebsocket({token}));
    (async () => {
      const { data } = await http.get("servers");
      setServers(data);
    })();
  }, [token, dispatch]);

  React.useEffect(() => {
    if (!serverId && servers.length) {
      return history.replace(`/${servers[0].id}`);
    }
    if (serverId && servers.length) {
      setServerSelected(servers.find((server) => server.id === serverId) as Server);
    }
  }, [serverId, servers, history, location]);

  const socket = useSelector<{socket: WebSocketState}>(state => state.socket);
  React.useEffect(() => {
    console.log(socket);
    if(!socket || !servers.length){
      return;
    }
    servers.forEach(server => {
      dispatch(MessageCreators.joinServer({
        serverId: server.id
      }))
      dispatch(MemberCreators.requestMembers({serverId: server.id}));
    })
    
  }, [socket, servers, dispatch])

  return (
    <ServerContext.Provider
      value={{
        servers: { servers, setServers },
        serverSelected: { serverSelected, setServerSelected },
      }}
    >
      {props.children}
    </ServerContext.Provider>
  );
};
import React from "react";
import { Route, BrowserRouter, Switch } from "react-router-dom";
import { useKeycloak } from "@react-keycloak/web";
import { LoginPage } from "../../pages/LoginPage";
import { RegisterPage } from "../../pages/RegisterPage";
import { ChatPage } from "../../pages/ChatPage";
import PrivateRoute from "./PrivateRoute";
import { InvitePage } from "../../pages/InvitePage";
import useInitWebsocket from "../../hooks/useInitWebsocket";
import { Loading } from "../Loading";
import { ServerProvider } from "../server/ServerProvider";

export const AppRouter = () => {
  const { initialized } = useKeycloak();

  useInitWebsocket();

  if (!initialized) {
    return <Loading />;
  }

  return (
    <BrowserRouter>
    <ServerProvider>
      <Switch>
        <Route path={"/login"} component={LoginPage} exact={true} />
        <Route path={"/register"} component={RegisterPage} exact={true} />
        <PrivateRoute
          authLayout={false}
          path={"/invite/:serverId"}
          component={InvitePage}
          exact={true}
        />
        <PrivateRoute
          path={"/servers/:serverId?/:channelId?"}
          component={ChatPage}
          exact={true}
        />
      </Switch>
      </ServerProvider>
    </BrowserRouter>
  );
};

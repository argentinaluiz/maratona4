import React from "react";
import { Route, BrowserRouter, Switch } from "react-router-dom";

import { useKeycloak } from "@react-keycloak/web";
import { LoginPage } from "../pages/LoginPage";
import { RegisterPage } from "../pages/RegisterPage";
import { MainPage } from "../pages/MainPage";
import PrivateRoute from "./PrivateRoute";
import { ServerProvider } from "../components/server/ServerProvider";
import { Invite } from "../pages/Invite";
import PrivateRoute1 from "./PrivateRoute1";

export const AppRouter = () => {
  const { initialized } = useKeycloak();
  
  if (!initialized) {
    return <div>Carregando...</div>;
  }

  return (
    <BrowserRouter>
      <ServerProvider>
        <Switch>
          <Route path={"/login"} component={LoginPage} exact={true} />
          <Route path={"/register"} component={RegisterPage} exact={true} />
          <PrivateRoute1
            path={"/invite/:serverId"}
            component={Invite}
            exact={true}
          />
          <PrivateRoute
            path={"/:serverId?/:channelId?"}
            component={MainPage}
            exact={true}
          />
        </Switch>
      </ServerProvider>
    </BrowserRouter>
  );
};

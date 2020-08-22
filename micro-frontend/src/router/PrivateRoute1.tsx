import React from "react";
import { Route, RouteProps, Redirect } from "react-router-dom";
import { useKeycloak } from "@react-keycloak/web";
import { AuthLayout1 } from "../components/Layout/AuthLayout1";

interface PrivateRouteProps extends RouteProps {}

const PrivateRoute1: React.FC<PrivateRouteProps> = (props) => {
  const { component, ...rest } = props;
  const Component: any = component;
  const { keycloak } = useKeycloak();
  
  return (
    <Route
      {...rest}
      render={(props) =>
        keycloak!.authenticated ? (
          <AuthLayout1>
            <Component {...props} />
          </AuthLayout1>
        ) : (
          <Redirect
            to={{
              pathname: "/login",
              state: { from: props.location },
            }}
          />
        )
      }
    />
  );
};

export default PrivateRoute1;

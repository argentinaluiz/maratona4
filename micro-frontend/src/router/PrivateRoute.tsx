import React from "react";
import { Route, RouteProps, Redirect } from "react-router-dom";
import { useKeycloak } from "@react-keycloak/web";
import { AuthLayout } from "../components/Layout/AuthLayout";

interface PrivateRouteProps extends RouteProps {}

const PrivateRoute: React.FC<PrivateRouteProps> = (props) => {
  const { component, ...rest } = props;
  const Component: any = component;
  const { keycloak } = useKeycloak();
  
  return (
    <Route
      {...rest}
      render={(props) =>
        keycloak!.authenticated ? (
          <AuthLayout>
            <Component {...props} />
          </AuthLayout>
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

export default PrivateRoute;

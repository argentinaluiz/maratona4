// @flow
import * as React from "react";
import UserContext from "./UserContext";
import { useKeycloak } from "@react-keycloak/web";
import { useAxios } from "../../hooks/useAxios";
import { http } from "../../util/http";
type Props = {};
export const UserProvider: React.FC<Props> = (props) => {
  const [user, setUser] = React.useState(null);
  const { keycloak } = useKeycloak();
  //const axios = useAxios();
  const isAuth = keycloak?.authenticated;
  React.useEffect(() => {
    if (!isAuth) {
      return;
    }
    (async () => {
      const { data } = await http.get("users/me");
      setUser(data);
    })();
  }, [isAuth]);

  return (
    <UserContext.Provider value={user}>{props.children}</UserContext.Provider>
  );
};

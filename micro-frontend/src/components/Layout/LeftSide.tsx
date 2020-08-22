// @flow
import * as React from "react";
import { Server, User } from "../../models";
import { ServerSaveModal } from "../ServerSaveModal";
import { sortBy } from "lodash";
import { useHistory } from "react-router-dom";
import UserContext from "../user/UserContext";
import ServerContext from "../server/ServerContext";
type Props = {};
export const LeftSide = (props: Props) => {
  const history = useHistory();
  const [showServerModal, setShowServerModal] = React.useState(false);
  const { servers, serverSelected } = React.useContext(ServerContext);
  const user = React.useContext<User | null>(UserContext);
  console.log(serverSelected);
  function onServerModalClose(serverCreated?: Server) {
    setShowServerModal(false);
    if (serverCreated) {
      servers.setServers((prevState) => [...prevState, serverCreated]);
      history.push(`/servers/${serverCreated.id}`);
    }
  }

  return (
    <div className="bar-list-group">
      <img src="/img/logo.png" alt="Logo Code Slack" className="logo" />

      <a
        href=":void(0)"
        title=""
        className="dropdown-toggle group is-user"
        data-toggle="dropdown"
      >
        <img src={user?.photo_url} alt="Usuário" className="img-group" />

        <span className="fas fa-circle"></span>
        <span className="fas fa-circle-notch"></span>
        <span className="fas fa-minus-circle" aria-hidden="true"></span>
        <span className="fas fa-dot-circle"></span>
      </a>
      <div className="dropdown-menu">
        <a className="dropdown-item" href=":void(0)">
          <span className="fas fa-circle" aria-hidden="true"></span> Disponível
        </a>
        <a className="dropdown-item" href=":void(0)">
          <span className="fas fa-circle-notch" aria-hidden="true"></span>{" "}
          Ausente
        </a>
        <a className="dropdown-item" href=":void(0)">
          <span className="fas fa-minus-circle" aria-hidden="true"></span> Não
          perturbar
        </a>
        <a className="dropdown-item" href=":void(0)">
          <span className="fas fa-dot-circle" aria-hidden="true"></span>{" "}
          Invisível
        </a>
        <a className="dropdown-item" href="login.html">
          <span className="fas fa-sign-out-alt" aria-hidden="true"></span> Sair
        </a>
      </div>
      <div className="separator">Grupos</div>
      {sortBy<Server>(servers.servers, ["name"]).map((server, key) => (
        <a
        key={key}
          href=":void(0)"
          title={server.name}
          className={`group ${
            server.id === serverSelected.serverSelected?.id ? "active" : ""
          }`}
        >
          <img
            src={server.logo_url}
            alt=""
            style={{
              width: "calc(100% - 1px)",
              height: "calc(100% - 1px)",
              borderRadius: "inherit",
            }}
          />
        </a>
      ))}
      <a
        href="javascript:void(0)"
        onClick={() => setShowServerModal(true)}
        title=""
        className="group add"
      >
        +
      </a>
      <ServerSaveModal show={showServerModal} onClose={onServerModalClose} />
    </div>
  );
};

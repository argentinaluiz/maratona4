// @flow
import * as React from "react";
import { useAxios } from "../hooks/useAxios";
import ServerContext from "../components/server/ServerContext";
import { User } from "../models";
import { http } from "../util/http";
import { useSelector } from "react-redux";
import { MembersState } from "../store/member/types";
type Props = {};
export const MembersList = (props: Props) => {
  //const axios = useAxios();
  const [moderator, setModerator] = React.useState<User>();
  const { serverSelected } = React.useContext(ServerContext);
  const serverIdSelected = serverSelected.serverSelected?.id;
  const members = useSelector<{ member: MembersState }, User[]>((state) => {
    const server = state.member.servers.find((s) => s.id === serverIdSelected);
    return server ? server.members : [];
  });
  const ownerId = serverSelected.serverSelected?.owner_id;
  React.useEffect(() => {
    if (moderator || !members.length) {
      return;
    }

    const userModeratorIndex = members.findIndex((m: any) => m.id === ownerId);
    setModerator(members[userModeratorIndex]);
  }, [moderator, members]);

  return (
    <div className="user-list">
      <div className="container-users">
        <div className="type">
          <p>Moderador</p>
          {/* <span>3</span> */}
        </div>

        <ul className="list moderator">
          <li>
            <a
              href=""
              title=""
              className="user-item  dropdown-toggle"
              data-toggle="dropdown"
              aria-haspopup="true"
              aria-expanded="false"
            >
              <div className="user">
                <div className="img-user">
                  <img src={moderator?.photo_url} alt={moderator?.name} />
                </div>
                <p>{moderator?.name}</p>
              </div>

              <span className="fas fa-cog" aria-hidden="true"></span>
            </a>
          </li>
        </ul>
      </div>

      <div className="container-users">
        <div className="type">
          <p>Disponíveis</p>
          <span>{members.length}</span>
        </div>

        <ul className="list">
          {members.map((member, key) => (
            <li key={key}>
              <a
                href=""
                title=""
                className="user-item  dropdown-toggle"
                data-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
              >
                <div className="user">
                  <div className="img-user">
                    <img src={member?.photo_url} alt="Usuário" className="" />
                  </div>
                  <p>{member?.name}</p>
                </div>

                <span className="fas fa-cog" aria-hidden="true"></span>
              </a>

              <div className="dropdown-menu">
                <div
                  className="close"
                  data-dismiss="dropdown-menu"
                  aria-label="Close"
                >
                  <span aria-hidden="true">×</span>
                </div>

                <div className="dropdown-user">
                  <div className="img-user">
                    <img src="./img/huguinho.png" alt="Usuário" className="" />
                  </div>
                  <p>Nome do usuário</p>
                </div>

                <div className="dropdown-role-user">
                  <form action="" className="form-role">
                    <label
                      className="form-check-label"
                      htmlFor="checkModerador"
                    >
                      Tornar Moderador
                    </label>
                    <input
                      className="check-input"
                      type="checkbox"
                      value=""
                      id="checkModerador"
                    />
                  </form>

                  <a href="" title="">
                    Remocer do grupo
                  </a>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

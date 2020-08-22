// @flow
import * as React from "react";
import { useSelector } from "react-redux";
import { MessageState, Message } from "../store/message/types";
import { Channel, User } from "../models";
import { useDispatch } from "react-redux";
import { Creators } from "../store/message";
import { MembersState } from "../store/member/types";
import ServerContext from "../components/server/ServerContext";
import {format, parseISO} from 'date-fns';

interface MessagePanelProps {
  channel: Channel | null;
}
export const MessagePanel: React.FC<MessagePanelProps> = (props) => {
  const { channel } = props;
  const dispatch = useDispatch();
  const inputRef = React.useRef() as React.MutableRefObject<any>;
  const messagesContainerRef = React.useRef() as React.MutableRefObject<any>;
  const messages: Message[] = useSelector<{ message: MessageState }, Message[]>(
    (state) => {
      if (!channel) {
        return [];
      }
      const channelFound = state.message.channels.find(
        (c) => c.id === channel.id
      );
      return !channelFound ? [] : channelFound.messages;
    }
  );
  const { serverSelected } = React.useContext(ServerContext);
  const serverIdSelected = serverSelected.serverSelected?.id;
  const members = useSelector<{ member: MembersState }, User[]>((state) => {
    const server = state.member.servers.find((s) => s.id === serverIdSelected);
    return server ? server.members : [];
  });

  function getName(userId: string) {
    const member = members.find((m) => m.id === userId);
    return member ? member.name : "";
  }

  function getPhotoUrl(userId: string) {
    const member = members.find((m) => m.id === userId);
    return member ? member.photo_url : "";
  }

  React.useEffect(() => {
    if(!messagesContainerRef.current){
      return;
    }
    messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
  }, [messagesContainerRef, messages]);

  return (
    channel && (
      <div className="channel-data">
        <div className="container-messages" ref={messagesContainerRef}>
          {messages.map((message, key) => (
            <div className="message" key={key}>
              <div className="img-user">
                <img src={getPhotoUrl(message.user_id)} alt="Usuário" className="" />
              </div>

              <div className="user-message">
                <header className="moderator">
                  {getName(message.user_id)} <time>{
                  format(parseISO(message.created_at), 'dd/MM/yyyy')
                  }</time>
                </header>
                <div className="content-message">{message.content}</div>
              </div>
            </div>
          ))}
        </div>
        <div className="container-send-message">
            <form className="form-message">
              <div className="form-group">
                <textarea
                  className="form-control"
                  id="message"
                  rows={2}
                  placeholder="Conversar"
                  ref={inputRef}
                ></textarea>
                <span
                  className="fas fa-play"
                  aria-hidden="true"
                  onClick={() => {
                    dispatch(
                      Creators.sendMessage({
                        content: inputRef.current.value,
                        channel_id: channel.id,
                      })
                    );
                    inputRef.current.value = "";
                  }}
                ></span>
              </div>
            </form>
          </div>
      </div>
    )
  );
};
{
  /* <div className="separator">
          <span></span>
          <time>05/08/2020</time>
        </div> */
}

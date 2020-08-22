import { AnyAction } from "redux";

export interface Message {
  id: string;
  content: string;
  user_id: string;
  join: { parent: string };
  created_at: string;
}

export interface Channel {
  id: string;
  messages: Message[];
}

export interface MessageState {
  channels: Channel[];
}

export interface ActiveChannelAction extends AnyAction {
  payload: {
    channelId: string;
  };
}

export interface AddMessageAction extends AnyAction {
  payload: {
    message: Message;
  };
}

export interface AddMessagesAction extends AnyAction {
  payload: {
    messages: Message[];
  };
}

export interface JoinServerAction extends AnyAction {
  payload: {
    serverId: string;
  };
}

export interface SendMessageAction extends AnyAction {
  payload: {
    content: string;
    channel_id: string;
  };
}

export type Actions =
  | JoinServerAction
  | ActiveChannelAction
  | AddMessageAction
  | AddMessagesAction
  | SendMessageAction;

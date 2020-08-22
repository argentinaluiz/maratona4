import { eventChannel } from "redux-saga";
import { fork, take, call, put, actionChannel} from "redux-saga/effects";
import { Types, Creators } from "./index";
import { Types as WebSocketTypes } from "../socket/index";
import { Message } from "./types";
import { http } from "../../util/http";

function subscribe(socket: SocketIOClient.Socket) {
  return eventChannel((emit) => {
    socket.on("new-message", ({ message }: { message: Message }) => {
      console.log(message);
      emit(Creators.addMessage({ message }));
    });
    return () => {};
  });
}

function* read(socket: SocketIOClient.Socket) {
  const channel = yield call(subscribe, socket);
  while (true) {
    let action = yield take(channel);
    yield put(action);
  }
}

function* write(socket: SocketIOClient.Socket) {
  while (true) {
    const { payload } = yield take(Types.SEND_MESSAGE);
    console.log(payload);
    socket.emit("send-message", payload);
  }
}

function* configureEvents(socket: SocketIOClient.Socket) {
  yield fork(read, socket);
  yield fork(write, socket);
}

function* joinServer(socket: any) {
  while (true) {
    let { payload } = yield take(Types.JOIN_SERVER);
    socket.emit("join", { server_id: payload.serverId });
  }
}

function getMessagesHttp(channelId: string) {
  return http.get(`channels/${channelId}/messages`);
}

function* getMessages(socket: any) {
  const channel = yield actionChannel(Types.ACTIVE_CHANNEL);
  while (true) {
    const { payload } = yield take(channel);
    const { data } = yield call(getMessagesHttp, payload.channelId);
    if (data.length) {
      yield put(
        Creators.addMessages({
          messages: data,
        })
      );
    }
  }
}

export function* messageSaga() {
  const { payload } = yield take(WebSocketTypes.ADD_WEB_SOCKET);
  const socket = payload.socket;
  yield fork(joinServer, socket);
  yield fork(configureEvents, socket);
  yield fork(getMessages, socket);
  //while (true) {
  //let result = yield actionChannel(Types.JOIN_SERVER);
  //console.log(result);
  //socket.join("join", { channel_id: payload.channelId, server_id: payload.serverId });

  //const task = yield fork(configureEvents, socket);

  // let action = yield take(`${logout}`);
  // yield cancel(task);
  // socket.emit("logout");
  //}
}

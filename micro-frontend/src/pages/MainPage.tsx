// @flow
import * as React from "react";
import { LeftSide } from "../components/Layout/LeftSide";
import { Channels } from "./Channels";
import { MessagePanel } from "./MessagePanel";
import { MembersList } from "./MembersList";
import { Category, Channel } from "../models";
import { useParams, useHistory } from "react-router-dom";
import { useAxios } from "../hooks/useAxios";
import { flatten } from "lodash";
import { useDispatch } from "react-redux";
import { Creators } from "../store/message";
import { http } from "../util/http";

type Props = {};
export const MainPage = (props: Props) => {
  const result = useParams();
  console.log(result);
  const { serverId, channelId } = useParams();
  const history = useHistory();
  //const axios = useAxios();
  const [categories, setCategories] = React.useState<Category[]>([]);
  const [channels, setChannels] = React.useState<Channel[]>([]);
  const [channelSelected, setChannelSelected] = React.useState<Channel | null>(
    null
  );
  const dispatch = useDispatch();
  React.useEffect(() => {
    if (channelId && channels.length) {
      const channel = channels.find((channel) => channel.id === channelId);
      if (channel) {
        setChannelSelected(channel);
        dispatch(Creators.activeChannel({ channelId: channel.id }));
      }
    }
  }, [channelId, channels, dispatch]);

  React.useEffect(() => {
    if (!serverId) {
      return;
    }
    (async () => {
      const { data: categories } = await http.get(
        `servers/${serverId}/categories`
      );
      setCategories(categories);
      const channelsCollection = await Promise.all(
        categories.map((category: any) =>
          http.get(`categories/${category.id}/channels`)
        )
      );
      const channels = flatten<any>(channelsCollection.map((r: any) => r.data));
      setChannels(channels);
    })();
  }, [serverId]);

  React.useEffect(() => {
    console.log(channelId);
    if (!serverId || !channels.length || channelId) {
      return;
    }
    if (!channelId) {
      history.replace(`/${serverId}/${channels[0].id}`);
    }
  }, [serverId, channelId, channels, history]);

  const onCategoryCreated = React.useCallback((categoryCreated?: Category) => {
    if (categoryCreated) {
      setCategories((prevState) => [...prevState, categoryCreated]);
    }
  }, []);

  const onChannelCreated = React.useCallback((channelCreated?: Channel) => {
    if (channelCreated) {
      setChannels((prevState) => [...prevState, channelCreated]);
    }
  }, []);

  return (
    <>
      <Channels
        categories={categories}
        channels={channels}
        channel={channelSelected}
        onCategoryCreated={onCategoryCreated}
        onChannelCreated={onChannelCreated}
      />
      <MessagePanel channel={channelSelected} />
      <MembersList />
    </>
  );
};

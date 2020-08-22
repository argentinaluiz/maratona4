// @flow
import * as React from "react";
import { Category, Channel } from "../models";
import { CategorySaveModal } from "../components/CategorySaveModal";
import { ChannelSaveModal } from "../components/ChannelSaveModal";
import ServerContext from "../components/server/ServerContext";
import { InviteLinkModal } from "../components/InviteLinkModal";


interface ChannelsProps {
  categories: Category[];
  channels: Channel[];
  channel: Channel | null;
  onCategoryCreated: (category: Category) => void;
  onChannelCreated: (channel: Channel) => void;
}
export const Channels: React.FC<ChannelsProps> = (props) => {
  const {
    categories,
    channels,
    channel,
    onCategoryCreated,
    onChannelCreated,
  } = props;
  const [categorySelected, setCategorySelected] = React.useState<string>("");
  const [showCategoryModal, setShowCategoryModal] = React.useState(false);
  const [showChannelModal, setShowChannelModal] = React.useState(false);
  const [showInviteModal, setShowInviteModal] = React.useState(false);
  const { serverSelected } = React.useContext(ServerContext);

  function openCategoryModal() {
    setShowCategoryModal(true);
  }

  function onCategoryModalClose(categoryCreated?: Category) {
    setShowCategoryModal(false);
    if (categoryCreated) {
      onCategoryCreated(categoryCreated);
    }
  }

  function onChannelModalClose(channelCreated?: Channel) {
    setShowChannelModal(false);
    if (channelCreated) {
      onChannelCreated(channelCreated);
    }
  }

  function onInviteModalClose() {
    setShowInviteModal(false);
  }

  return (
    <>
      <div className="dropdown group-name">
        <a
          className="dropdown-settings"
          href="#"
          role="button"
          id="dropdownSettingsGroup"
          data-toggle="dropdown"
          aria-haspopup="true"
          aria-expanded="false"
        >
          {serverSelected.serverSelected?.name}
          <span className="fa fa-chevron-down" aria-hidden="true"></span>
        </a>

        <div className="dropdown-menu">
          <a
            className="dropdown-item"
            href="javascript:void(0)"
            onClick={() => openCategoryModal()}
          >
            Criar categoria
            <span className="fas fa-folder-plus" aria-hidden="true"></span>
          </a>
          <a
            className="dropdown-item"
            href="javascript:void(0)"
            onClick={() => {setShowInviteModal(true)}}
          >
            Url de convite
            <span className="fas fa-user" aria-hidden="true"></span>
          </a>
        </div>
      </div>

      <div className="channel-info">
        <span className="fas fa-hashtag" aria-hidden="true"></span>
        <h2>{channel?.name}</h2>
      </div>

      <div className="channel-list">
        {categories.map((category, key) => (
          <div key={key} className="container-channels">
            <div className="category">
              <a
                className="item-category"
                href={`#collapse-channel-${key}`}
                role="button"
                data-toggle="collapse"
                aria-expanded="true"
                aria-controls={`collapse-channel-${key}`}
              >
                <span className="fa fa-chevron-down" aria-hidden="true"></span>{" "}
                {category.name}
              </a>

              <a
                className="add-channel"
                href="javascript:void(0)"
                onClick={() => {
                  setCategorySelected(category.id);
                  setShowChannelModal(true);
                }}
                title="Adicionar Canal"
              >
                <span className="fa fa-plus" aria-hidden="true"></span>
              </a>
            </div>
            <div className="collapse show" id={`collapse-channel-${key}`}>
              <ul>
                {channels
                  .filter((channel) => channel.join.parent === category.id)
                  .map((channel) => (
                    <li>
                      <a className="item-channel" href="" title="">
                        <span
                          className="fas fa-hashtag"
                          aria-hidden="true"
                        ></span>{" "}
                        {channel.name}
                      </a>
                    </li>
                  ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
      <CategorySaveModal
        show={showCategoryModal}
        onClose={onCategoryModalClose}
      />
      <ChannelSaveModal
        show={showChannelModal}
        categoryId={categorySelected}
        onClose={onChannelModalClose}
      />
      <InviteLinkModal
        show={showInviteModal}
        serverId={serverSelected.serverSelected?.id}
        onClose={onInviteModalClose}
      />
    </>
  );
};

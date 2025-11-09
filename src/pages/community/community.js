import Cookies from "../../static/js/cookies/cookies.js";
import LocalStorage from "../../static/js/localstorage/localstorage.js";
import { localStorageTypes } from "../../static/js/localstorage/localstorage.types.js";

import {
  renderHeader,
  renderSidebar,
  renderNavbar
} from "../../components/baseComponents.js";
import communityCard from "../../components/communityCard.js";

export const renderCommunities = () => {
  renderHeader();
  renderSidebar();
  renderNavbar();
  const groups = LocalStorage.get(localStorageTypes.GROUPS);
  const communityComponent = document.getElementById("communities");

  if (!groups) return communityComponent.innerHTML = "Nenhuma comunidade foi encontrada!";

  const html = groups.map(group => `${communityCard({
    id: group.id,
    name: group.name,
    image_url: group.image_url,
    isPrivate: group.private,
    members: group.users_id
  })}
  `).join("")

  communityComponent.innerHTML = html;
  communityComponent.classList.add("communities-main__container");
}

import Cookies from "../../static/js/cookies/cookies.js";
import LocalStorage from "../../static/js/localstorage/localstorage.js";
import { localStorageTypes } from "../../static/js/localstorage/localstorage.types.js";

import {
  renderHeader,
  renderSidebar,
  renderNavbar
} from "../../components/baseComponents.js";
import communityCard from "../../components/communityCard.js";

export const renderCommunities = (searchTerm = "") => {
  renderHeader();
  renderSidebar();
  renderNavbar();

  let groups = LocalStorage.get(localStorageTypes.GROUPS);
  const communityComponent = document.getElementById("communities");

  if (!groups || groups.length === 0) {
    communityComponent.innerHTML = "Nenhuma comunidade foi encontrada!";
    return;
  }

  const term = searchTerm.trim().toLowerCase();

  if (term) {
    if (["priv", "privado"].includes(term)) {
      groups = groups.filter(group => group.private === true);
    } else if (["pub", "publico"].includes(term)) {
      groups = groups.filter(group => group.private === false);
    } else {
      groups = groups.filter(group => group.name.toLowerCase().includes(term));
    }
  }

  if (groups.length === 0) {
    communityComponent.innerHTML = "Nenhuma comunidade corresponde à busca!";
    return;
  }

  const html = groups.map(group => communityCard({
    id: group.id,
    name: group.name,
    image_url: group.image_url,
    isPrivate: group.private,
    members: group.users_id
  })).join("");

  communityComponent.innerHTML = html;
  communityComponent.classList.add("communities-main__container");
}


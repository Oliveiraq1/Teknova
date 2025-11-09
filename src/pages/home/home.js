import Cookies from "../../static/js/cookies/cookies.js";
import LocalStorage from "../../static/js/localstorage/localstorage.js";
import { localStorageTypes } from "../../static/js/localstorage/localstorage.types.js";

import post from "../../components/post.js";

import {
  renderHeader,
  renderSidebar,
  renderNavbar
} from "../../components/baseComponents.js";

export const renderHome = () => {
  const user = Cookies.getUser();
  const posts = LocalStorage.get(localStorageTypes.POSTS);

  const html = (`
    ${post({ posts, user })}
  `)

  const groupElement = document.getElementById("home-posts");
  groupElement.innerHTML = html;
  renderHeader();
  renderSidebar();
  renderNavbar();
}

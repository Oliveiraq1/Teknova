import Cookies from "../../static/js/cookies/cookies.js";
import LocalStorage from "../../static/js/localstorage/localstorage.js";
import { localStorageTypes } from "../../static/js/localstorage/localstorage.types.js";

import post from "../../components/post.js";

import {
  renderHeader,
  renderSidebar,
  renderNavbar
} from "../../components/baseComponents.js";

export const renderHome = (searchTerm = "") => {
  const user = Cookies.getUser();
  let posts = LocalStorage.get(localStorageTypes.POSTS);

  if (searchTerm) {
    const term = searchTerm.toLowerCase();
    posts = posts.filter(post =>
      post.title.toLowerCase().includes(term) ||
      post.message.toLowerCase().includes(term)
    );
  }

  const html = (`
    ${post({ posts, user })}
  `);

  const groupElement = document.getElementById("home-posts");
  groupElement.innerHTML = posts.length == 0 ? "Seja o primeiro a fazer um post!" : html;

  renderHeader();
  renderSidebar();
  renderNavbar();
}

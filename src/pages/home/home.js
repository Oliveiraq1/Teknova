import Cookies from "../../static/js/cookies/cookies.js";
import LocalStorage from "../../static/js/localstorage/localstorage.js";
import { localStorageTypes } from "../../static/js/localstorage/localstorage.types.js";

import post from "../../components/post.js";
import mobileNavbar from "../../components/mobile-navbar.js";
import sidebar from "../../components/sidebar.js"

export const renderNavbar = () => {
  const mobileNavbarElement = document.getElementById("mobile-navbar");
  mobileNavbarElement.innerHTML = mobileNavbar();
}

export const renderSidebar = () => {
  const sidebarElement = document.getElementById("sidebar");
  sidebarElement.innerHTML = sidebar();
}

export const renderHomePosts = () => {
  const { image_url } = Cookies.getUser();

  const userIcon = document.getElementById("header-user-icon");
  userIcon.src = image_url;

  const user = Cookies.getUser();
  const posts = LocalStorage.get(localStorageTypes.POSTS);

  const html = (`
    <main class="group-post-container">
      ${post({ posts, user })}
    </main>  
  `)

  const groupElement = document.getElementById("home-posts");
  groupElement.innerHTML = html;
  renderNavbar();
  renderSidebar();
}

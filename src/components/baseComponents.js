import Cookies from "../static/js/cookies/cookies.js";

import header from "./header.js";
import sidebar from "./sidebar.js";
import mobileNavbar from "./mobile-navbar.js";

export const renderHeader = () => {
  const { image_url } = Cookies.getUser();
  const headerComponent = document.getElementById("header");
  headerComponent.innerHTML = header();

  const userIcon = document.getElementById("header-user-icon");
  userIcon.src = image_url;
}

export const renderNavbar = () => {
  const mobileNavbarElement = document.getElementById("mobile-navbar");
  mobileNavbarElement.innerHTML = mobileNavbar();
}

export const renderSidebar = () => {
  const sidebarElement = document.getElementById("sidebar");
  sidebarElement.innerHTML = sidebar();
}
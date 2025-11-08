import Page404 from "../../pages/404.js";
import LocalStorage from "./localstorage/localstorage.js";
import { middleware } from "./middleware.js";
import { renderGroup } from "../../pages/groups/group.js";
import { renderNotifications } from "../../pages/notifications/notifications.js";
import { renderHomePosts } from "../../pages/home/home.js";

window.addEventListener("hashchange", renderPage);
window.addEventListener("load", renderPage);

const routes = {
  home: { path: "pages/home/home.html" },
  register: { path: "pages/register.html" },
  login: { path: "pages/login.html" },
  group: { path: "pages/groups/group.html" },
  notifications: { path: "pages/notifications/notifications.html" }
}

LocalStorage.load();

function renderPage() {
  const hash = window.location.hash.replace("#", "") || "home";
  const [path, query] = hash.split("?");
  const params = new URLSearchParams(query);

  if (!middleware(path)) return;

  const route = routes[path];
  if (!route) {
    document.getElementById("app").innerHTML = Page404();
    return;
  }

  fetch(route.path)
    .then(res => res.text())
    .then(html => {
      document.getElementById("app").innerHTML = html;
      if (path == "group") { renderGroup(params) };
      if (path == "notifications") { renderNotifications() };
      if (path == "home") { renderHomePosts(), renderNav() };
    })
    .catch((error) => {
      console.log(error);
      document.getElementById("app").innerHTML = Page404();
    })
}

const renderNav = () => {

  const html = (`
    <img class="icon-nav" src="../../static/assets/icons/notification-13-svgrepo-com-blue-outline-fixed.svg" alt="notification">
    <img class="icon-nav" id="big-icon" src="../../static/assets/icons/house-02-svgrepo-com-blue-outline-fixed.svg" alt="home">
    <img class="icon-nav" id="big-icon" src="../../static/assets/icons/message-circle-matched-stroke.svg" alt="community">
    <img class="icon-nav" id="perfil-icon" src="https://api.dicebear.com/7.x/adventurer/svg?seed=admin" alt="perfil">
  `)

  const groupElement = document.getElementById("navbar");
  groupElement.innerHTML = html;
}
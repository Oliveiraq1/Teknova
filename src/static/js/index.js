import Page404 from "../../pages/404.js";
import LocalStorage from "./localstorage/localstorage.js";
import { middleware } from "./middleware.js";
import { renderGroup } from "../../pages/groups/group.js";
import { renderNotifications } from "../../pages/notifications/notifications.js";
import { renderHome } from "../../pages/home/home.js";
import { renderAdminDashboard } from "../../pages/admin/admin.js";
import { renderCommunities } from "../../pages/community/community.js";
import { renderProfile } from "../../pages/profile/profile.js";

window.addEventListener("hashchange", renderPage);
window.addEventListener("load", renderPage);

const routes = {
  home: { path: "pages/home/home.html" },
  register: { path: "pages/register.html" },
  login: { path: "pages/login.html" },
  group: { path: "pages/groups/group.html" },
  notifications: { path: "pages/notifications/notifications.html" },
  admin: { path: "pages/admin/admin.html" },
  community: { path: "pages/community/community.html" },
  profile: { path: "pages/profile/profile.html" },
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
      if (path == "home") { renderHome() };
      if (path == "admin") { renderAdminDashboard() };
      if (path == "community") { renderCommunities() };
      if (path == "profile") { renderProfile() };
    })
    .catch((error) => {
      console.log(error);
      document.getElementById("app").innerHTML = Page404();
    })
}
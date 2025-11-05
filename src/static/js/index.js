import Page404 from "../../pages/404.js";
import { middleware } from "./middleware.js";

window.addEventListener("hashchange", renderPage);
window.addEventListener("load", renderPage);

const routes = {
  home: { path: "pages/home.html" },
  register: { path: "pages/register.html" },
  login: { path: "pages/login.html" }
}

function renderPage() {
  const path = window.location.hash.replace("#", "") || "home";
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
    })
    .catch(() => {
      document.getElementById("app").innerHTML = Page404();
    })
}

import { middleware } from "./middleware.js";
import ErrorPage from "./pages/error/page.js";

import {
  onSubmitLogin,
  onSubmitRegister
} from "./utils/forms.js";

window.onSubmitLogin = onSubmitLogin;
window.onSubmitRegister = onSubmitRegister;

window.addEventListener("hashchange", renderPage);
window.addEventListener("load", renderPage);

function renderPage() {
  const route = window.location.hash.replace("#", "") || "home";
  if (!middleware(route)) return;
  importModule(route);
}

async function importModule(route) {
  try {
    const module = await import(`./pages/${route}/page.js`);
    document.getElementById("app").innerHTML = module.default();
  } catch (error) {
    console.error(error);
    document.getElementById("app").innerHTML = `${ErrorPage()}`
  }
}
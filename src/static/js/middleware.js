import { cookieTypes } from "./cookies/cookie.types.js";
import Cookies from "./cookies/cookies.js"

const public_routes = [
  { path: "login", whenAuthenticated: "redirect" },
  { path: "register", whenAuthenticated: "redirect" },
]

function checkAuthentication(route) {
  const authenticated = Cookies.get(cookieTypes.AUTHENTICATION);
  const public_route = public_routes.find(r => r.path == route);

  if (!public_route && !authenticated) {
    window.location.hash = "#login";
    return false;
  }

  if (
    public_route
    && public_route.whenAuthenticated == "redirect"
    && authenticated
  ) {
    window.location.hash = "#home";
    return false;
  }

  return true;
}

function checkAdmin() {
  const { admin } = Cookies.getUser();
  if (admin) return true;

  window.location.hash = "#home";
  return false;
}

export function middleware(route) {
  if (!checkAuthentication(route)) return false;
  if (route == "admin" && !checkAdmin(route)) return false;
  return true;
}
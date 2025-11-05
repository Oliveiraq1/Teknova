import { cookieTypes } from "./cookies/cookie.types.js";
import Cookies from "./cookies/cookies.js"

const public_routes = [
  { path: "login", whenAuthenticated: "redirect" },
  { path: "register", whenAuthenticated: "redirect" },
]

export function middleware(route) {
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
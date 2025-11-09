import Cookies from "../static/js/cookies/cookies.js";

const mobileNavbar = () => {
  const { image_url } = Cookies.getUser();
  return (`
    <nav class="mobile-navbar-container">
      <a href="#notifications"><img src="/static/assets/icons/nav-notification.svg" class="nav-icon" /></a>
      <a onclick="openSidebar()"><img src="/static/assets/icons/nav-menu.svg" class="nav-icon" /></a>
      <a href="#home"><img src="/static/assets/icons/nav-home.svg" class="nav-icon" /></a>
      <a href="#profile"><img src="${image_url}" class="user-icon" /></a>
    </nav>
  `)
}

export default mobileNavbar;
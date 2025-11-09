import Cookies from "../static/js/cookies/cookies.js";
import LocalStorage from "../static/js/localstorage/localstorage.js";
import { localStorageTypes } from "../static/js/localstorage/localstorage.types.js";

const sidebar = () => {
  const { id, admin, image_url, name, last_name } = Cookies.getUser();
  const groups = LocalStorage.get(localStorageTypes.GROUPS);
  const userGroups = groups.filter(g => g.users_id.includes(id));

  return (`
    <div id="sidebar-overlay" class="sidebar-overlay visible" onclick="closeSideBar()"></div>
    <div id="sidebar-wrapper" class="sidebar-wrapper open">
      <nav class="sidebar">
        <div class="sidebar-header">
          <img src="${image_url}" alt="user-icon" class="sidebar-header__user-profile">
          <img src="/static/assets/icons/close.svg" class="sidebar-header__close" onclick="closeSideBar()" />
          <p>${name} ${last_name}</p>
        </div>
        <hr/>
        <div class="sidebar-main">
          <a class="sidebar-link" href="#home"><img src="/static/assets/icons/nav-home.svg" class="sidebar-icon" />Home</a>
          <a class="sidebar-link" href="#notifications"><img src="/static/assets/icons/nav-notification.svg" class="sidebar-icon" />Notificacoes</a>
          <a class="sidebar-link" href="#profile"><img src="/static/assets/icons/sidebar-profile.svg" class="sidebar-icon" />Perfil</a>
          ${admin ? `<a class="sidebar-link" href="#admin"><img src="/static/assets/icons/sidebar-admin.svg" class="sidebar-icon" />Admin</a>` : ''}
          <details class="sidebar-community">
            <summary>Comunidades</summary>
            <div class="sidebar-communities">
              ${userGroups.length == 0 ? (`<div class="sidebar-communities no-community"><a href="#community">Buscar comunidades</a></div>`) : userGroups.map(g => (`
                <a href="#group?id=${g.id}" class="sidebar-community__group">
                  <img src="${g.image_url}" alt="group-img" class="sidebar-community__group-img" />
                  <p>${g.name}</p>
                </a>
              `))}
            </div>
          </details>
        </div>
        <hr />
        <div class="sidebar-footer">
          <a class="sidebar-link" href="#notifications" onclick="logout()"1>
            <img src="/static/assets/icons/logout.svg" class="sidebar-icon" />
            Sair
          </a>
        </div>
      </nav>
    </div>
  `)
}

export default sidebar;
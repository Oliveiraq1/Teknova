import LocalStorage from "../../static/js/localstorage/localstorage.js";
import Cookies from "../../static/js/cookies/cookies.js";
import post from "../../components/post.js";
import { localStorageTypes } from "../../static/js/localstorage/localstorage.types.js";

import {
  renderHeader,
  renderSidebar,
  renderNavbar
} from "../../components/baseComponents.js";

/* ======= Usuario nao eh membro */
const renderPrivateGroup = ({ group }) => {
  const html = (`
    <header class="flex flex-col group-header">
      <div class="group-header__banner relative">
        <div class="group-header__group-img">
          <img src="https://ui-avatars.com/api/?name=${group.name}" />
        </div>
      </div>
      <div class="flex-center">
        <div class="group-header__details">
          <p class="group-header__details-title">g/${group.name}</p>
          <img src="../../static/assets/icons/lock.svg" class="group-header__details-image" />
        </div>
      </div>
    </header>
    <main class="private-group">
      <p class="private-group__title">Grupo privado</p>
      <button class="group-header__details-button" onclick="groupRequest('${group.id}')">Pedir para entrar</button>
    </main>
  `)

  const groupElement = document.getElementById("private-group");
  groupElement.style.display = "flex";
  groupElement.style.flexDirection = "column";
  groupElement.style.height = "100%";
  groupElement.innerHTML = html;
}

const renderPublicGroup = ({ group, user }) => {
  const html = (`
    <header class="flex flex-col group-header">
      <div class="group-header__banner relative">
        <div class="group-header__group-img">
          <img src="https://ui-avatars.com/api/?name=${group.name}" />
        </div>
      </div>
      <div class="flex-center">
        <div class="group-header__details">
          <p class="group-header__details-title">g/${group.name}</p>
          <button class="group-header__details-button" onclick="joinPublicGroup('${group.id}')">Entrar no grupo</button>
        </div>
      </div>
    </header>
    <main class="group-post-container">
      ${post({ group, user })}
    </main>
    `)

  const groupElement = document.getElementById("public-group");
  groupElement.innerHTML = html;
}

/* ======= Usuario faz parte do grupo */
const member = ({ group, user }) => {
  const html = (`
    <header class="flex flex-col group-header">
      <div class="group-header__banner relative">
        <div class="group-header__group-img">
          <img src="https://ui-avatars.com/api/?name=${group.name}" />
        </div>
      </div>
      <div class="flex-center">
        <div class="group-header__details">
          <p class="group-header__details-title">g/${group.name}</p>
          <button class="group-header__details-button" onclick="openPostModal()">Novo Post</button>
        </div>
      </div>
      </header>
    <div class="flex-center">
      <div class="modal hidden" id="post-modal">
        <div class="modal-container">
          <input type="text" id="post-modal-title" placeholder="Titulo do post *" />
          <input type="text" id="post-modal-message" placeholder="Corpo do post *" />
          <input type="text" id="post-modal-image_url" placeholder="Informe o link da imagem *" />
          <button type="button" onclick=createPost('${group.id}')>Criar post</button>
        </div>
      </div>
    </div>
    <main class="group-post-container">
      ${post({ group, user })}
    </main>`
  )

  const groupElement = document.getElementById("group");
  groupElement.innerHTML = group.posts.length == 0 ? "Seja o primeiro a fazer um post!" : html;
}

const throwError = (message) => {
  window.alert(message);
  throw new Error(message);
}

export const renderGroup = (params, searchTerm = "") => {
  const group_id = params.get("id");
  if (!group_id) return throwError("Grupo nao encontrado");

  const groups = LocalStorage.get(localStorageTypes.GROUPS);
  const group = groups.find(g => g.id == group_id);
  if (!group) return throwError("Grupo nao encontrado");

  const user = Cookies.getUser();
  if (!user) throw new Error("Usuario invalido!");

  if (searchTerm) {
    const term = searchTerm.toLowerCase();
    group.posts = group.posts.filter(post =>
      post.title.toLowerCase().includes(term) ||
      post.message.toLowerCase().includes(term)
    );
  }

  if (!group.users_id.includes(user.id) && group.private) {
    renderHeader(false);
  } else {
    renderHeader();
  }

  renderSidebar();
  renderNavbar();

  if (group.users_id.includes(user.id)) return member({ group, user });
  if (!group.users_id.includes(user.id) && group.private) return renderPrivateGroup({ group });
  renderPublicGroup({ group, user });
}

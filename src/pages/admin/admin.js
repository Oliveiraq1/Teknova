import LocalStorage from "../../static/js/localstorage/localstorage.js";
import Cookies from "../../static/js/cookies/cookies.js";
import { localStorageTypes } from "../../static/js/localstorage/localstorage.types.js";

import usersTable from "../../components/usersTable.js";
import groupRequestsTable from "../../components/groupRequestsTable.js";

import {
  renderHeader,
  renderSidebar,
  renderNavbar
} from "../../components/baseComponents.js";

export const renderUsersTable = (filter = null) => {
  const usersCountElement = document.getElementById("active-users-count");
  const usersCount = LocalStorage.get(localStorageTypes.USERS).length;
  usersCountElement.innerHTML = `${usersCount}`;

  const userTableElement = document.getElementById("users-table");
  userTableElement.innerHTML = usersTable(filter);
}

export const renderReportsTable = () => {
  const reports = LocalStorage.get(localStorageTypes.REPORTS) || [];

  const postsCountElement = document.getElementById("active-denounces-count");
  postsCountElement.innerHTML = `${reports.length}`;

  const container = document.getElementById("denounces-slider");
  const prevBtn = document.getElementById("prev-denounce");
  const nextBtn = document.getElementById("next-denounce");

  if (!container || !prevBtn || !nextBtn) return;
  let currentIndex = 0;

  const renderDenounceSlide = () => {
    if (!reports.length) return container.innerHTML = "<p>Nenhuma denúncia encontrada.</p>";

    const item = reports[currentIndex];
    const { post, group, denounces } = item;
    const author = post.author.fullname;
    const message = post.message;
    const image = post.image_url;
    const title = post.title;
    const groupName = group?.name || "Sem grupo";
    const count = denounces.length;

    container.innerHTML = `
      <h3>${title}</h3>
      <p><strong>Autor:</strong> ${author} (${post.author.id})</p>
      <p><strong>Grupo:</strong> ${groupName}</p>
      <img src="${image}" alt="Imagem do post" />
      <p>${message}</p>
      <p><strong>Denúncias:</strong> ${count}</p>
      <div class="denounces-actions">
        <img title="Revogar denuncia" onclick="revokeDenounce(${group ? group.id : `'null'`}, ${post.id})" src="/static/assets/icons/revoke-denounce.svg" alt="Revogar denuncia" class="denounces-actions__icon" />
        <img title="Marcar como fake" onclick="markAsFake(${group ? group.id : `'null'`}, ${post.id})" src="/static/assets/icons/fake-post.svg" alt="Revogar denuncia" class="denounces-actions__icon" />
        <img title="Apagar post" onclick="deletePost(${group ? group.id : `'null'`}, ${post.id})" src="/static/assets/icons/delete-post.svg" alt="Revogar denuncia" class="denounces-actions__icon" />
      </div>
    `;
  };

  prevBtn.onclick = () => {
    currentIndex = (currentIndex - 1 + reports.length) % reports.length;
    renderDenounceSlide();
  };

  nextBtn.onclick = () => {
    currentIndex = (currentIndex + 1) % reports.length;
    renderDenounceSlide();
  };

  renderDenounceSlide();
};

export const renderGroupRequestsTable = () => {
  const requestsCountElement = document.getElementById("active-requests-count");
  const requestsCount = LocalStorage.get(localStorageTypes.GROUP_REQUESTS).length;
  requestsCountElement.innerHTML = `${requestsCount}`;

  const requestsTableElement = document.getElementById("requests-table");
  requestsTableElement.innerHTML = groupRequestsTable();
};

export const renderAdminDashboard = () => {
  renderHeader(false);
  renderSidebar();
  renderNavbar();
  renderUsersTable();
  renderGroupRequestsTable();
  renderReportsTable();
};
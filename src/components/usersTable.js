import Cookies from "../static/js/cookies/cookies.js";
import LocalStorage from "../static/js/localstorage/localstorage.js";
import { localStorageTypes } from "../static/js/localstorage/localstorage.types.js";

function filterUsers(users, searchTerm) {
  const term = searchTerm.trim().toLowerCase();
  const termAsNumber = Number(term);

  return users.filter(user => {
    const displayAdmin = user.admin ? "admin" : "usuario";
    const displayActive = user.active ? "ativo" : "inativo";

    return (
      user.name.toLowerCase().includes(term) ||
      user.email.toLowerCase().includes(term) ||
      user.cpf.toLowerCase().includes(term) ||
      displayAdmin.includes(term) ||
      displayActive.includes(term) ||
      (!isNaN(termAsNumber) && user.id === termAsNumber)
    );
  });
}

const usersTable = (filter = null) => {
  const { id } = Cookies.getUser();
  const users = LocalStorage.get(localStorageTypes.USERS);
  let usersToShow = users.filter(u => u.id !== id);

  if (filter) {
    usersToShow = filterUsers(usersToShow, filter);
  }

  return (`
  <div class="table__wrapper">
    <table class="table">
      <thead class="relative">
        <tr>
          <th>Id</th>
          <th>Nome</th>
          <th>Email</th>
          <th>CPF</th>
          <th>Cargo</th>
          <th>Situacao</th>
          <th>Ações</th>
        </tr>
      </thead>
      <tbody>
        ${usersToShow.map(user => (`
          <tr>
            <td>${user.id}</td>
            <td>${user.name}</td>
            <td>${user.email}</td>
            <td>${user.cpf}</td>
            <td>${user.admin ? "admin" : "usuario"}</td>
            <td>${user.active ? "ativo" : "inativo"}</td>
            <td>
              <div class="table__actions">
                <img 
                  title="${user.admin ? 'Desativar admin' : 'Tornar admin'}"
                  src="/static/assets/icons/${user.admin ? 'admin-revoke' : 'admin-crown'}.svg"
                  onclick="${user.admin ? `revokeAdmin('${user.id}')` : `setAdmin('${user.id}')`}"
                  class="table__action-icon"
                />
                <img
                  title="${user.active ? 'Bloquear acesso' : 'Desbloquear acesso'}"
                  src="/static/assets/icons/${user.active ? 'block-user-access' : 'unblock-user-access'}.svg"
                  onclick="${user.active ? `blockUserAccess('${user.id}')` : `unblockUserAccess('${user.id}')`}"
                  class="table__action-icon"
                />
              </div>
            </td>
          </tr>
        `)).join("")}
      </tbody>
    </table>
  </div>
`)
}

export default usersTable;
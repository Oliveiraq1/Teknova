import LocalStorage from "../static/js/localstorage/localstorage.js";
import { localStorageTypes } from "../static/js/localstorage/localstorage.types.js";

function filterGroups(groups, searchTerm) {
  const term = searchTerm.trim().toLowerCase();
  const termAsNumber = Number(term);

  return groups.filter(group => {
    const displayStatus = group.private ? "privado" : "publico";

    return (
      group.name.toLowerCase().includes(term) ||
      displayStatus.includes(term) ||
      (!isNaN(termAsNumber) && group.id === termAsNumber)
    );
  });
}

const groupsTable = (filter = null) => {
  let groupsToShow = LocalStorage.get(localStorageTypes.GROUPS);

  if (filter) {
    groupsToShow = filterGroups(groupsToShow, filter);
  }

  return (`
  <div class="table__wrapper">
    <table class="table">
      <thead class="relative">
        <tr>
          <th>Id</th>
          <th>Nome</th>
          <th>Membros</th>
          <th>Posts</th>
          <th>Status</th>
          <th>Acoes</th>
        </tr>
      </thead>
      <tbody>
        ${groupsToShow.map(group => (`
          <tr>
            <td>${group.id}</td>
            <td>${group.name}</td>
            <td>${group.users_id.length}</td>
            <td>${group.posts.length}</td>
            <td>${group.private ? "privado" : "publico"}</td>
            <td>
              <div class="table__actions">
                <img 
                  title="Excluir grupo"
                  src="/static/assets/icons/trashcan.svg"
                  onclick="deleteGroup('${group.id}')"
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

export default groupsTable;
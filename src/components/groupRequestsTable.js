import LocalStorage from "../static/js/localstorage/localstorage.js";
import { localStorageTypes } from "../static/js/localstorage/localstorage.types.js";

const groupRequestsTable = () => {
  const requests = LocalStorage.get(localStorageTypes.GROUP_REQUESTS) || [];

  return (`
    <div class="table__wrapper">
      <table class="table">
        <thead class="relative">
          <tr>
            <th>Usuário</th>
            <th>Grupo</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          ${requests.map(request => (`
            <tr>
              <td>${request.user.fullname}</td>
              <td>${request.group.name}</td>
              <td>
                <div class="table__actions">
                  <img 
                    title="Permitir entrada"
                    src="/static/assets/icons/accept-request.svg"
                    onclick="approveGroupRequest(${request.id})"
                    class="table__action-icon"
                  />
                  <img 
                    title="Negar entrada"
                    src="/static/assets/icons/decline-request.svg"
                    onclick="denyGroupRequest(${request.id})"
                    class="table__action-icon"
                  />
                </div>
              </td>
            </tr>
          `)).join("")}
        </tbody>
      </table>
    </div>
  `);
};

export default groupRequestsTable;

import LocalStorage from "../../static/js/localstorage/localstorage.js";
import Cookies from "../../static/js/cookies/cookies.js";
import { localStorageTypes } from "../../static/js/localstorage/localstorage.types.js";

import usersTable from "../../components/usersTable.js";
import groupRequestsTable from "../../components/groupRequestsTable.js";

export const renderUsersTable = (filter = null) => {
  const usersCountElement = document.getElementById("card-users-count");
  const usersCount = LocalStorage.get(localStorageTypes.USERS).length;
  usersCountElement.innerHTML = `${usersCount}`;

  const userTableElement = document.getElementById("users-table");
  userTableElement.innerHTML = usersTable(filter);
}

export const renderReportsTable = () => {
  const reports = LocalStorage.get(localStorageTypes.REPORTS) || [];
  const postsCountElement = document.getElementById("card-posts-count");
  postsCountElement.innerHTML = `${reports.length}`;
};

export const renderGroupRequestsTable = () => {
  const requestsCountElement = document.getElementById("card-requests-count");
  const requestsCount = LocalStorage.get(localStorageTypes.GROUP_REQUESTS).length;
  requestsCountElement.innerHTML = `${requestsCount}`;

  const requestsTableElement = document.getElementById("requests-table");
  requestsTableElement.innerHTML = groupRequestsTable();
};

export const renderAdminDashboard = () => {
  const { name, last_name } = Cookies.getUser();
  const connectedAsElement = document.getElementById("admin-connected-as");
  connectedAsElement.innerHTML = `<b>${name} ${last_name}</b>`;

  renderUsersTable();
  renderReportsTable();
  renderGroupRequestsTable();
};
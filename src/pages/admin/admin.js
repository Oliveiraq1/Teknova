import usersTable from "../../components/usersTable.js";
import Cookies from "../../static/js/cookies/cookies.js";
import LocalStorage from "../../static/js/localstorage/localstorage.js";
import { localStorageTypes } from "../../static/js/localstorage/localstorage.types.js";

export const renderUsersTable = (filter = null) => {
  const usersCountElement = document.getElementById("card-users-count");
  const usersCount = LocalStorage.get(localStorageTypes.USERS).length;
  usersCountElement.innerHTML = `${usersCount}`;

  const userTableElement = document.getElementById("users-table");
  userTableElement.innerHTML = usersTable(filter);
}

export const renderAdminDashboard = () => {
  const { name, last_name } = Cookies.getUser();
  const connectedAsElement = document.getElementById("admin-connected-as");
  connectedAsElement.innerHTML = `<b>${name} ${last_name}</b>`;

  renderUsersTable();
};
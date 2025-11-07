import users from "../../data/users.js";
import groups from "../../data/groups.js";
import notifications from "../../data/notifications.js";

import { localStorageTypes } from "./localstorage.types.js";

class LocalStorage {
  static get(key) {
    const field = localStorage.getItem(key);
    if (!field) return null;
    return JSON.parse(field);
  }

  static set(key, data) {
    if (typeof data !== "string") {
      localStorage.setItem(key, JSON.stringify(data));
      return;
    }

    localStorage.setItem(key, data);
  }

  static load() {
    const usersField = this.get(localStorageTypes.USERS);
    const groupsField = this.get(localStorageTypes.GROUPS);
    const notificationsField = this.get(localStorageTypes.NOTIFICATIONS);

    if (!usersField) localStorage.setItem(localStorageTypes.USERS, JSON.stringify(users));
    if (!groupsField) localStorage.setItem(localStorageTypes.GROUPS, JSON.stringify(groups));
    if (!notificationsField) localStorage.setItem(localStorageTypes.NOTIFICATIONS, JSON.stringify(notifications));
  }
}

export default LocalStorage;
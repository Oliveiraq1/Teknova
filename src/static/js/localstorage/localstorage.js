import users from "../../data/users.js";
import groups from "../../data/groups.js";
import notifications from "../../data/notifications.js";

import { localStorageTypes } from "./localstorage.types.js";
import posts from "../../data/posts.js";

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
    const postsField = this.get(localStorageTypes.POSTS);

    if (!usersField) this.set(localStorageTypes.USERS, users);
    if (!groupsField) this.set(localStorageTypes.GROUPS, groups);
    if (!notificationsField) this.set(localStorageTypes.NOTIFICATIONS, notifications);
    if (!postsField) this.set(localStorageTypes.POSTS, posts);
  }
}

export default LocalStorage;
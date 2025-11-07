import users from "../../data/users.js";
import groups from "../../data/groups.js";
import notifications from "../../data/notifications.js";

import { localStorageTypes } from "./localstorage.types.js";

class LocalStorage {
  /**
   * @param {string} key - Chave do Localstorage
   * @param {object} value - Valor a adicionar
   */
  static add(key, value) {
    const field = localStorage.getItem(key);
    const newField = JSON.parse(field);

    const data = { id: newField.length, ...value };
    newField.push(data);

    localStorage.setItem(key, JSON.stringify(newField));
    return data;
  }

  /**
   * @param {string} key - Chave do Localstorage
   * @returns {Array|null} Array ou null caso nao encontrado
   */
  static get(key) {
    const field = localStorage.getItem(key);
    if (!field) return null;
    return JSON.parse(field);
  }

  /**
   * 
   * @param {string} key - Chave do Localstorage
   * @param {any} data - Valor
   */
  static set(key, data) {
    if (typeof data !== "string") {
      localStorage.setItem(key, JSON.stringify(data));
      return;
    }

    localStorage.setItem(key, data);
  }

  /**
   * @param {string} key - Nome da chave
   */
  static load() {
    const usersField = this.get(localStorageTypes.USERS);
    const postsField = this.get(localStorageTypes.POSTS);
    const groupsField = this.get(localStorageTypes.GROUPS);
    const notificationsField = this.get(localStorageTypes.NOTIFICATIONS);

    if (!usersField) localStorage.setItem(localStorageTypes.USERS, JSON.stringify(users));
    if (!groupsField) localStorage.setItem(localStorageTypes.GROUPS, JSON.stringify(groups));
    if (!notificationsField) localStorage.setItem(localStorageTypes.NOTIFICATIONS, JSON.stringify(notifications));
  }

  /**
   * 
   * @param {string} groupId - Id do grupo
   * @param {string} postId - Id do post
   * @param {object} comment - Objeto Comentario
   * @returns 
   */
  static groupPostAddComment(groupId, postId, comment) {
    const groups = localStorage.getItem(localStorageTypes.GROUPS);
    const groupArray = JSON.parse(groups);

    const groupIndex = groupArray.findIndex(g => g.id == groupId);
    if (groupIndex == -1) return;

    const postIndex = groupArray[groupIndex].posts.findIndex(p => p.id == postId);
    if (postIndex == -1) return;

    groupArray[groupIndex]
      .posts[postIndex]
      .comments.push(comment);

    localStorage.setItem(localStorageTypes.GROUPS, JSON.stringify(groupArray));
  }
}

export default LocalStorage;
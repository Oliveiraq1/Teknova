import users from "../../data/users.js";
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
   * @param {string} key - Nome da chave
   */
  static load() {
    const usersField = localStorage.getItem(localStorageTypes.USERS);
    const postsField = localStorage.getItem(localStorageTypes.POSTS);

    if (!usersField) localStorage.setItem(localStorageTypes.USERS, JSON.stringify(users));
  }
}

export default LocalStorage;
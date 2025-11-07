import Cookies from "../cookies/cookies.js";
import LocalStorage from "./localstorage.js"
import { localStorageTypes } from "./localstorage.types.js"
import { todayDate } from "../utils/date.utils.js";

/* ======= Users */
export function addUser(user) {
  const users = LocalStorage.get(localStorageTypes.USERS);
  const data = { id: users.length, image_url: `https://api.dicebear.com/7.x/adventurer/svg?seed=${user.name}`, ...user };
  users.push(data);

  LocalStorage.set(localStorageTypes.USERS, users);
  const { image_url, password, ...rest } = data;
  return rest;
}

/* ======= Posts */
export function groupPostAddComment(groupId, postId, comment) {
  const groups = LocalStorage.get(localStorageTypes.GROUPS);
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

/* ======= Notifications */
/**
 * @param {Object} param0 - Objeto de notificacao
 * @param {string} param0.title - Titulo da notificacao
 * @param {string} param0.message - Mensagem da notificacao
 * @param {number[]} param0.target - Usuarios que receberao a notificacao
 * @param {string|null} [param0.moveTo=null] - Titulo da notificacao
 * @returns 
 */
export function createNotification({ title, message, target, moveTo = null }) {
  if (!title || !message || !target) return;

  const data = {
    title,
    message,
    target,
    moveTo,
    date: todayDate()
  }

  const notifications = LocalStorage.get(localStorageTypes.NOTIFICATIONS);
  notifications.push(data);
  LocalStorage.set(localStorageTypes.NOTIFICATIONS, notifications);
}

export function getUserNotifications() {
  const { id: user_id } = Cookies.getUser();
  const notifications = LocalStorage.get(localStorageTypes.NOTIFICATIONS);

  const user_notifications = notifications.filter(notf => notf.target.includes(user_id));
  return user_notifications.length > 0 ? user_notifications : null;
}
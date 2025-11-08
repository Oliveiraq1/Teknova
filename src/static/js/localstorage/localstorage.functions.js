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
export function groupAddPost(groupId, post) {
  const user = Cookies.getUser();
  const groups = LocalStorage.get(localStorageTypes.GROUPS);

  const groupIndex = groups.findIndex(g => g.id == groupId);
  if (groupIndex == -1) return;

  const data = {
    id: groups[groupIndex].posts.length,
    author: {
      id: user.id,
      name: user.name
    },
    comments: [],
    date: todayDate(),
    fake: false,
    image_url: post.image_url,
    likes_count: 0,
    message: post.message,
    title: post.title
  }
  groups[groupIndex]
    .posts.push(data);

  LocalStorage.set(localStorageTypes.GROUPS, groups);
}

export function groupPostAddComment(groupId, postId, comment) {
  const groups = LocalStorage.get(localStorageTypes.GROUPS);

  const groupIndex = groups.findIndex(g => g.id == groupId);
  if (groupIndex == -1) return;

  const postIndex = groups[groupIndex].posts.findIndex(p => p.id == postId);
  if (postIndex == -1) return;

  groups[groupIndex]
    .posts[postIndex]
    .comments.push(comment);

  LocalStorage.set(localStorageTypes.GROUPS, groups);
}

export function feedPostAddComment(postId, comment) {
  const posts = LocalStorage.get(localStorageTypes.POSTS);

  const postIndex = posts.findIndex(p => p.id == postId);
  if (postIndex == -1) return;

  posts[postIndex]
    .comments.push(comment);

  LocalStorage.set(localStorageTypes.POSTS, posts);
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
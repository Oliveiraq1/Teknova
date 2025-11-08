import Cookies from "./cookies/cookies.js";
import LocalStorage from "./localstorage/localstorage.js";
import { localStorageTypes } from "./localstorage/localstorage.types.js";

import {
  groupPostAddComment,
  feedPostAddComment,
  createNotification
} from "../js/localstorage/localstorage.functions.js"

import { renderUsersTable } from "../../pages/admin/admin.js";

/* ======= POST Actions */
function togglePostLike({ userId, postId }) {
  const posts = LocalStorage.get(localStorageTypes.POSTS);

  const likes = posts[postId].likes;
  const liked = likes.includes(userId);

  if (liked) {
    posts[postId].likes = likes.filter(id => id !== userId)
  } else {
    posts[postId].likes.push(userId);
  }

  LocalStorage.set(localStorageTypes.POSTS, posts);
  const likeBtn = document.getElementById(`like-btn-${postId}`);

  const updatedLikes = posts[postId].likes;
  const isNowLiked = updatedLikes.includes(userId);

  likeBtn.src = isNowLiked
    ? "/static/assets/icons/like-filled.svg"
    : "/static/assets/icons/like.svg"
}

function toggleGroupPostLike({ userId, groupId, postId }) {
  const groups = LocalStorage.get(localStorageTypes.GROUPS);
  const groupIndex = groups.findIndex(g => g.id == groupId);
  if (groupIndex == -1) return;

  const likes = groups[groupIndex].posts[postId].likes;
  const liked = likes.includes(userId);

  if (liked) {
    groups[groupIndex].posts[postId].likes = likes.filter(id => id !== userId)
  } else {
    groups[groupIndex].posts[postId].likes.push(userId);
  }

  LocalStorage.set(localStorageTypes.GROUPS, groups);
  const likeBtn = document.getElementById(`like-btn-${postId}`);

  const updatedLikes = groups[groupIndex].posts[postId].likes;
  const isNowLiked = updatedLikes.includes(userId);

  likeBtn.src = isNowLiked
    ? "/static/assets/icons/like-filled.svg"
    : "/static/assets/icons/like.svg"
}

window.openPostComments = function (id) {
  const post = document.getElementById(id);
  if (post.classList.contains("hidden")) return post.classList.remove("hidden");
  post.classList.add("hidden");
}

window.addComment = function addComment(groupId = null, postId, inputId) {
  const input = document.getElementById(inputId);
  const message = input.value.trim();
  if (!message) return;

  const { id, name, image_url } = Cookies.getUser();
  const comment = {
    author: { id, name, image_url },
    message
  }

  input.value = "";
  if (groupId != null) return groupPostAddComment(groupId, postId, { ...comment });
  return feedPostAddComment(postId, { ...comment });
}

window.toggleLike = function toggleLike(groupId, postId) {
  const { id: userId } = Cookies.getUser();
  if (groupId !== null) return toggleGroupPostLike({ userId, groupId, postId });
  return togglePostLike({ userId, postId });
}

window.reportPost = function reportPost(groupId, postId) {
  if (!groupId) return window.alert("Implementar funcao para feed")
  window.alert("Implementar funcao para grupos.")

  const confirm = window.confirm("Tem certeza que deseja denunciar esse post?");
  if (!confirm) return;

  const motivo = window.prompt("Digite o motivo");
  if (motivo) window.alert("Sua denuncia foi enviada para avaliacao de nossos administradores!");
}

/* ======= ADMIN Actions */

/* === TABLES */

/* === USER TABLE */
window.filterUserTable = function filterUserTable() {
  const inputElement = document.getElementById("users-table-filter");
  const filter = inputElement.value;

  if (!filter.trim()) renderUsersTable();

  renderUsersTable(filter);
  inputElement.value = "";
}

window.setAdmin = function (userId) {
  const { name: author_name, last_name: author_last_name } = Cookies.getUser();
  const users = LocalStorage.get(localStorageTypes.USERS);
  const target_user = users[userId];

  const ok = window.confirm(`Voce tem certeza que deseja tornar ${target_user.name} ${target_user.last_name} um administrador?`);
  if (!ok) return;

  users[userId].admin = true;
  LocalStorage.set(localStorageTypes.USERS, users);
  createNotification({
    title: "Mudanca de cargo",
    message: `Parabens, voce se tornou um administrador - by ${author_name} ${author_last_name}`,
    target: [target_user.id],
    moveTo: "#admin"
  })
  window.alert(`Uma notificacao foi enviada a ${target_user.name} ${target_user.last_name}, informando-lhe que agora eh um administrador!`);
  renderUsersTable();
}

window.revokeAdmin = function (userId) {
  const { name: author_name, last_name: author_last_name } = Cookies.getUser();
  const users = LocalStorage.get(localStorageTypes.USERS);
  const target_user = users[userId];

  const ok = window.confirm(`Voce tem certeza que deseja remover o privilegio de administrador de ${target_user.name} ${target_user.last_name}?`);
  if (!ok) return;

  users[userId].admin = false;
  LocalStorage.set(localStorageTypes.USERS, users);
  createNotification({
    title: "Mudanca de cargo",
    message: `Seu direito de administrador foi revogado - by ${author_name} ${author_last_name}`,
    target: [target_user.id],
    moveTo: "#home"
  })
  window.alert(`Uma notificacao foi enviada a ${target_user.name} ${target_user.last_name}, informando-lhe que agora nao eh mais um administrador!`);
  renderUsersTable();
}

window.blockUserAccess = function (userId) {
  const users = LocalStorage.get(localStorageTypes.USERS);
  const user = users[userId];

  const ok = window.confirm(`Voce tem certeza que deseja bloquear o acesso de ${user.name} ${user.last_name}?`);
  if (!ok) return;

  users[userId].active = false;
  if (users[userId].admin) users[userId].admin = false;

  LocalStorage.set(localStorageTypes.USERS, users);
  window.alert(`O acesso de ${user.name} ${user.last_name} foi removido!`);
  renderUsersTable();
}

window.unblockUserAccess = function (userId) {
  const users = LocalStorage.get(localStorageTypes.USERS);
  const user = users[userId];

  const ok = window.confirm(`Voce tem certeza que deseja desbloquear o acesso de ${user.name} ${user.last_name}?`);
  if (!ok) return;

  users[userId].active = true;
  LocalStorage.set(localStorageTypes.USERS, users);
  window.alert(`O acesso de ${user.name} ${user.last_name} foi desbloqueado!`);
  renderUsersTable();
}
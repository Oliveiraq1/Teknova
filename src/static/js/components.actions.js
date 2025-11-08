import Cookies from "./cookies/cookies.js";
import LocalStorage from "./localstorage/localstorage.js";
import { localStorageTypes } from "./localstorage/localstorage.types.js";

import {
  groupPostAddComment,
  feedPostAddComment,
  createNotification,
} from "../js/localstorage/localstorage.functions.js"

import {
  renderUsersTable,
  renderGroupRequestsTable
} from "../../pages/admin/admin.js";

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

function reportFeedPost(postId) {
  const warningElement = document.getElementById(`report-btn-${postId}`);
  const { id: user_id } = Cookies.getUser();

  const posts = LocalStorage.get(localStorageTypes.POSTS);
  const reports = LocalStorage.get(localStorageTypes.REPORTS) || [];
  const reportIndex = reports.findIndex(r => !r.group && r.post?.id === postId);

  posts[postId].denounces = posts[postId].denounces || [];
  posts[postId].denounces.push(user_id);
  LocalStorage.set(localStorageTypes.POSTS, posts);

  warningElement.src = "/static/assets/icons/warning-filled.svg";
  warningElement.setAttribute("onclick", `removeReportPost(null, ${postId})`);

  if (reportIndex !== -1) {
    reports[reportIndex].denounces.push(user_id);
    LocalStorage.set(localStorageTypes.REPORTS, reports);
    return;
  }

  const post = posts[postId];
  const data = {
    group: null,
    post: {
      id: post.id,
      title: post.title,
      message: post.message,
      image_url: post.image_url,
      author: {
        id: post.author.id,
        fullname: post.author.fullname
      }
    },
    denounces: [user_id]
  };

  reports.push(data);
  LocalStorage.set(localStorageTypes.REPORTS, reports);
}

function removeReportFeedPost(postId) {
  const warningElement = document.getElementById(`report-btn-${postId}`);
  const { id: user_id } = Cookies.getUser();

  const posts = LocalStorage.get(localStorageTypes.POSTS);
  const reports = LocalStorage.get(localStorageTypes.REPORTS) || [];
  const reportIndex = reports.findIndex(r => !r.group && r.post?.id === postId);

  const postDenounces = posts[postId].denounces || [];
  posts[postId].denounces = postDenounces.filter(id => id !== user_id);
  LocalStorage.set(localStorageTypes.POSTS, posts);

  warningElement.src = "/static/assets/icons/warning.svg";
  warningElement.setAttribute("onclick", `reportPost(null, ${postId})`);

  if (reportIndex !== -1) {
    const reportDenounces = reports[reportIndex].denounces || [];
    reports[reportIndex].denounces = reportDenounces.filter(id => id !== user_id);

    if (reports[reportIndex].denounces.length === 0) {
      reports.splice(reportIndex, 1);
    }

    LocalStorage.set(localStorageTypes.REPORTS, reports);
  }
}

function reportGroupPost(groupId, postId) {
  const warningElement = document.getElementById(`report-btn-${postId}`);
  const { id: user_id } = Cookies.getUser();

  const groups = LocalStorage.get(localStorageTypes.GROUPS);
  const reports = LocalStorage.get(localStorageTypes.REPORTS);
  const reportIndex = reports.findIndex(r => r.group?.id === groupId && r.post?.id === postId);

  groups[groupId].posts[postId].denounces.push(user_id);
  LocalStorage.set(localStorageTypes.GROUPS, groups);

  warningElement.src = "/static/assets/icons/warning-filled.svg";
  warningElement.setAttribute("onclick", `removeReportPost(${groupId}, ${postId})`);

  if (reportIndex != -1) {
    reports[reportIndex].denounces.push(user_id);
    LocalStorage.set(localStorageTypes.REPORTS, reports);
    return;
  }

  const post = groups[groupId].posts[postId];
  const data = {
    group: {
      id: groupId,
      name: groups[groupId].name
    },
    post: {
      id: post.id,
      title: post.title,
      message: post.message,
      image_url: post.image_url,
      author: {
        id: post.author.id,
        fullname: post.author.fullname
      }
    },
    denounces: [user_id]
  }

  reports.push(data);
  LocalStorage.set(localStorageTypes.REPORTS, reports);
};

function removeReportGroupPost(groupId, postId) {
  const warningElement = document.getElementById(`report-btn-${postId}`);
  const { id: user_id } = Cookies.getUser();

  const groups = LocalStorage.get(localStorageTypes.GROUPS);
  const reports = LocalStorage.get(localStorageTypes.REPORTS);
  const reportIndex = reports.findIndex(r => r.group?.id === groupId && r.post?.id === postId);

  const postDenounces = groups[groupId].posts[postId].denounces || [];
  groups[groupId].posts[postId].denounces = postDenounces.filter(id => id !== user_id);
  LocalStorage.set(localStorageTypes.GROUPS, groups);

  warningElement.src = "/static/assets/icons/warning.svg";
  warningElement.setAttribute("onclick", `reportPost(${groupId}, ${postId})`);

  if (reportIndex !== -1) {
    const reportDenounces = reports[reportIndex].denounces || [];
    reports[reportIndex].denounces = reportDenounces.filter(id => id !== user_id);

    if (reports[reportIndex].denounces.length === 0) {
      reports.splice(reportIndex, 1);
    }

    LocalStorage.set(localStorageTypes.REPORTS, reports);
  }
}

window.reportPost = function reportPost(groupId = null, postId) {
  const ok = window.confirm("Voce tem certeza que deseja denunciar essa postagem?");
  if (!ok) return;

  if (!groupId) return reportFeedPost(postId);
  return reportGroupPost(groupId, postId);
}

window.removeReportPost = function removeReportPost(groupId = null, postId) {
  const ok = window.confirm("Voce tem certeza que deseja remover a denuncia dessa postagem?");
  if (!ok) return;

  if (!groupId) return removeReportFeedPost(postId);
  return removeReportGroupPost(groupId, postId);
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

/* REPORT TABLE */

/* REQUESTS TABLE */
window.approveGroupRequest = (id) => {
  const requests = LocalStorage.get(localStorageTypes.GROUP_REQUESTS) || [];
  const request = requests.find(r => r.id === id);
  if (!request) return;

  const groupId = request.group.id;
  const groupName = request.group.name;
  const userId = request.user.id;

  const groups = LocalStorage.get(localStorageTypes.GROUPS);
  groups[groupId].users_id.push(userId);

  const updatedRequests = requests.filter(r => r.id !== id);
  LocalStorage.set(localStorageTypes.GROUP_REQUESTS, updatedRequests);
  LocalStorage.set(localStorageTypes.GROUPS, groups);

  createNotification({
    title: "Entrada de grupo",
    message: `Seu pedido para entrar no grupo ${groupName}, foi aceito!`,
    moveTo: `#group?id=${groupId}`,
    target: [userId]
  })

  window.alert("Uma notificacao foi enviada ao usuario, informando que a permissao foi concedida!");
  renderGroupRequestsTable();
};

window.denyGroupRequest = (id) => {
  const requests = LocalStorage.get(localStorageTypes.GROUP_REQUESTS) || [];
  const request = requests.find(r => r.id === id);
  const updatedRequests = requests.filter(r => r.id !== id);

  const userId = request.user.id;
  const groupName = request.group.name;

  createNotification({
    title: "Entrada de grupo",
    message: `Seu pedido para entrar no grupo ${groupName}, foi negado!`,
    moveTo: null,
    target: [userId]
  })

  LocalStorage.set(localStorageTypes.GROUP_REQUESTS, updatedRequests);
  window.alert("Uma notificacao foi enviada ao usuario, informando que a permissao foi negada!");
  renderGroupRequestsTable();
};
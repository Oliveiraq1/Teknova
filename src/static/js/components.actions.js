import Cookies from "./cookies/cookies.js";
import LocalStorage from "./localstorage/localstorage.js";
import { localStorageTypes } from "./localstorage/localstorage.types.js";

import {
  groupPostAddComment,
  feedPostAddComment,
  createNotification,
} from "../js/localstorage/localstorage.functions.js"

import {
  showNotifications
} from "../../pages/notifications/notifications.js";

import {
  renderUsersTable,
  renderGroupRequestsTable,
  renderReportsTable,
  renderGroupsTable
} from "../../pages/admin/admin.js";
import { cookieTypes } from "./cookies/cookie.types.js";

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

window.reportPost = function reportPost(groupId = null, postId) {
  if (groupId === 'null' || groupId === null) {
    groupId = null;
  } else {
    groupId = parseInt(groupId);
  }
  postId = parseInt(postId);

  const ok = window.confirm("Você tem certeza que deseja denunciar essa postagem?");
  if (!ok) return;

  const { id: user_id } = Cookies.getUser();
  const reports = LocalStorage.get(localStorageTypes.REPORTS) || [];
  const warningElement = document.getElementById(`report-btn-${postId}`);

  let post = null;
  let group = null;

  if (groupId === null) {
    const posts = LocalStorage.get(localStorageTypes.POSTS);

    post = posts[postId];
    if (!post) return;

    post.denounces = post.denounces || [];
    post.denounces.push(user_id);
    LocalStorage.set(localStorageTypes.POSTS, posts);
  } else {
    const groups = LocalStorage.get(localStorageTypes.GROUPS);
    group = groups.find(g => g.id === groupId);
    if (!group) return;

    post = group.posts[postId];
    if (!post) return;

    post.denounces = post.denounces || [];
    post.denounces.push(user_id);
    LocalStorage.set(localStorageTypes.GROUPS, groups);
  }

  warningElement.src = "/static/assets/icons/warning-filled.svg";
  warningElement.setAttribute("onclick", `removeReportPost(${groupId}, ${postId})`);

  const reportIndex = reports.findIndex(r =>
    r.post.id === postId && (r.group?.id || null) === groupId
  );

  if (reportIndex !== -1) {
    reports[reportIndex].denounces.push(user_id);
  } else {
    reports.push({
      group: group ? { id: group.id, name: group.name } : null,
      post: {
        id: postId,
        title: post.title,
        message: post.message,
        image_url: post.image_url,
        author: {
          id: post.author.id,
          fullname: post.author.fullname
        }
      },
      denounces: [user_id]
    });
  }

  LocalStorage.set(localStorageTypes.REPORTS, reports);
};

window.removeReportPost = function removeReportPost(groupId = null, postId) {
  if (groupId === 'null' || groupId === null) {
    groupId = null;
  } else {
    groupId = parseInt(groupId);
  }
  postId = parseInt(postId);

  const ok = window.confirm("Você tem certeza que deseja remover a denúncia dessa postagem?");
  if (!ok) return;

  const { id: user_id } = Cookies.getUser();
  const reports = LocalStorage.get(localStorageTypes.REPORTS) || [];
  const warningElement = document.getElementById(`report-btn-${postId}`);

  let post = null;

  if (groupId === null) {
    const posts = LocalStorage.get(localStorageTypes.POSTS);
    post = posts[postId];
    if (!post) return;

    post.denounces = (post.denounces || []).filter(id => id !== user_id);
    LocalStorage.set(localStorageTypes.POSTS, posts);
  } else {
    const groups = LocalStorage.get(localStorageTypes.GROUPS);
    const group = groups.find(g => g.id === groupId);
    if (!group || !group.posts[postId]) return;

    post = group.posts[postId];
    post.denounces = (post.denounces || []).filter(id => id !== user_id);
    LocalStorage.set(localStorageTypes.GROUPS, groups);
  }

  warningElement.src = "/static/assets/icons/warning.svg";
  warningElement.setAttribute("onclick", `reportPost(${groupId === null ? "'null'" : groupId}, '${postId}')`);

  const reportIndex = reports.findIndex(r => {
    const samePost = r.post.id === postId;
    const reportGroupId = r.group ? r.group.id : null;
    const sameGroup = reportGroupId === groupId;
    return samePost && sameGroup;
  });

  if (reportIndex !== -1) {
    reports[reportIndex].denounces = reports[reportIndex].denounces.filter(id => id !== user_id);
    if (reports[reportIndex].denounces.length === 0) {
      reports.splice(reportIndex, 1);
    }
    LocalStorage.set(localStorageTypes.REPORTS, reports);
  }
};

/* ======= Notifications */
window.markNotificationAsSaw = function markNotificationAsSaw(id, moveTo) {
  const { id: userId } = Cookies.getUser();
  const notifications = LocalStorage.get(localStorageTypes.NOTIFICATIONS);
  const updated = notifications.map(n => {

    if (n.id == id) return { ...n, saw: [...new Set([...n.saw, userId])] };
    return n;
  });

  LocalStorage.set(localStorageTypes.NOTIFICATIONS, updated);
  moveTo == "null" ? window.location.reload() : window.location.href = moveTo;
}

window.deleteNotification = function deleteNotification(id) {
  const confirmDelete = window.confirm("Tem certeza que deseja excluir esta notificação?");
  if (!confirmDelete) return;

  const { id: userId } = Cookies.getUser();

  const notifications = LocalStorage.get(localStorageTypes.NOTIFICATIONS);
  const updated = notifications.map(n => {
    if (n.id == id) {
      const newTarget = n.target.filter(t => t !== userId);
      const newSaw = n.saw.filter(s => s !== userId);
      return { ...n, target: newTarget, saw: newSaw };
    }
    return n;
  }).filter(n => n.target.length > 0);

  LocalStorage.set(localStorageTypes.NOTIFICATIONS, updated);
  showNotifications();
}

window.deleteSawNotifications = () => {
  const confirmDelete = window.confirm("Tem certeza que deseja excluir todas as notificações vistas?");
  if (!confirmDelete) return;

  const { id: userId } = Cookies.getUser();

  const notifications = LocalStorage.get(localStorageTypes.NOTIFICATIONS);
  const updated = notifications.map(n => {
    const saw = n.saw;
    if (saw.includes(userId)) {
      const newTarget = n.target.filter(t => t != userId);
      const newSaw = saw.filter(s => s !== userId);
      return { ...n, target: newTarget, saw: newSaw };
    }
    return n;
  }).filter(n => n.target.length > 0);

  LocalStorage.set(localStorageTypes.NOTIFICATIONS, updated);
  showNotifications();
}

/* ======= ADMIN Actions */

/* === NOTIFICATIONS */
function parseNotf(str) {
  const input = str.trim();
  const users = LocalStorage.get(localStorageTypes.USERS);

  if (/^\s*all\s*$/i.test(str)) {
    return users.map(u => u.id);
  }

  if (/^\s*\d+(\s*,\s*\d+)*\s*$/.test(str)) {
    return input.split(",")
      .map(s => s.trim())
      .map(Number);
  }

  return null;
}

window.generateNotification = function generateNotification() {
  const title = window.prompt("Informe o titulo da notificacao:").trim();
  if (!title) return;

  const message = window.prompt("Informe a mensagem da notificacao:").trim();
  if (!message) return window.alert("A mensagem nao pode estar vazia. Tente novamente!");

  const targetStr = window.prompt("Informe o id dos usuarios que devem receber a notificacao (e.g.: all / 1,2,3,4):");
  if (!targetStr) return window.alert("Campo nao pode estar vazio. Tente novamente!");

  const target = parseNotf(targetStr);
  if (!target) return window.alert("Por favor, informe um valor valido!\n- all: para todos\n- 1,2,3,4: ids");

  createNotification({
    title, message, target, moveTo: null
  });
}

/* === USER TABLE */
window.filterUserTable = function filterUserTable() {
  const inputElement = document.getElementById("users-table-filter");
  const filter = inputElement.value;

  if (!filter.trim()) renderUsersTable();

  renderUsersTable(filter);
  inputElement.value = "";
}

window.filterGroupsTable = function filterGroupsTable() {
  const inputElement = document.getElementById("groups-table-filter");
  const filter = inputElement.value;

  if (!filter.trim()) renderGroupsTable();

  renderGroupsTable(filter);
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
window.markAsFake = function markAsFake(groupId, postId) {
  groupId = groupId === 'null' ? null : parseInt(groupId);
  postId = parseInt(postId);

  if (groupId === null) {
    const posts = LocalStorage.get(localStorageTypes.POSTS) || [];
    if (posts[postId]) {
      posts[postId].fake = true;
      LocalStorage.set(localStorageTypes.POSTS, posts);
    }
  } else {
    const groups = LocalStorage.get(localStorageTypes.GROUPS) || [];
    const group = groups.find(g => g.id === groupId);
    if (group && group.posts[postId]) {
      group.posts[postId].fake = true;
      LocalStorage.set(localStorageTypes.GROUPS, groups);
    }
  }

  const reports = LocalStorage.get(localStorageTypes.REPORTS) || [];
  const updatedReports = reports.filter(report => {
    const samePost = report.post.id === postId;
    const reportGroupId = report.group ? report.group.id : null;
    const sameGroup = reportGroupId === groupId;
    return !(samePost && sameGroup);
  });
  LocalStorage.set(localStorageTypes.REPORTS, updatedReports);

  renderReportsTable();
};

window.deletePost = function deletePost(groupId, postId) {
  groupId = groupId === 'null' ? null : parseInt(groupId);
  postId = parseInt(postId);

  const reports = LocalStorage.get(localStorageTypes.REPORTS) || [];
  const updatedReports = reports.filter(report => {
    const samePost = report.post.id === postId;
    const reportGroupId = report.group ? report.group.id : null;
    const sameGroup = reportGroupId === groupId;
    return !(samePost && sameGroup);
  });
  LocalStorage.set(localStorageTypes.REPORTS, updatedReports);

  if (groupId === null) {
    const posts = LocalStorage.get(localStorageTypes.POSTS) || [];
    if (posts[postId]) {
      posts.splice(postId, 1);
      LocalStorage.set(localStorageTypes.POSTS, posts);
    }
  } else {
    const groups = LocalStorage.get(localStorageTypes.GROUPS) || [];
    const group = groups.find(g => g.id === groupId);
    if (group && group.posts[postId]) {
      group.posts.splice(postId, 1);
      LocalStorage.set(localStorageTypes.GROUPS, groups);
    }
  }

  renderReportsTable();
};

window.revokeDenounce = function revokeDenounce(groupId, postId) {
  groupId = groupId === 'null' || groupId === null ? null : parseInt(groupId);
  postId = parseInt(postId);

  const reports = LocalStorage.get(localStorageTypes.REPORTS) || [];

  if (groupId === null) {
    const posts = LocalStorage.get(localStorageTypes.POSTS) || [];
    if (posts[postId]) {
      posts[postId].denounces = [];
      LocalStorage.set(localStorageTypes.POSTS, posts);
    }
  } else {
    const groups = LocalStorage.get(localStorageTypes.GROUPS) || [];
    const group = groups.find(g => g.id === groupId);
    if (group && group.posts[postId]) {
      group.posts[postId].denounces = [];
      LocalStorage.set(localStorageTypes.GROUPS, groups);
    }
  }

  const updatedReports = reports.filter(report => {
    const samePost = report.post.id === postId;
    const reportGroupId = report.group ? report.group.id : null;
    const sameGroup = reportGroupId === groupId;
    return !(samePost && sameGroup);
  });

  LocalStorage.set(localStorageTypes.REPORTS, updatedReports);
  renderReportsTable();
};

/* GROUPS TABLE */
window.createCommunity = function createCommunity() {
  const groups = LocalStorage.get(localStorageTypes.GROUPS);
  const groupsNames = groups.map(g => g.name.toLowerCase());

  const communityName = window.prompt("Digite o nome da comunidade:").trim();
  if (!communityName) return;
  if (groupsNames.includes(communityName.toLowerCase())) return window.alert("Ja existe uma comunidade com esse nome!");

  const privateCommunity = window.prompt("A comunidade sera privada? (y/n)").trim().toLowerCase()[0];
  const correctAnswer = ["y", "n"].some(t => privateCommunity.includes(t));

  if (!correctAnswer) return window.alert("Valor invalido, tente novamente!");

  const data = {
    id: groups[groups.length - 1].id + 1,
    banner_url: "",
    image_url: `https://ui-avatars.com/api/?name=${communityName}`,
    name: communityName,
    posts: [],
    private: privateCommunity == "y" ? true : false,
    users_id: []
  }

  groups.push(data);
  LocalStorage.set(localStorageTypes.GROUPS, groups);
  window.alert(`Comunidade ${communityName} criada com sucesso!`);
  renderGroupsTable();
}

window.deleteGroup = (id) => {
  const groups = LocalStorage.get(localStorageTypes.GROUPS);
  const group = groups[id];

  const ok = window.confirm(`Voce tem certeza que deseja deletar o grupo ${group.name}?`);
  if (!ok) return;

  const target = group.users_id;
  const updatedGroups = groups.filter(g => g.id != id);

  createNotification({
    title: `Comunidade ${group.name}`,
    message: `A comunidade foi excluida pelos administradores!`,
    target,
    moveTo: null
  })

  const requests = LocalStorage.get(localStorageTypes.GROUP_REQUESTS);
  const updatedRequests = requests.filter(r => r.group.id != id);

  LocalStorage.set(localStorageTypes.GROUPS, updatedGroups);
  LocalStorage.set(localStorageTypes.GROUP_REQUESTS, updatedRequests);
  window.alert(`Comunidade ${group.name} deletada com sucesso! Todos os antigos membros foram informados.`);
  renderGroupsTable();
  renderGroupRequestsTable();
}

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
    target: [userId],
  })

  LocalStorage.set(localStorageTypes.GROUP_REQUESTS, updatedRequests);
  window.alert("Uma notificacao foi enviada ao usuario, informando que a permissao foi negada!");
  renderGroupRequestsTable();
};

/* ======= PROFILE */
window.changeName = function changeName() {
  const user = Cookies.getUser();
  const users = LocalStorage.get(localStorageTypes.USERS);
  const newName = window.prompt("Digite o novo nome:");

  if (!newName) return;

  const confirm = window.confirm(`Tem certeza que deseja alterar seu nome para "${newName}"?`);
  if (!confirm) return;

  users[user.id].name = newName;

  const authData = {
    id: user.id,
    name: newName,
    last_name: user.last_name,
    cpf: user.cpf,
    email: user.email,
    admin: user.admin,
    birthdate: user.birthdate,
    active: user.active
  }

  Cookies.delete(cookieTypes.AUTHENTICATION);
  Cookies.set(cookieTypes.AUTHENTICATION, JSON.stringify(authData));
  LocalStorage.set(localStorageTypes.USERS, users);

  window.alert("Nome alterado com sucesso!");
  window.location.reload();
}

window.changeLastName = function changeLastName() {
  const user = Cookies.getUser();
  const users = LocalStorage.get(localStorageTypes.USERS);
  const newName = window.prompt("Digite o novo nome:");

  if (!newName) return;

  const confirm = window.confirm(`Tem certeza que deseja alterar seu ultimo nome para "${newName}"?`);
  if (!confirm) return;

  users[user.id].last_name = newName;

  const authData = {
    id: user.id,
    name: user.name,
    last_name: newName,
    cpf: user.cpf,
    email: user.email,
    admin: user.admin,
    birthdate: user.birthdate,
    active: user.active
  }

  Cookies.delete(cookieTypes.AUTHENTICATION);
  Cookies.set(cookieTypes.AUTHENTICATION, JSON.stringify(authData));
  LocalStorage.set(localStorageTypes.USERS, users);

  window.alert("Ultimo nome alterado com sucesso!");
  window.location.reload();
}

window.changeImageUrl = function changeImageUrl() {
  const user = Cookies.getUser();
  const users = LocalStorage.get(localStorageTypes.USERS);
  const newUrl = window.prompt("Digite a nova URL da imagem de perfil:");

  if (!newUrl) return;

  const confirm = window.confirm(`Tem certeza que deseja alterar sua imagem de perfil para "${newUrl}"?`);
  if (!confirm) return;

  users[user.id].image_url = newUrl;
  LocalStorage.set(localStorageTypes.USERS, users);

  window.alert("Imagem de perfil alterada com sucesso!");
  window.location.reload();
}

window.changePassword = function changePassword() {
  const user = Cookies.getUser();
  const users = LocalStorage.get(localStorageTypes.USERS);

  const currentPass = window.prompt("Digite sua senha atual:");
  if (!currentPass || currentPass !== users[user.id].password) {
    window.alert("Senha atual incorreta.");
    return;
  }

  const newPassword = window.prompt("Digite a nova senha:");
  if (!newPassword) return;

  const confirm = window.confirm("Tem certeza que deseja alterar sua senha?");
  if (!confirm) return;

  users[user.id].password = newPassword;
  LocalStorage.set(localStorageTypes.USERS, users);

  window.alert("Senha alterada com sucesso!");
  window.location.reload();
}

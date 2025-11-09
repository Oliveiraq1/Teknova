import Cookies from "./cookies/cookies.js";
import LocalStorage from "./localstorage/localstorage.js";
import { cookieTypes } from "./cookies/cookie.types.js";
import { localStorageTypes } from "./localstorage/localstorage.types.js";
import { checkYears } from "./utils/date.utils.js";
import { addUser, groupAddPost } from "./localstorage/localstorage.functions.js";

/* ======= AUTENTICACAO */
window.login = function login(e) {
  e.preventDefault();

  const cpf = document.getElementById("cpf").value;
  const password = document.getElementById("password").value;

  const users = LocalStorage.get(localStorageTypes.USERS);
  const user = users.find(u => u.cpf == cpf);
  if (!user) return window.alert("Credenciais invalidas!");
  if (password != user.password) return window.alert("Credenciais invalidas!");

  const { password: _, image_url: __, ...authData } = user;
  Cookies.set(cookieTypes.AUTHENTICATION, JSON.stringify({ ...authData }));
  window.location.hash = "#home";
}

window.register = function register(e) {
  e.preventDefault();

  const name = document.getElementById("name").value;
  const last_name = document.getElementById("last_name").value;
  const cpf = document.getElementById("cpf").value;
  const email = document.getElementById("email").value;
  const birthdate = document.getElementById("birthdate").value;
  const password = document.getElementById("password").value;

  const users = LocalStorage.get(localStorageTypes.USERS);
  const cpfUsed = users.find(user => user.cpf == cpf);
  const emailUsed = users.find(user => user.email == email);
  const greatherThan18 = checkYears(birthdate, 18);

  if (cpfUsed) return window.alert("CPF ja cadastrado");
  if (emailUsed) return window.alert("Email ja cadastrado");
  if (!greatherThan18) return window.alert("Voce precisar ter 18 anos ou mais!");

  const user = addUser({ name, last_name, cpf, email, password, birthdate, admin: false, active: true });
  Cookies.set(cookieTypes.AUTHENTICATION, JSON.stringify({ ...user }));
  window.location.hash = "#home";
}

window.logout = function logout() {
  Cookies.delete(cookieTypes.AUTHENTICATION);
  window.alert("Deslogou com sucesso!");
  window.location.hash = "#login";
}

window.changePasswordFileType = function changePasswordFileType(id) {
  const input = document.getElementById(id);
  const icon = document.getElementById(`eyeIcon-${id}`);

  if (!input || !icon) return;
  if (input.type === "text") {
    input.type = "password";
    icon.src = "/static/assets/icons/password-eye.svg";
  } else {
    input.type = "text";
    icon.src = "/static/assets/icons/password-eye-slash.svg";
  }
}

/* ======= Feed & Grupos */
window.homeSearchKeyDown = function homeSearchKeyDown(e) {
  if (e.key !== "Enter") return;
  const homeSearchElement = document.getElementById("home-search");

  console.log(homeSearchElement.value);
  homeSearchElement.value = "";
}

window.closeSideBar = function closeSideBar() {
  const sidebarOverlayElement = document.getElementById("sidebar-overlay");
  const sidebarWrapperElement = document.getElementById("sidebar-wrapper");

  sidebarOverlayElement.classList.remove("visible");
  sidebarOverlayElement.classList.add("hidden");
  sidebarWrapperElement.classList.remove("open");
}

window.openSidebar = function openSidebar() {
  const sidebarOverlayElement = document.getElementById("sidebar-overlay");
  const sidebarWrapperElement = document.getElementById("sidebar-wrapper");

  sidebarOverlayElement.classList.add("visible");
  sidebarOverlayElement.classList.remove("hidden");
  sidebarWrapperElement.classList.add("open");
}

window.hide = function hide() {
  document.getElementById("lupa").style.display = "none"
  document.getElementById("search").placeholder = ""
}

window.show = function show() {
  if (document.getElementById("search").value == "") {
    document.getElementById("lupa").style.display = ""
  }
  document.getElementById("search").placeholder = "     Buscar"
}

window.search = function search() {

}

/* ======= Posts */
window.openPostModal = function openPostModal() {
  const modal = document.getElementById("post-modal");
  modal.classList.contains("hidden")
    ? modal.classList.remove("hidden")
    : modal.classList.add("hidden");
}

window.createPost = function createPost(groupId) {
  if (!groupId) return;

  const title = document.getElementById("post-modal-title").value;
  const message = document.getElementById("post-modal-message").value;
  const image_url = document.getElementById("post-modal-image_url").value;

  if (!title || !message || !image_url) return window.alert("Por favor, informe todos os campos!");

  const groups = LocalStorage.get(localStorageTypes.GROUPS, localStorageTypes.GROUPS);
  const groupIndex = groups.findIndex(g => g.id == groupId);
  if (groupIndex == -1) return;

  groupAddPost(groupId, { title, message, image_url });
  window.alert("Post adicionado com sucesso!")
  window.location.reload();
}

window.groupRequest = function groupRequest(groupId) {
  const { id: user_id, name, last_name } = Cookies.getUser();
  const groups = LocalStorage.get(localStorageTypes.GROUPS);
  const requests = LocalStorage.get(localStorageTypes.GROUP_REQUESTS);

  const pendingRequest = requests.find(r => r.user.id == user_id && r.group.id == groupId);
  if (pendingRequest) {
    window.alert("Ja ha um pedido seu em analise!");
    return;
  }

  const { name: group_name } = groups[groupId];
  const data = {
    id: requests.length,
    user: {
      id: user_id,
      fullname: `${name} ${last_name}`
    },
    group: {
      id: groupId,
      name: group_name
    }
  }

  requests.push(data);
  LocalStorage.set(localStorageTypes.GROUP_REQUESTS, requests);
  window.alert("Pedido feito com sucesso. Em breve voce sera informado(a) do status de sua solicitacao!");
}

/* ======= Grupos */
window.joinPublicGroup = function joinPublicGroup(groupId) {
  const user = Cookies.getUser();
  const groups = LocalStorage.get(localStorageTypes.GROUPS);
  const groupIndex = groups.findIndex(g => g.id == groupId);

  groups[groupIndex]
    .users_id.push(user.id);

  LocalStorage.set(localStorageTypes.GROUPS, groups);

  window.location.reload();
  window.alert(`Bem-vindo(a) ao grupo ${groups[groupIndex].name}`);
}

window.leaveGroup = function leaveGroup(groupId) {
  const user = Cookies.getUser();
  const groups = LocalStorage.get(localStorageTypes.GROUPS);
  const groupIndex = groups.findIndex(g => g.id == groupId);

  const group = groups[groupIndex];
  const userIndex = group.users_id.indexOf(user.id);

  if (userIndex === -1) {
    window.alert("Você não está neste grupo.");
    return;
  }

  group.users_id.splice(userIndex, 1);

  LocalStorage.set(localStorageTypes.GROUPS, groups);

  window.location.reload();
  window.alert(`Você saiu do grupo ${group.name}`);
}

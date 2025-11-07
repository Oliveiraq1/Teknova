import Cookies from "./cookies/cookies.js";
import LocalStorage from "./localstorage/localstorage.js";
import { cookieTypes } from "./cookies/cookie.types.js";
import { localStorageTypes } from "./localstorage/localstorage.types.js";
import { checkYears } from "./utils/date.utils.js";
import { addUser } from "./localstorage/localstorage.functions.js";

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

  const user = addUser({ name, last_name, cpf, email, password });
  Cookies.set(cookieTypes.AUTHENTICATION, JSON.stringify({ ...user }));
  window.location.hash = "#home";
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

/* ======= Grupos */

window.createPost = function createPost(groupId) {
  window.alert("Funcao a ser implementada")
}

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

window.joinRequest = function joinRequest(groupId) {
  window.alert("Funcao a ser implementada");
  window.location.hash = "#home";
}
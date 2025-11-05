import { cookieTypes } from "./cookies/cookie.types.js";
import Cookies from "./cookies/cookies.js";
import LocalStorage from "./localstorage/localstorage.js";
import { localStorageTypes } from "./localstorage/localstorage.types.js";
import { checkYears } from "./utils/checkYears.js";

/* ======= AUTENTICACAO */
window.login = function login(e) {
  e.preventDefault();

  const cpf = document.getElementById("cpf").value;
  const password = document.getElementById("password").value;

  const users = LocalStorage.get(localStorageTypes.USERS);
  const user = users.find(u => u.cpf == cpf);
  if (!user) return window.alert("Credenciais invalidas!");

  const { password: _, ...authData } = user;
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

  const user = LocalStorage.add(localStorageTypes.USERS, {
    name, last_name, cpf, email, password
  });

  const { password: _, ...authData } = user;
  Cookies.set(cookieTypes.AUTHENTICATION, JSON.stringify({ ...authData }));
  window.location.hash = "#home";
}

window.changePasswordFileType = function changePasswordFileType(id) {
  const input = document.getElementById(id);
  const icon = document.getElementById(`eyeIcon-${id}`);

  if (!input || !icon) return;
  1
  if (input.type === "text") {
    input.type = "password";
    icon.src = "/static/assets/icons/password-eye.svg";
  } else {
    input.type = "text";
    icon.src = "/static/assets/icons/password-eye-slash.svg";
  }
}

/* ======= ... */
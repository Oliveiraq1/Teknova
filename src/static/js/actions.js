import { users } from "../data/users.js";
import { cookieTypes } from "./cookies/cookie.types.js";
import Cookies from "./cookies/cookies.js";

/* ======= AUTENTICACAO */
window.login = function login(e) {
  e.preventDefault();

  const cpf = document.getElementById("cpf").value;
  const password = document.getElementById("password").value;
  if (!cpf || !password) return window.alert("Por favor, preencha todos os campos!");

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

  console.log({
    name, last_name, cpf, email, birthdate, password
  })
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
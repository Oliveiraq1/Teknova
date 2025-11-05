import Cookies from "./cookies.js";
import { cookieTypes } from "../@types/cookie.types.js";

import { users } from "../data/users.js";

export function onSubmitLogin(e) {
  e.preventDefault();
  const cpf = document.getElementById("cpf").value;
  const password = document.getElementById("password").value;

  const user = users.find(u => u.cpf == cpf);
  if (user && password == user.password) {
    Cookies.set(cookieTypes.AUTHENTICATION, JSON.stringify({ id: user.id }));
    window.location.hash = "#home";
  }
}

export function onSubmitRegister(e) {
  e.preventDefault();
  const first_name = document.getElementById("first_name").value;
  const last_name = document.getElementById("last_name").value;
  const cpf = document.getElementById("cpf").value;

  const email = document.getElementById("email").value;

  const birthdate = document.getElementById("birthdate").value;
  const password = document.getElementById("password").value;

  console.log({
    first_name,
    last_name,
    cpf,
    email,
    birthdate,
    password
  })
}
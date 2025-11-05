import Input from "./Input/index.js";

const LoginForm = () => {
  return (`
    <form method="POST" class="lrs-form" onsubmit="onSubmitLogin(event)">
      ${Input({ label: "CPF", id: "cpf" })}
      ${Input({ label: "Senha", id: "password", type: "password" })}
      <button type="submit">Login</button>
    </form>
  `)
}

const RegisterForm = () => {
  return (`
    <form method="POST" class="lrs-form" onsubmit="onSubmitRegister(event)">
      <div class="lr-name-section">
        ${Input({ label: "Primeiro nome", id: "first_name" })}
        ${Input({ label: "Último nome", id: "last_name" })}
      </div>
      ${Input({ label: "CPF", id: "cpf" })}
      ${Input({ label: "Email", id: "email", type: "email" })}
      ${Input({ label: "Nascimento", id: "birthdate", type: "date" })}
      ${Input({ label: "Senha", id: "password", type: "password" })}
      <button type="submit">Registrar</button>
    </form>
  `)
}

const LoginRegisterSelector = (selected = "login") => {
  return (`
    <div class="lrs-container">
      <div class="w-full radius-sm lrs-selectors">
        <div class="${selected == "login" ? "lrs-selector-selected" : ""} lrs-selector radius-sm text-center">
          <a href="#login">Login</a>
        </div>
        <div class="${selected == "register" ? "lrs-selector-selected" : ""} lrs-selector radius-sm text-center">
          <a href="#register">Registro</a>
        </div>
      </div>
      <div class="lrs-form-area">
        ${selected == "login" ? LoginForm() : RegisterForm()}
      </div>
    </div>
  `)
}

export default LoginRegisterSelector;
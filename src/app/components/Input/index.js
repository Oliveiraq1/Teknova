import PasswordInputChanger from "./PasswordInputChanger.js";

const InputText = (label, id, type = "text") => {
  return (`
    <label for="${id}" class="lrs-form-label">
      ${label} *
      <input type="${type}" id="${id}" name="${id}" />
    </label>
  `);
};

const InputPassword = (label, id, type = "text") => {
  return (`
    <label for="${id}" class="lrs-form-label">
      ${label} *
      <div class="lrs-form-pswdInputChanger">
        <input type="${type}" id="${id}" name="${id}" class="pswdIC-input" />
        ${PasswordInputChanger(id)}
      </div>
    </label>
  `);
};

function Input({ label, id, type = "text" }) {
  if (type == "password") return InputPassword(label, id, type);
  return InputText(label, id, type);
};

export default Input;
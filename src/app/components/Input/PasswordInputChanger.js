window.changePasswordFieldType = function (id) {
  const input = document.getElementById(id);
  const icon = document.getElementById(`eyeIcon-${id}`);

  if (!input || !icon) return;

  if (input.type === "text") {
    input.type = "password";
    icon.src = "/public/assets/icons/password-eye.svg";
  } else {
    input.type = "text";
    icon.src = "/public/assets/icons/password-eye-slash.svg";
  }
};

/**
 * @param {string} id - Id do input
 * @returns {string} Botao para alternar tipo do input
 */
const PasswordInputChanger = (id) => {
  return (`
    <div class="flex-center pswdIC">
      <img id="eyeIcon-${id}" src="/public/assets/icons/password-eye.svg" onclick="changePasswordFieldType('${id}')" />
    </div>
  `);
};


export default PasswordInputChanger;
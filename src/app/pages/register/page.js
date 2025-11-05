import LoginRegisterSelector from "../../components/LoginRegisterSelector.js";

const RegisterPage = () => {
  return (`
    <div class="container">
      <div class="flex-center lr-main h-full">
        <div class="flex-center lr-header">
          <div class="flex-center lr-img-container">
            <img src="/public/assets/pap-logo.png" alt="pap logo" class="pap-logo" />
          </div>
          <div class="lr-header-text">
            <h1 class="h1">Entre agora!</h1>
            <p class="caption text-center">Crie uma conta ou faça login para acessar a plataforma.</p>
          </div>
        </div>
        <div class="w-full lrs-form">
          ${LoginRegisterSelector("register")}
        </div>
      </div>
    </div>
  `)
}

export default RegisterPage;
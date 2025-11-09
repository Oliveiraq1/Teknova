import {
  renderHeader,
  renderSidebar,
  renderNavbar
} from "../../components/baseComponents.js";
import Cookies from "../../static/js/cookies/cookies.js";

const renderProfileDetails = () => {
  const { name, last_name, email, image_url, cpf } = Cookies.getUser();
  const profileElement = document.getElementById("profile");
  const html = (`
    <div class="profile-content">
      <img src="${image_url}" alt="user-profile" class="profile-icon" readonly />
      <div class="profile-content__inputarea">
        <label for="name" class="relative">
          <span class="profile-input-label">Nome</span>
          <input type="text" id="name" value="${name}" class="profile-input" readonly />
          <span class="profile-input-button" onclick="changeName()">mudar</span>
        </label>
        <label for="last_name" class="relative">
          <span class="profile-input-label">Ultimo nome</span>
          <input type="text" id="last_name" value="${last_name}" class="profile-input" readonly />
          <span class="profile-input-button" onclick="changeLastName()">mudar</span>
        </label>
        <label for="image_url" class="relative">
          <span class="profile-input-label">Imagem de perfil</span>
          <input type="text" id="image_url" value="${image_url}" class="profile-input" readonly />
          <span class="profile-input-button" onclick="changeImageUrl()">mudar</span>
        </label>
        <label for="password" class="relative">
          <span class="profile-input-label">Senha</span>
          <input type="password" id="password" value="PAP.com xD" class="profile-input" readonly />
          <span class="profile-input-button" onclick="changePassword()">mudar</span>
        </label>
        <label for="email">
          <span class="profile-input-label">Email</span>
          <input type="text" id="email" value="${email}" readonly></input>
        </label>
        <label for="cpf">
          <span class="profile-input-label">CPF</span>
          <input type="text" id="cpf" value="${cpf}" readonly></input>
        </label>
      </div>
    </div>
  `)

  profileElement.innerHTML = html;
}

export const renderProfile = () => {
  renderHeader(false);
  renderSidebar();
  renderNavbar();
  renderProfileDetails()
}
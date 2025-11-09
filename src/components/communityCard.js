import Cookies from "../static/js/cookies/cookies.js";

const communityCard = ({ id, name, image_url, isPrivate, members }) => {
  const { id: userId } = Cookies.getUser();

  return (`
    <div class="community-container">
      <div class="community-container__header">
        <div class="community-container__header-details">
          <img src="${image_url}" class="community-container__logo" />
          <h3>${name}</h1>
        </div>
        <div class="community-container__header-details-visit">
          <span class="community-container-group ${isPrivate ? 'private' : 'public'}">${isPrivate ? 'privado' : 'publico'}</span>
          <a href="#group?id=${id}">
            <img src="/static/assets/icons/visit-button.svg" />
          </a>
        </div>
      </div>
      <div class="community-container__body">
        <div class="community-container__body-buttons">
          ${members.includes(userId)
      ? (`
        <span class="community-container__body-button joined">Entrou</span>
        <span class="community-container__body-button exit" onclick="leaveGroup('${id}')">Sair</span>
        `)
      : (`
        <span 
          class="community-container__body-button ask"
          onclick="${isPrivate ? `groupRequest('${id}')` : `joinPublicGroup('${id}')`}"
        >
          ${isPrivate ? 'Pedir para entrar' : 'Entrar'}
        </span>
        `)}
        </div>
        <span class="community-container__users-count">Membros: ${members.length}</span>
      </div>
    </div>
  `)
}

export default communityCard;
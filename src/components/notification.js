import Cookies from "../static/js/cookies/cookies.js";

const notification = ({ id, title, message, date, moveTo, saw }) => {
  const { id: userId } = Cookies.getUser();
  return (`
    <div class="notification-item ${saw.includes(userId) ? 'saw' : ''}" id="${id}">
      <div class="notification-item__header">
        <img src="/static/assets/pap-logo.png" alt="pap-logo" class="notification-item__logo" />
        <p class="notification-item__header-date">${date}</p>
      </div>
      <div class="notification-item__main">
        <p class="notification-item__title">${title}</p>
        <p class="notification-item__description">${message}</p>
      </div>
      <div class="notification-item__actions">
        ${saw.includes(userId) ? "" : `
          <img 
            title="Marcar como visto"
            src="/static/assets/icons/accept-request.svg"
            class="notification-item__icon"
            onclick="markNotificationAsSaw('${id}','${moveTo}')"
          />
        `}
        <img
          title="Excluir notificacao"
          src="/static/assets/icons/trashcan.svg"
          class="notification-item__icon",
          onclick="deleteNotification('${id}')"
        />
      </div>
    </div>
  `)
}

export default notification;

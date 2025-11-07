import notification from "../../components/notification.js";
import { getUserNotifications } from "../../static/js/localstorage/localstorage.functions.js";

const zeroNotifications = () => {
  const notificationElement = document.getElementById("notifications");
  const html = (`
    <img src="/static/assets/icons/bell-idle.svg" class="bell-idle" />
    <div class="zeroNotifications__data">
      <p class="zeroNotifications__title">Sem notificacoes</p>
      <p class="zeroNotifications__description">Quando algo ocorrer, avisaremos aqui para que voce fique por dentro das novidades!</p>
    </div>
  `)

  notificationElement.innerHTML = html;
  notificationElement.style.height = "100%";
  notificationElement.style.display = "flex";
  notificationElement.style.justifyContent = "center";
  notificationElement.style.alignItems = "center";
  notificationElement.style.flexDirection = "column";

  notificationElement.innerHTML = html;
}

const showNotifications = (notifications) => {
  const notificationElement = document.getElementById("notifications");
  const html = (`
    ${notifications.map(notf => (`
      ${notification({
    title: notf.title,
    message: notf.message,
    moveTo: notf.moveTo,
    date: notf.date
  })}
    `)).join("")}
    </div>
  `)

  notificationElement.innerHTML = html;
  notificationElement.style.display = "flex";
  notificationElement.style.flexDirection = "column";
  notificationElement.style.gap = ".5rem";
}

export const renderNotifications = () => {
  const userNotifications = getUserNotifications()

  if (userNotifications) return showNotifications(userNotifications);
  return zeroNotifications();
}
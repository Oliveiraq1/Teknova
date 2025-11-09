import notification from "../../components/notification.js";
import { getUserNotifications } from "../../static/js/localstorage/localstorage.functions.js";

import {
  renderHeader,
  renderSidebar,
  renderNavbar
} from "../../components/baseComponents.js";
import Cookies from "../../static/js/cookies/cookies.js";

export const showNotifications = () => {
  const { id: userId } = Cookies.getUser();
  const userNotifications = getUserNotifications();
  const notificationElement = document.getElementById("notifications");

  if (!userNotifications) return notificationElement.innerHTML = "Sem notificações";

  const notSaw = userNotifications
    .filter(n => !Array.isArray(n.saw) || !n.saw.includes(userId))
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  const sawNotifications = userNotifications
    .filter(n => Array.isArray(n.saw) && n.saw.includes(userId))
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  const allOrdenated = [...notSaw, ...sawNotifications];

  const html = allOrdenated.map(notf => notification({
    id: notf.id,
    title: notf.title,
    message: notf.message,
    moveTo: notf.moveTo,
    date: notf.date,
    saw: notf.saw
  })).join("");

  notificationElement.innerHTML = html;
}

export const renderNotifications = () => {
  showNotifications();
  renderHeader();
  renderSidebar();
  renderNavbar();
}
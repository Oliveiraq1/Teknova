const notification = ({ id, title, message, date, moveTo }) => {
  return (`
    <div class="notification-container">
      <a href="${moveTo ?? `${window.location.hash}`}" class="notification-link">
        <img src="/static/assets/icons/bell.svg" alt="notification icon" class="notification-bell" />
        <div class="notification-data">
          <p class="notification-data__title">${title}</p>
          <p class="notification-data__message">${message}</p>
        </div>
        <p class="notification-date">${date}</p>
      </a>
    </div>  
  `)
}

export default notification;

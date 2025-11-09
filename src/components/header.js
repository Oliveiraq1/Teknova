const header = (input = true) => {
  return (`
    <header class="header-container">
      <img src="/static/assets/icons/header-sidebar.svg" alt="open sidebar" class="home-header-sidebar__icon"
        onclick="openSidebar()" />
      <a href="#home" class="header-logo">
        <img src="/static/assets/pap-logo.png" alt="pap-logo" />
      </a>
      <div class="home-header__container">
        ${input ? (`
          <div class="home-header__search">
            <input type="text" id="home-search" placeholder="Buscar" onkeydown="homeSearchKeyDown(event)" />
            <img src="/static/assets/icons/magnifier-svgrepo-com-bold-fix.svg" alt="lupe" class="home-header__icon" />
          </div>
          `) : ('')}
      </div>
      <a href="#profile" class="home-header__user">
        <img src="#" id="header-user-icon" />
      </a>
    </header>
  `)
}

export default header;
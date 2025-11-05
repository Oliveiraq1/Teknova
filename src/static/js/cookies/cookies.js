class Cookies {
  /**
   * @param {string} key - Chave do cookie
   * @param {string} value - Valor do cookie
   * @param {number} [exp=cookieDeSessao] - Data de expiracao
   */
  static set(key, value, exp = null) {
    let cookieString = `${key}=${value};path=/;`
    let expDate = "";

    if (exp) expDate = new Date(Date.now() + exp).toUTCString();
    cookieString += `expires=${expDate};`;

    document.cookie = cookieString;
  }

  /**
   * @param {string} key - Chave do cookie
   * @returns {string|null} Valor do cookie ou `null` caso nao encontrado
   */
  static get(key) {
    const cookiesArray = decodeURIComponent(document.cookie)
      .split(";")
      .map(c => c.trim());

    const requestedCookie = cookiesArray.filter(
      c => c.indexOf(key) === 0
    )[0];

    if (!requestedCookie) return null;
    const [_, cookieValue] = requestedCookie.split("=");

    return cookieValue;
  }

  /**
   * @param {string} key - Chave do cookie
   */
  static delete(key) {
    const now = new Date().toUTCString();
    document.cookie = `${key}=;path=/;expires=${now}`;
  }
}

export default Cookies;
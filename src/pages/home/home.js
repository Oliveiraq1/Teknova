import post from "../../components/post.js";
import Cookies from "../../static/js/cookies/cookies.js";
import LocalStorage from "../../static/js/localstorage/localstorage.js";
import { localStorageTypes } from "../../static/js/localstorage/localstorage.types.js";

export const renderHomePosts = () => {
  const user = Cookies.getUser();
  const posts = LocalStorage.get(localStorageTypes.POSTS);

  const html = (`
    <main class="group-post-container">
      ${post({ posts, user })}
    </main>  
  `)

  const groupElement = document.getElementById("home-posts");
  groupElement.innerHTML = html;
}

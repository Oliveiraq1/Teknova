import Cookies from "./cookies/cookies.js";
import {
  groupPostAddComment,
  feedPostAddComment
} from "../js/localstorage/localstorage.functions.js"
import LocalStorage from "./localstorage/localstorage.js";
import { localStorageTypes } from "./localstorage/localstorage.types.js";

/* ======= POST Actions */
function togglePostLike({ userId, postId }) {
  const posts = LocalStorage.get(localStorageTypes.POSTS);

  const likes = posts[postId].likes;
  const liked = likes.includes(userId);

  if (liked) {
    posts[postId].likes = likes.filter(id => id !== userId)
  } else {
    posts[postId].likes.push(userId);
  }

  LocalStorage.set(localStorageTypes.POSTS, posts);
  const likeBtn = document.getElementById(`like-btn-${postId}`);

  const updatedLikes = posts[postId].likes;
  const isNowLiked = updatedLikes.includes(userId);

  likeBtn.src = isNowLiked
    ? "/static/assets/icons/like-filled.svg"
    : "/static/assets/icons/like.svg"
}

function toggleGroupPostLike({ userId, groupId, postId }) {
  const groups = LocalStorage.get(localStorageTypes.GROUPS);
  const groupIndex = groups.findIndex(g => g.id == groupId);
  if (groupIndex == -1) return;

  const likes = groups[groupIndex].posts[postId].likes;
  const liked = likes.includes(userId);

  if (liked) {
    groups[groupIndex].posts[postId].likes = likes.filter(id => id !== userId)
  } else {
    groups[groupIndex].posts[postId].likes.push(userId);
  }

  LocalStorage.set(localStorageTypes.GROUPS, groups);
  const likeBtn = document.getElementById(`like-btn-${postId}`);

  const updatedLikes = groups[groupIndex].posts[postId].likes;
  const isNowLiked = updatedLikes.includes(userId);

  likeBtn.src = isNowLiked
    ? "/static/assets/icons/like-filled.svg"
    : "/static/assets/icons/like.svg"
}

window.openPostComments = function (id) {
  const post = document.getElementById(id);
  if (post.classList.contains("hidden")) return post.classList.remove("hidden");
  post.classList.add("hidden");
}

window.addComment = function addComment(groupId = null, postId, inputId) {
  const input = document.getElementById(inputId);
  const message = input.value.trim();
  if (!message) return;

  const { id, name, image_url } = Cookies.getUser();
  const comment = {
    author: { id, name, image_url },
    message
  }

  input.value = "";
  if (groupId != null) return groupPostAddComment(groupId, postId, { ...comment });
  return feedPostAddComment(postId, { ...comment });
}

window.toggleLike = function toggleLike(groupId, postId) {
  const { id: userId } = Cookies.getUser();
  if (groupId !== null) return toggleGroupPostLike({ userId, groupId, postId });
  return togglePostLike({ userId, postId });
}

window.reportPost = function reportPost(groupId, postId) {
  if (!groupId) return window.alert("Implementar funcao para feed")
  window.alert("Implementar funcao para grupos.")

  const confirm = window.confirm("Tem certeza que deseja denunciar esse post?");
  if (!confirm) return;

  const motivo = window.prompt("Digite o motivo");
  if (motivo) window.alert("Sua denuncia foi enviada para avaliacao de nossos administradores!");
}
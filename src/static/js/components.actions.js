import Cookies from "./cookies/cookies.js";
import {
  groupPostAddComment,
  feedPostAddComment
} from "../js/localstorage/localstorage.functions.js"

/* ======= POST Actions */
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
  console.log("GROUP: " + groupId);
  if (groupId) {
    console.log(typeof groupId)
    console.log("ENNTROU NO GROUP IDE")
    return groupPostAddComment(groupId, postId, { ...comment });
  }

  console.log("PASSOU...")
  return feedPostAddComment(postId, { ...comment });
}

window.likePost = function likePost(groupId, postId) {
  if (!groupId) return window.alert("Implementar funcao para feed")
  window.alert("Implementar funcao para grupos.")
}

window.reportPost = function reportPost(groupId, postId) {
  if (!groupId) return window.alert("Implementar funcao para feed")
  window.alert("Implementar funcao para grupos.")

  const confirm = window.confirm("Tem certeza que deseja denunciar esse post?");
  if (!confirm) return;

  const motivo = window.prompt("Digite o motivo");
  if (motivo) window.alert("Sua denuncia foi enviada para avaliacao de nossos administradores!");
}
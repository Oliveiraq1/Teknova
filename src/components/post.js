const post = ({ group = null, posts = null, user }) => {
  let data = "";

  if (!group) data = posts;
  if (!posts) data = group.posts;

  return (`
    <div class="flex flex-col post-container">
    ${data.map(post => (`
      <div class="post-item">
        <div class="flex post-header">
          <div class="flex post-header__user">
            <img 
              src="https://api.dicebear.com/7.x/adventurer/svg?seed=${post.author.name}"
              alt="image_url"
              class="post-user-picture"
            />
            <p>${post.author.name}</p>
          </div>
          ${group ? `<span class="post-group-name">${group.name}</span>` : ""}
        </div>

        <div class="flex flex-col post-data">
          <div class="flex flex-col post-data__text">
            <p class="post-data__title">${post.title}</p>
            <p class="post-data__message">${post.message}</p>
          </div>
        </div>

        <img src="${post.image_url}" alt="post image" class="post-img" />

        ${post.fake ? (`
          <div class="post-fake flex">Esta postagem foi identificada como falsa.</div>
        `) : (`
          <div class="flex post-action-icons">
            <div class="flex post-actions-icons__left">
              <img src="../static/assets/icons/like-filled.svg" alt="like-button" class="post-actions-icons__icon" onclick="likePost(${group ? `${group.id}` : null}, '${post.id}')" />
              <img src="../static/assets/icons/comments.svg" alt="like-button" class="post-actions-icons__icon" onclick="openPostComments('post-${post.id}')" />
            </div>
            <div class="flex post-actions-icons__right">
              <span class="post-actions__date">${post.date}</span>
              <img src="../static/assets/icons/warning-filled.svg" alt="like-button" class="post-actions-icons__icon" onclick="reportPost(${group ? `${group.id}` : null}, '${post.id}')" />
            </div>
          </div>
        `)}

        <div class="hidden post-comments" id="post-${post.id}">
          <hr />
          <div class="flex post-input-area">
            <input type="text" placeholder="Digite seu comentario" id="post-input-${post.id}" class="post-input__field" />
            <img src="../static/assets/icons/send.svg" alt="send comment" class="post-input__img" onclick="addComment(${group ? `${group.id}` : null}, '${post.id}', 'post-input-${post.id}')">
          </div>
          ${post.comments.reverse().map(comment => (`
            <div class="flex post-comment">
              <img 
                src="https://api.dicebear.com/7.x/adventurer/svg?seed=${comment.author.name}"
                alt="image_url"
                class="post-comment__picture"
              />
              <div class="post-comment__text">
                <p class="post-comment__text-title">${comment.author.name} ${user.id == post.author.id ? "<i>- autor</i>" : ""}</p>
                <p class="post-comment__text-comment">${comment.message}</p>
              </div>
            </div>
          `)).join("")}
        </div>
      </div>
    `)).join("")}
    </div>
  `)
}

export default post;
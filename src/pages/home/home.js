const renderPost = ({ user }) => {
  const html = (`
    <main class="group-post-container">
      ${post({ group, user })}
    </main>`
  )

  const groupElement = document.getElementById("group");
  groupElement.innerHTML = html;
}

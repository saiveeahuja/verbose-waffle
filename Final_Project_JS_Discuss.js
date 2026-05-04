document.addEventListener("DOMContentLoaded", () => {
  const postBtn = document.getElementById("post-btn");
  const textArea = document.getElementById("discussion-input");
  const postsContainer = document.getElementById("discussion-posts");

  postBtn.addEventListener("click", () => {
    const text = textArea.value.trim();
    if (!text) return;

    const randomNum = Math.floor(100 + Math.random() * 900);
    const username = `user${randomNum}`;

    const post = document.createElement("div");
    post.className = "post";

    post.innerHTML = `${username}: ${text}`;

    postsContainer.appendChild(post);
    textArea.value = "";
  });
});
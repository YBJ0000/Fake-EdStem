import { pages, likeButton, watchButton } from "./main.js";
import { updateLikeIcon, updateWatchIcon } from "./updateIcon.js";

import { showComments } from "./main.js";
import { checkLockedThread } from "./main.js";


export const goToPage = (page => {
  for (const oldPage of pages) {
    document.getElementById(`page-${oldPage}`).style.display = 'none'
  }
  document.getElementById(`page-${page}`).style.display = 'block'
})

export const setLoggedIn = (isLoggedIn => {
  if (isLoggedIn) {
    document.getElementById('logged-out-buttons').style.display = 'none'
    document.getElementById('logged-in-buttons').style.display = 'block'
  } else {
    document.getElementById('logged-out-buttons').style.display = 'block'
    document.getElementById('logged-in-buttons').style.display = 'none'
    localStorage.removeItem('token')
  }
})

export const showAlert = (message) => {
  const alertBox = document.getElementById('custom-alert');
  const alertMessage = document.getElementById('alert-message');
  
  alertMessage.textContent = message;
  alertBox.style.display = 'block';

  document.getElementById('close-alert').addEventListener('click', () => {
    alertBox.style.display = 'none';
  });
}

export const showThreadContent = (threadData) => {
  document.getElementById('thread-title').textContent = threadData.title
  document.getElementById('thread-body').textContent = threadData.content
  document.getElementById('thread-likes').textContent = `Likes: ${Object.keys(threadData.likes).length}`

  window.currentThreadData = threadData

  // 调用 ShowComments 来显示评论
  showComments(threadData.id);

  checkLockedThread();

  document.getElementById('comment-list').style.display = 'block'
  document.getElementById('comment-section').style.display = 'block'
  document.getElementById('reply-modal').style.display = 'block'

  if (window.innerWidth <= 400) {
    document.querySelector('.thread-list').style.display = 'none';
    document.querySelector('.thread-content').style.display = 'block';
    document.getElementById('back-to-thread-list').style.display = 'block';
  }

  document.getElementById('thread-title').style.display = 'block'
  document.getElementById('thread-body').style.display = 'block'
  document.getElementById('thread-likes').style.display = 'block'

  const currentUserId = parseInt(localStorage.getItem('userId'));
  const isAdmin = localStorage.getItem('isAdmin') === 'true';

  if (currentUserId === currentThreadData.creatorId || isAdmin) {
    document.getElementById('edit-thread-btn').style.display = 'block'
    document.getElementById('delete-thread-btn').style.display = 'block'
  } else {
    document.getElementById('edit-thread-btn').style.display = 'none'
    document.getElementById('delete-thread-btn').style.display = 'none'
  }

  document.getElementById('edit-thread').style.display = 'none'

  if (!currentThreadData || currentThreadData.lock) {
    likeButton.style.display = 'none';
    watchButton.style.display = 'none'
  } else {
    likeButton.style.display = 'inline';
    likeButton.style.cursor = 'pointer'
    watchButton.style.display = 'inline'
    watchButton.style.cursor = 'pointer'

    const isLiked = currentThreadData.likes.includes(currentUserId);
    updateLikeIcon(isLiked);
  }

  const isWatched = currentThreadData.watchees.includes(currentUserId)
  updateWatchIcon(isWatched)
}


import { pages } from "./main.js";

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

  document.getElementById('thread-title').style.display = 'block'
  document.getElementById('thread-body').style.display = 'block'
  document.getElementById('thread-likes').style.display = 'block'
  document.getElementById('edit-thread-btn').style.display = 'block'

  document.getElementById('edit-thread').style.display = 'none'
}


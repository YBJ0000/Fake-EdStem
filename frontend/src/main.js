import { BACKEND_PORT } from './config.js';
// A helper you may want to use when uploading new images to the server.
import { fileToDataUrl } from './helpers.js';

import { apiCall } from './api.js';
import { goToPage, setLoggedIn } from './ui.js';
import { loadThreads } from './loadThreads.js';

export const pages = ['register', 'login', 'dashboard', 'create']
export let start = 0
export const limit = 5

export const updateStart = (newStart) => {
  start = newStart;
};

for (const name of pages) {
  document.getElementById(`goto-page-${name}`).addEventListener('click', () => {
    goToPage(name)
  })
}

document.getElementById('logout').addEventListener('click', () => {
  const threadList = document.getElementById('thread-list')
  threadList.innerHTML = ''

  const threadTitle = document.getElementById('thread-title')
  const threadBody = document.getElementById('thread-body')
  const threadLikes = document.getElementById('thread-likes')
  const editThreadButton = document.getElementById('edit-thread-btn')
  const deleteThreadButton = document.getElementById('delete-thread-btn')
  const likeButton = document.getElementById('like-thread-btn')
  const watchButton = document.getElementById('watch-thread-btn')
  threadTitle.textContent = 'Select a thread'
  threadBody.textContent = ''
  threadLikes.textContent = ''
  editThreadButton.style.display = 'none'
  deleteThreadButton.style.display = 'none'
  likeButton.style.display = 'none'
  watchButton.style.display = 'none'

  const editThreadPage = document.getElementById('edit-thread')
  editThreadPage.style.display = 'none'


  start = 0

  setLoggedIn(false)
  goToPage('login')
})

document.getElementById('register-btn').addEventListener('click', () => {
  const email = document.getElementById('register-email').value
  const password = document.getElementById('register-password').value
  const name = document.getElementById('register-name').value
  const confirmPassword = document.getElementById('register-confirm-password').value

  if (password !== confirmPassword) {
    alert('Passwords do not match!')
    return
  }

  apiCall('auth/register', {
    email,
    password,
    name
  }, 'POST', token).then(data => {

    document.getElementById('register-email').value = ''
    document.getElementById('register-password').value = ''
    document.getElementById('register-confirm-password').value = ''
    document.getElementById('register-name').value = ''

    const threadContent = document.getElementById('thread-content')
    threadContent.style.display = 'block'
    const threadTitle = document.getElementById('thread-title')
    threadTitle.style.display = 'block'

    localStorage.setItem('token', data.token)
    localStorage.setItem('userId', data.userId)
    setLoggedIn(true)

    token = data.token

    const threadList = document.getElementById('thread-list')
    threadList.innerHTML = ''
    start = 0
    
    goToPage('dashboard')
    loadThreads()

    token = data.token
    console.log(data);
  }).catch(error => {
    console.log('Registration failed:', error);
  })
})

document.getElementById('login-btn').addEventListener('click', () => {
  const email = document.getElementById('login-email').value
  const password = document.getElementById('login-password').value

  apiCall('auth/login', {
    email,
    password
  }, 'POST', token).then(data => {

    document.getElementById('login-email').value = ''
    document.getElementById('login-password').value = ''

    const threadContent = document.getElementById('thread-content')
    threadContent.style.display = 'block'
    const threadTitle = document.getElementById('thread-title')
    threadTitle.style.display = 'block'

    localStorage.setItem('token', data.token)
    localStorage.setItem('userId', data.userId)
    setLoggedIn(true)
    
    token = data.token

    const userId = localStorage.getItem('userId')
    apiCall(`user?userId=${userId}`, {}, 'GET', token).then(userData => {
      localStorage.setItem('isAdmin', userData.admin)
    }).catch(error => {
      console.log('Failed to fetch user data:', error);
    })

    const threadList = document.getElementById('thread-list')
    threadList.innerHTML = ''
    start = 0

    goToPage('dashboard')
    loadThreads()

    console.log(data);
  }).catch(error => {
    console.log('Login failed:', error);
  })
})

document.getElementById('new-thread-btn').addEventListener('click', () => {
  const title = document.getElementById('new-thread-title').value
  const content = document.getElementById('new-thread-content').value
  const isPublic = document.querySelector('input[name="thread-visibility"]:checked').value === 'true'

  apiCall('thread', {
    title,
    isPublic,
    content
  }, 'POST', token).then(data => {

    const newThreadId = data.id

    return apiCall(`thread?id=${newThreadId}`, {}, 'GET', token)
  }).then(threadData => {
    window.currentThreadData = threadData

    document.getElementById('new-thread-title').value = '';
    document.getElementById('new-thread-content').value = '';
    document.getElementById('thread-public').checked = true;

    document.getElementById('thread-title').textContent = threadData.title;
    document.getElementById('thread-body').textContent = threadData.content;
    document.getElementById('thread-likes').textContent = `Likes: ${Object.keys(threadData.likes).length}`;

    document.getElementById('thread-content').style.display = 'block';
    document.getElementById('edit-thread').style.display = 'none';

    const editThreadButton = document.getElementById('edit-thread-btn');
    const deleteThreadButton = document.getElementById('delete-thread-btn');
    editThreadButton.style.display = 'block';
    deleteThreadButton.style.display = 'block';

    const threadList = document.getElementById('thread-list');
    threadList.innerHTML = '';
    start = 0;

    goToPage('dashboard');
    loadThreads();

    console.log(threadData);    
  }).catch(error => {
    console.log('Failed to create or fetch thread:', error);
  })
})

document.getElementById('thread-load-more-btn').addEventListener('click', () => {
  loadThreads()
})

export let token = localStorage.getItem('token')
if (token) {
  setLoggedIn(true)
  goToPage('dashboard')
  loadThreads()
} else {
  setLoggedIn(false)
}

document.getElementById('edit-thread-btn').addEventListener('click', () => {
  document.getElementById('thread-title').style.display = 'none'
  document.getElementById('thread-body').style.display = 'none'
  document.getElementById('thread-likes').style.display = 'none'
  document.getElementById('edit-thread-btn').style.display = 'none'
  document.getElementById('delete-thread-btn').style.display = 'none'
  document.getElementById('like-thread-btn').style.display = 'none'
  document.getElementById('watch-thread-btn').style.display = 'none'
  document.getElementById('edit-thread').style.display = 'block'

  document.getElementById('edit-thread-title').value = document.getElementById('thread-title').textContent
  document.getElementById('edit-thread-content').value = document.getElementById('thread-body').textContent

  const isPublic = window.currentThreadData.isPublic
  const isLocked = window.currentThreadData.lock

  document.getElementById(isPublic ? 'edit-thread-public' : 'edit-thread-private').checked = true
  document.getElementById('edit-thread-lock').checked = isLocked

})

document.getElementById('save-thread-btn').addEventListener('click', () => {
  const newTitle = document.getElementById('edit-thread-title').value
  const newContent = document.getElementById('edit-thread-content').value
  const isPublic = document.querySelector('input[name="edit-thread-visibility"]:checked').value === 'true'
  const isLocked = document.getElementById('edit-thread-lock').checked

  apiCall('thread', {
    id: currentThreadData.id,
    title: newTitle,
    content: newContent,
    isPublic: isPublic,
    lock: isLocked
  }, 'PUT', token).then(data => {

    const threadList = document.getElementById('thread-list')
    threadList.innerHTML = ''
    start = 0
    loadThreads()

    document.getElementById('thread-title').textContent = newTitle
    document.getElementById('thread-body').textContent = newContent
    document.getElementById('edit-thread').style.display = 'none'
    document.getElementById('thread-title').style.display = 'block'
    document.getElementById('thread-body').style.display = 'block'
    document.getElementById('thread-likes').style.display = 'block'
    document.getElementById('edit-thread-btn').style.display = 'block'
    document.getElementById('delete-thread-btn').style.display = 'block'
    document.getElementById('like-thread-btn').style.display = 'inline'
    document.getElementById('watch-thread-btn').style.display = 'inline'

  }).catch(error => {
    console.log('Failed to save thread:', error);
  })
})

document.getElementById('delete-thread-btn').addEventListener('click', () => {
  apiCall('thread', {
    id: currentThreadData.id
  }, 'DELETE', token).then(data => {

    const threadList = document.getElementById('thread-list')
    threadList.innerHTML = ''
    start = 0
    loadThreads()

    document.getElementById('thread-title').textContent = 'Select a thread';
    document.getElementById('thread-body').textContent = '';
    document.getElementById('thread-likes').textContent = '';

    document.getElementById('edit-thread-btn').style.display = 'none'
    document.getElementById('delete-thread-btn').style.display = 'none';
    document.getElementById('like-thread-btn').style.display = 'none'
    document.getElementById('watch-thread-btn').style.display = 'none'

  })
})

export const likeButton = document.getElementById('like-thread-btn')

likeButton.addEventListener('click', () => {
  
  if (!currentThreadData || currentThreadData.lock) {
    console.log('Thread is locked or data is unavailable.');
    return;
  }

  const currentUserId = parseInt(localStorage.getItem('userId'));
  const isLiked = currentThreadData.likes.includes(currentUserId);

  apiCall('thread/like', {
    id: currentThreadData.id,
    turnon: !isLiked
  }, 'PUT', token).then(data => {
    if (!isLiked) {
      currentThreadData.likes.push(currentUserId)
    } else {
      currentThreadData.likes = currentThreadData.likes.filter(id => id !== currentUserId)
    }

    updateLikeIcon(!isLiked)

    document.getElementById('thread-likes').textContent = `Likes: ${Object.keys(currentThreadData.likes).length}`

    console.log('Like status updated successfully:', data);
  }).catch(error => {
    console.log('Failed to update like status:', error);
  })

})

export const updateLikeIcon = (liked) => {
  if (liked) {
    likeButton.classList.remove('bi-heart')
    likeButton.classList.add('bi-heart-fill')
    likeButton.style.color = 'red'
  } else {
    likeButton.classList.remove('bi-heart-fill')
    likeButton.classList.add('bi-heart')
    likeButton.style.color = 'black'
  }
}

export const watchButton = document.getElementById('watch-thread-btn')

watchButton.addEventListener('click', () => {
  const currentUserId = parseInt(localStorage.getItem('userId'))
  const isWatched = currentThreadData.watchees.includes(currentUserId)

  apiCall('thread/watch', {
    id: currentThreadData.id,
    turnon: !isWatched
  }, 'PUT', token).then(data => {
    if (!isWatched) {
      currentThreadData.watchees.push(currentUserId)
    } else {
      currentThreadData.watchees = currentThreadData.watchees.filter(id => id !== currentUserId)
    }

    updateWatchIcon(!isWatched)
    
    console.log('Watch status updated successfully:',data);
  }).catch(error => {
    console.log('Failed to update like status:', error);
  })
})

export const updateWatchIcon = (watched) => {
  if (watched) {
    watchButton.classList.remove('bi-eye')
    watchButton.classList.add('bi-eye-fill')
  } else {
    watchButton.classList.remove('bi-eye-fill')
    watchButton.classList.add('bi-eye')
  }
}

document.getElementById('back-to-thread-list').addEventListener('click', () => {
  document.querySelector('.thread-list').style.display = 'block';
  document.querySelector('.thread-content').style.display = 'none';
  document.getElementById('back-to-thread-list').style.display = 'none';
});



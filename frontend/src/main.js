import { BACKEND_PORT } from './config.js';
// A helper you may want to use when uploading new images to the server.
import { fileToDataUrl } from './helpers.js';

import { apiCall } from './api.js';
import { goToPage, setLoggedIn } from './ui.js';

export const pages = ['register', 'login', 'dashboard', 'create']

let start = 0
const limit = 5



for (const name of pages) {
  document.getElementById(`goto-page-${name}`).addEventListener('click', () => {
    goToPage(name)
  })
}



document.getElementById('logout').addEventListener('click', () => {
  const threadList = document.getElementById('thread-list')
  threadList.innerHTML = ''
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
    // 登录成功才会跳转到dashboard
    localStorage.setItem('token', data.token)
    localStorage.setItem('userId', data.userId)
    setLoggedIn(true)
    
    token = data.token

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

    // 重置create页面
    document.getElementById('new-thread-title').value = '';
    document.getElementById('new-thread-content').value = '';
    document.getElementById('thread-public').checked = true

    

    const threadList = document.getElementById('thread-list')
    threadList.innerHTML = ''
    start = 0

    goToPage('dashboard')
    loadThreads()

    console.log(data);
  }).catch(error => {
    console.log('Failed to create thread:', error);
  })
})


const loadThreads = () => {
  apiCall(`threads?start=${start}&limit=${limit}`, {}, 'GET', token).then(data => {

    // 新问题，每次确实获取5个thread
    // 但是private不展示
    console.log('Total threads from API:', data.length);

    const threadList = document.getElementById('thread-list');

    for (const threadId of data) {
      apiCall(`thread?id=${threadId}`, {}, 'GET', token).then(threadData => {
        if (threadData.isPublic) {
          apiCall(`user?userId=${threadData.creatorId}`, {}, 'GET', token).then(userData => {
            const threadItem = document.createElement('div')
            threadItem.classList.add('thread-item')
            const likeCount = Object.keys(threadData.likes).length
            const createdAt = new Date(threadData.createdAt).toLocaleString();

            const titleElement = document.createElement('p')
            titleElement.innerText = `${threadData.title}`
            const authorElement = document.createElement('p')
            authorElement.innerText = `${userData.name}`
            const dateElement = document.createElement('p')
            dateElement.innerText = `${createdAt}`
            const likesElement = document.createElement('p')
            likesElement.innerText = `${likeCount}`

            threadItem.appendChild(titleElement)
            threadItem.appendChild(authorElement)
            threadItem.appendChild(dateElement)
            threadItem.appendChild(likesElement)

            threadItem.style.cursor = 'pointer';

            // 添加边框！记得删除然后在.css里面加！！！maybe不用？？？
            threadItem.style.border = '1px solid black'

            threadItem.addEventListener('click', () => {
              document.getElementById('thread-title').textContent = threadData.title;
              document.getElementById('thread-body').textContent = threadData.content;
              document.getElementById('thread-likes').textContent = `Likes: ${likeCount}`;
            });

            threadList.appendChild(threadItem);
          }).catch(error => {
            console.log('Failed to fetch user:', error);
          });
        }
      }).catch(error => {
        console.log('Failed to fetch thread:', error);
      });
    }

    start += limit

    if (data.length < limit) {
      document.getElementById('thread-load-more-btn').style.display = 'none'
    } else {
      document.getElementById('thread-load-more-btn').style.display = 'block'
    }

  }).catch(error => {
    console.log('Failed to load threads:', error);
  });
}


document.getElementById('thread-load-more-btn').addEventListener('click', () => {
  loadThreads()
})

let token = localStorage.getItem('token')
if (token) {
  setLoggedIn(true)
  goToPage('dashboard')
  loadThreads()
} else {
  setLoggedIn(false)
}

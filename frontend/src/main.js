import { BACKEND_PORT } from './config.js';
// A helper you may want to use when uploading new images to the server.
import { fileToDataUrl } from './helpers.js';

import { apiCall } from './api.js';
import { goToPage, setLoggedIn, showThreadContent } from './ui.js';

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

  // 登出时重置
  const threadTitle = document.getElementById('thread-title')
  const threadBody = document.getElementById('thread-body')
  const threadLikes = document.getElementById('thread-likes')
  const editThreadButton = document.getElementById('edit-thread-btn')
  const deleteThreadButton = document.getElementById('delete-thread-btn')
  const likeButton = document.getElementById('like-thread-btn')
  threadTitle.textContent = 'Thread Title'
  threadBody.textContent = 'Thread Content'
  threadLikes.textContent = 'Likes: 0'
  editThreadButton.style.display = 'none'
  deleteThreadButton.style.display = 'none'

  // 把已赞变回未赞
  if (likeButton.className === 'bi bi-heart-fill') {
    likeButton.className = 'bi bi-heart'
  }

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

document.getElementById('thread-load-more-btn').addEventListener('click', () => {
  loadThreads()
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
              showThreadContent(threadData)
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

let token = localStorage.getItem('token')
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

  document.getElementById('edit-thread').style.display = 'block'

  document.getElementById('edit-thread-title').value = document.getElementById('thread-title').textContent
  document.getElementById('edit-thread-content').value = document.getElementById('thread-body').textContent

  const isPublic = window.currentThreadData.isPublic
  const isLocked = window.currentThreadData.isLocked

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

    // 必须清空左侧列表然后重新加载
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

  }).catch(error => {
    console.log('Failed to save thread:', error);
  })
})

document.getElementById('delete-thread-btn').addEventListener('click', () => {
  apiCall('thread', {
    id: currentThreadData.id
  }, 'DELETE', token).then(data => {
    // 必须清空左侧列表然后重新加载
    const threadList = document.getElementById('thread-list')
    threadList.innerHTML = ''
    start = 0
    loadThreads()

    // 重置右侧内容，而不是清空整个容器
    document.getElementById('thread-title').textContent = 'Thread Title';
    document.getElementById('thread-body').textContent = 'Thread Content';
    document.getElementById('thread-likes').textContent = 'Likes: 0';

    // 隐藏编辑和删除按钮
    document.getElementById('edit-thread-btn').style.display = 'none'
    document.getElementById('delete-thread-btn').style.display = 'none';

  })
})

export const likeButton = document.getElementById('like-thread-btn')

likeButton.addEventListener('click', () => {
  
  // 检查是否有帖子数据或帖子是否锁定
  if (!currentThreadData || currentThreadData.lock) {
    console.log('Thread is locked or data is unavailable.');
    return;
  }

  const currentUserId = localStorage.getItem('userId');
  // 判断用户是否已经点赞，如果是，则取消点赞，反之则点赞
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

    // 更新图标状态
    updateLikeIcon(!isLiked)

    console.log('Like status updated successfully:', data);
  }).catch(error => {
    console.log('Failed to update like status:', error);
  })

})

export const updateLikeIcon = (liked) => {
  if (liked) {
    likeButton.classList.remove('bi-heart')
    likeButton.classList.add('bi-heart-fill')
  } else {
    likeButton.classList.remove('bi-heart-fill')
    likeButton.classList.add('bi-heart')
  }
}


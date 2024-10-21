import { BACKEND_PORT } from './config.js';
// A helper you may want to use when uploading new images to the server.
import { fileToDataUrl } from './helpers.js';

const pages = ['register', 'login', 'dashboard']

const goToPage = (page => {
  for (const oldPage of pages) {
    document.getElementById(`page-${oldPage}`).style.display = 'none'
  }
  document.getElementById(`page-${page}`).style.display = 'block'
})

for (const name of pages) {
  document.getElementById(`goto-page-${name}`).addEventListener('click', () => {
    goToPage(name)
  })
}

const setLoggedIn = (isLoggedIn => {
  if (isLoggedIn) {
    document.getElementById('logged-out-buttons').style.display = 'none'
    document.getElementById('logged-in-buttons').style.display = 'block'
  } else {
    document.getElementById('logged-out-buttons').style.display = 'block'
    document.getElementById('logged-in-buttons').style.display = 'none'
    localStorage.removeItem('token')
  }
})

document.getElementById('logout').addEventListener('click', () => {
  setLoggedIn(false)
  goToPage('login')
})

let token = localStorage.getItem('token')
if (token) {
  setLoggedIn(true)
  goToPage('dashboard')
} else {
  setLoggedIn(false)
}

const apiCall = (route, body, method, token) => {
  return new Promise((resolve, reject) => {
    fetch(`http://localhost:5005/${route}`, {
      method: method,
      body: method !== 'GET' ? JSON.stringify(body) : undefined,
      headers: {
        'Content-type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : undefined
      }
    }).then(response => {
      if (response.status !== 200) {
        return response.json().then(errorData => {
          const errorMessage = errorData.error || 'Unknown error occurred!'
          alert(errorMessage)
          reject(errorMessage)
        })
      }
      return response.json()
    }).then(data => {
      resolve(data)
    }).catch(err => {
      const errorMessage = err.message || 'Network error or unknown error occurred!'
      alert(errorMessage)
      reject(errorMessage)
    })
  })
}

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
    // 注册成功跳转到dashboard
    localStorage.setItem('token', data.token)
    localStorage.setItem('userId', data.userId)
    setLoggedIn(true)
    goToPage('dashboard')
    token = data.token
    console.log(data);
  }).catch(error => {
    // 注册失败显示错误信息
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
    goToPage('dashboard')
    token = data.token
    console.log(data);
  }).catch(error => {
    // 登录失败显示错误信息
    console.log('Login failed:', error);
  })
})

document.getElementById('new-thread-btn').addEventListener('click', () => {
  const title = document.getElementById('new-thread-title').value
  const content = document.getElementById('new-thread-content').value

  apiCall('thread', {
    title,
    isPublic: true,
    content
  }, 'POST', token).then(data => {
    console.log(data);
  })
})

document.getElementById('thread-load-btn').addEventListener('click', () => {
  apiCall('threads?start=0', {}, 'GET', token).then(data => {

    const threadList = document.getElementById('thread-list');
    threadList.innerHTML = ''; 

    for (const threadId of data) {
      apiCall(`thread?id=${threadId}`, {}, 'GET', token).then(threadData => {
        const threadItem = document.createElement('div')
        threadItem.classList.add('thread-item')
        threadItem.innerHTML = `
          <p>ID: ${threadData.id}</p>
          <p>Title: ${threadData.title}</p>
          <p>Content: ${threadData.content}</p>
        `
        threadList.appendChild(threadItem)
      })
    }
  })

})


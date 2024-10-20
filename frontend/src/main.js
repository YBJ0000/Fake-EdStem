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

const token = localStorage.getItem('token')
if (token) {
  setLoggedIn(true)
  goToPage('dashboard')
} else {
  setLoggedIn(false)
}

const apiCall = (route, body) => {
  return new Promise((resolve, reject) => {
    fetch(`http://localhost:5005/${route}`, {
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
        'Content-type': 'application/json'
      }
    }).then(response => {
      if (response.status !== 200) {
        alert('Error registering!')
      }
      return response.json()
    }).then(data => {
      resolve(data)
    })
  })
}

document.getElementById('register-btn').addEventListener('click', () => {
  const email = document.getElementById('register-email').value
  const password = document.getElementById('register-password').value
  const name = document.getElementById('register-name').value

  apiCall('auth/register', {
    email,
    password,
    name
  }).then(data => {
    localStorage.setItem('token', data.token)
    localStorage.setItem('userId', data.userId)
    setLoggedIn(true)
    goToPage('dashboard')
    console.log(data);
  })
})

document.getElementById('login-btn').addEventListener('click', () => {
  const email = document.getElementById('login-email').value
  const password = document.getElementById('login-password').value

  apiCall('auth/login', {
    email,
    password
  }).then(data => {
    localStorage.setItem('token', data.token)
    localStorage.setItem('userId', data.userId)
    setLoggedIn(true)
    goToPage('dashboard')
    console.log(data);
  })
})

document.getElementById('new-thread-btn').addEventListener('click', () => {
  const title = document.getElementById('new-thread-title').value
  const content = document.getElementById('new-thread-content').value

  apiCall('thread', {
    title,
    isPublic: true,
    content
  }).then(data => {
    console.log(data);
  })
})

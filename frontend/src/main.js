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


document.getElementById('register-btn').addEventListener('click', () => {
  const email = document.getElementById('register-email').value
  const password = document.getElementById('register-password').value
  const name = document.getElementById('register-name').value
  // console.log(email, password, name);
  // console.log('A');

  const result = fetch('http://localhost:5005/auth/register', {
    method: 'POST',
    body: JSON.stringify({
      email,
      password,
      name
    }),
    headers: {
      'Content-type': 'application/json'
    }
  })
  result.then(response => {
    const json = response.json()
    json.then(data => {
      console.log(data);
      localStorage.setItem('token', data.token)
      localStorage.setItem('userId', data.userId)
    })
  })

  // console.log(result);
  // console.log('B');
})

document.getElementById('login-btn').addEventListener('click', () => {
  const email = document.getElementById('login-email').value
  const password = document.getElementById('login-password').value

  const result = fetch('http://localhost:5005/auth/login', {
    method: 'POST',
    body: JSON.stringify({
      email,
      password,
    }),
    headers: {
      'Content-type': 'application/json'
    }
  })
  result.then(response => {
    const json = response.json()
    json.then(data => {
      localStorage.setItem('token', data.token)
      localStorage.setItem('userId', data.userId)
      document.getElementById('logged-out-buttons').style.display = 'none'
      document.getElementById('logged-in-buttons').style.display = 'block'
      goToPage('dashboard')
      console.log(data);
    })
  })
})

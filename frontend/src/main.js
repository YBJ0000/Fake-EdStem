import { BACKEND_PORT } from './config.js';
// A helper you may want to use when uploading new images to the server.
import { fileToDataUrl } from './helpers.js';

const pages = ['page-register', 'page-login', 'page-dashboard']
const buttons = {
  'goto-page-register': 'page-register',
  'goto-page-login': 'page-login',
  'goto-page-dashboard': 'page-dashboard'
}

for (const buttonId in buttons) {
  document.getElementById(buttonId).addEventListener('click', () => {
    pages.forEach(page => {
      document.getElementById(page).style.display = 'none'
    })
    document.getElementById(buttons[buttonId]).style.display = 'block'
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
      console.log(data);
      localStorage.setItem('token', data.token)
      localStorage.setItem('userId', data.userId)
    })
  })
})

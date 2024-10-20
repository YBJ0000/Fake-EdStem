import { BACKEND_PORT } from './config.js';
// A helper you may want to use when uploading new images to the server.
import { fileToDataUrl } from './helpers.js';

document.getElementById('register-btn').addEventListener('click', () => {
  const email = document.getElementById('register-email').value
  const password = document.getElementById('register-password').value
  const name = document.getElementById('register-name').value

  console.log(email, password, name);

  console.log('A');

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

  console.log('B');
})
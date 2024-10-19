import { BACKEND_PORT } from './config.js';
// A helper you may want to use when uploading new images to the server.
import { fileToDataUrl } from './helpers.js';

document.getElementById('register-btn').addEventListener('click', () => {
  const email = document.getElementById('register-email').value
  const password = document.getElementById('register-password').value
  const name = document.getElementById('register-name').value

  console.log(email, password, name);
})
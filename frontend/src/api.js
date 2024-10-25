import { BACKEND_PORT } from "./config.js";

import { showAlert } from "./ui.js";

export const apiCall = (route, body, method, token) => {
  return new Promise((resolve, reject) => {
    fetch(`http://localhost:${BACKEND_PORT}/${route}`, {
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
          showAlert(errorMessage);
          reject(errorMessage)
        })
      }
      return response.json()
    }).then(data => {
      resolve(data)
    }).catch(err => {
      const errorMessage = err.message || 'Network error or unknown error occurred!'
      showAlert(errorMessage);
      reject(errorMessage)
    })
  })
}



export const showAlert = (message) => {
  const alertBox = document.getElementById('custom-alert');
  const alertMessage = document.getElementById('alert-message');
  
  alertMessage.textContent = message;
  alertBox.style.display = 'block';

  document.getElementById('close-alert').addEventListener('click', () => {
    alertBox.style.display = 'none';
  });
}


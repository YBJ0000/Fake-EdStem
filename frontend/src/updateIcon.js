export const updateLikeIcon = (liked) => {
  const likeButton = document.getElementById('like-thread-btn');
  if (liked) {
    likeButton.classList.remove('bi-heart');
    likeButton.classList.add('bi-heart-fill');
    likeButton.style.color = 'red';
  } else {
    likeButton.classList.remove('bi-heart-fill');
    likeButton.classList.add('bi-heart');
    likeButton.style.color = 'black';
  }
};

export const updateWatchIcon = (watched) => {
  const watchButton = document.getElementById('watch-thread-btn');
  if (watched) {
    watchButton.classList.remove('bi-eye');
    watchButton.classList.add('bi-eye-fill');
  } else {
    watchButton.classList.remove('bi-eye-fill');
    watchButton.classList.add('bi-eye');
  }
};

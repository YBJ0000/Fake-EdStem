import { apiCall } from './api.js';
import { showThreadContent } from './ui.js';
import { start, limit, token, updateStart } from './main.js';

export const loadThreads = () => {
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
            titleElement.classList.add('title-element')
            titleElement.innerText = `${threadData.title}`

            const authorElement = document.createElement('p')
            authorElement.classList.add('author-element')
            authorElement.innerText = `${userData.name}`

            const dateElement = document.createElement('p')
            dateElement.classList.add('date-element')
            dateElement.innerText = `${createdAt}`

            const likesElement = document.createElement('p')
            likesElement.classList.add('like-element')
            likesElement.innerText = `${likeCount}`

            const bodyElement = document.createElement('div')
            bodyElement.classList.add('body-element')
            bodyElement.appendChild(authorElement)
            bodyElement.appendChild(dateElement)
            bodyElement.appendChild(likesElement)

            threadItem.appendChild(titleElement)
            threadItem.appendChild(bodyElement)

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

    updateStart(start + limit);

    if (data.length < limit) {
      document.getElementById('thread-load-more-btn').style.display = 'none'
    } else {
      document.getElementById('thread-load-more-btn').style.display = 'block'
    }

  }).catch(error => {
    console.log('Failed to load threads:', error);
  });
}

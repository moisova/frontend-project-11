import state from './state.js'
import validate from './validator.js'
import { subscribe } from 'valtio/vanilla'
import i18n from '../locales/index.js'
import { fetchRSS } from './rss.js'
import { parseRSS } from './rss.js'

const form = document.querySelector('form')
const input = document.querySelector('input')
const submitButton = document.querySelector('button[type="submit"]')
const exampleElement = document.querySelector('p.example')

document.querySelector('h1').textContent = i18n.t('title')
document.querySelector('.subtitle').textContent = i18n.t('subtitle')
document.querySelector('.example').textContent = i18n.t('example')
submitButton.textContent = i18n.t('button')

const feedsContainer = document.querySelector('.feeds-container')
const postsContainer = document.querySelector('.posts-container')

input.addEventListener('input', (e) => {
  state.form.fields.url = e.target.value
})

form.addEventListener('submit', (e) => {
  e.preventDefault()
  state.form.processState = 'sending'
  state.form.valid = true
  state.form.error = null

  const url = state.form.fields.url
  const feeds = state.feeds

  validate(url, feeds)
    .then((validUrl) => {
      return fetchRSS(validUrl)
    })
    .then((xmlString) => {
      return parseRSS(xmlString)
    })
    .then((feedData) => {
      const feed = {
        url: url,
        title: feedData.title,
        description: feedData.description,
        id: Date.now(),
      }

      const postsWithId = feedData.posts.map(post => ({
        ...post,
        feedId: feed.id
      }))
      state.feeds.push(feed)
      state.posts.push(...postsWithId)
      console.log('Добавлен фид:', feed)
      console.log('Все фиды:', state.feeds)
      console.log('Все посты:', state.posts)
      
      state.form.fields.url = ''
      input.value = ''
      state.form.processState = 'success'
      state.form.valid = true
      state.form.error = null
    })
    .catch((error) => {
      state.form.processState = 'error'
      state.form.valid = false
      state.form.error = error
    })
})

let errorElement = document.querySelector('.error-feedback')
if (!errorElement) {
  errorElement = document.createElement('div')
  errorElement.classList.add('error-feedback', 'text-danger', 'small', 'mt-2')
  exampleElement.after(errorElement)
}

let successElement = document.querySelector('.success-feedback')
if (!successElement) {
  successElement = document.createElement('div')
  successElement.classList.add('success-feedback', 'text-success', 'small', 'mt-2')
  exampleElement.after(successElement)
}

const renderFeeds = (feeds) => {
  feedsContainer.innerHTML = ''
  const ul = document.createElement('ul')
  feeds.forEach(feed => {
    const li = document.createElement('li')
    li.className = 'mb-4'
    const titleEl = document.createElement('h4')
    titleEl.classList.add('text-dark')
    titleEl.textContent = feed.title

    const descEl = document.createElement('p')
    descEl.classList.add('text-secondary')
    descEl.textContent = feed.description

    li.appendChild(titleEl)
    li.appendChild(descEl)
    ul.appendChild(li)
  })
  feedsContainer.appendChild(ul)

}

const renderPosts = (posts) => {
  postsContainer.innerHTML = ''
  const ul = document.createElement('ul')
  posts.forEach(post => {
    const li = document.createElement('li')
    li.classList.add('d-flex', 'justify-content-between', 'align-items-center', 'mb-2')
    
    const link = document.createElement('a')
    link.setAttribute('href', post.link)
    link.setAttribute('target', '_blank')
    link.textContent = post.title

    const button = document.createElement('button')
    button.textContent = 'Просмотр'
    button.classList.add('btn', 'btn-link', 'btn-sm')

    li.appendChild(link)
    li.appendChild(button)
    ul.appendChild(li)
  })
  postsContainer.appendChild(ul)
}

subscribe(state.form, () => {
  if (state.form.valid) {
    input.classList.remove('is-invalid')
  } 
  else {
    input.classList.add('is-invalid')
  }

  if(state.form.processState === 'error') {
    errorElement.textContent = i18n.t(state.form.error)
    successElement.textContent = ''
  } else if (state.form.processState === 'success') {
    successElement.textContent = i18n.t('success')
    errorElement.textContent = ''
  } else {
    successElement.textContent = ''
    errorElement.textContent = ''
  }
})

subscribe(state.feeds, () => {
  renderFeeds(state.feeds)
})

subscribe(state.posts, () => {
  renderPosts(state.posts)
})
import state from './state.js'
import validate from './validator.js'
import { subscribe } from 'valtio/vanilla'

const form = document.querySelector('form')
const input = document.querySelector('input')
const submitButton = document.querySelector('button[type="submit"]')
const exampleElement = document.querySelector('p.example')

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
      state.feeds.push(validUrl)
      state.form.fields.url = ''
      input.value = ''
      state.form.processState = 'success'
      state.form.valid = true
      state.form.error = null
    })
    .catch((errorMessage) => {
      state.form.processState = 'error'
      state.form.valid = false
      state.form.error = errorMessage
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

subscribe(state.form, () => {
  if (state.form.valid) {
    input.classList.remove('is-invalid')
  } 
  else {
    input.classList.add('is-invalid')
  }

  if(state.form.processState === 'error') {
    errorElement.textContent = state.form.error
    successElement.textContent = ''
  } else if (state.form.processState === 'success') {
    successElement.textContent = 'RSS успешно загружен'
    errorElement.textContent = ''
  } else {
    successElement.textContent = ''
    errorElement.textContent = ''
  }
})
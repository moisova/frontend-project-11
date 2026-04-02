import state from "./state"
import * as bootstrap from "bootstrap"

const modalDiv = document.createElement('div')
modalDiv.id = 'modal'
modalDiv.className = 'modal fade'
modalDiv.setAttribute('tabindex', '-1')
modalDiv.innerHTML = `
  <div class="modal-dialog modal-dialog-centered">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title"></h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
      </div>
      <div class="modal-body"></div>
      <div class="modal-footer">
        <a href="#" class="btn btn-primary" target="_blank">Читать полностью</a>
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Закрыть</button>
      </div>
    </div>
  </div>
`
document.body.appendChild(modalDiv)

const titleEl = modalDiv.querySelector('.modal-title')
const bodyEl = modalDiv.querySelector('.modal-body')
const linkEl = modalDiv.querySelector('.modal-footer a')
const modal = new bootstrap.Modal(modalDiv)

export const showModal = (post) => {

  titleEl.textContent = post.title
  bodyEl.textContent = post.description
  linkEl.href = post.link
  
  modal.show()
  
  if (!state.readPosts.includes(post.link)) {
    state.readPosts.push(post.link)
    const linkElement = document.querySelector(`a[href="${post.link}"]`)
    if (linkElement) {
      linkElement.classList.remove('fw-bold')
      linkElement.classList.add('link-secondary')
    }
  }
}
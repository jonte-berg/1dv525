'use strict'

import Chat from './components/chat/chat.component'
import News from './components/news/news.component'
import Memory from './components/memory/memory.component'
var id = 0

/** Handle header events. Assign unique id to each new app */
const handleHeader = () => {
  document.querySelector('nav').addEventListener('click', event => {
    if (event.target.tagName === 'I') { event.target.id = event.target.parentElement.id }
    switch (event.target.id) {
      case 'chat': openApp(new Chat(++id))
        break
      case 'memory': openApp(new Memory(++id))
        break
      case 'news': openApp(new News(++id))
    }
  })
}

/**
 * @param {Object} app
 * Open the app and add drag drop events to it
 */
const openApp = (app) => {
  app.open()
  addDragAndDrop(document.querySelector(app.getId()))
}

const addDragAndDrop = (app) => {
  app.ondragover = (e) => e.preventDefault()

  app.addEventListener('dragstart', (event) => {
    let style = window.getComputedStyle(event.target, null)
    event.dataTransfer.setData('text/plain', (parseInt(style.getPropertyValue('left'), 10) - event.clientX) + ',' + (parseInt(style.getPropertyValue('top'), 10) - event.clientY))
    event.dataTransfer.setData('id', event.target.id)
    event.target.remove()
    document.querySelector('main').appendChild(event.target)
  })

  document.body.addEventListener('drop', (event) => {
    let offset = event.dataTransfer.getData('text/plain').split(',')
    let div = document.querySelector('#' + event.dataTransfer.getData('id'))
    div.style.left = (event.clientX + parseInt(offset[0], 10)) + 'px'
    div.style.top = (event.clientY + parseInt(offset[1], 10)) + 'px'
    event.preventDefault()
  })
}

handleHeader()
document.body.ondragover = (event) => event.preventDefault()

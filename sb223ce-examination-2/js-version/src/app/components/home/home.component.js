'use strict'

module.exports.display = (subscriber) => {
  handleRulesOverlay()
  startGame('#play-button', 'click', subscriber)
}

module.exports.getPath = () => { return 'link[href="app/components/home/home.component.html"]' }

const startGame = (id, type, subscriber) => {
  document.querySelector(id).addEventListener(type, event => {
    let nickname = ('' + document.querySelector('#nickname-input').value).trim()
    if (nickname.length > 0) {
      document.querySelector('#home-template').remove()
      subscriber(nickname)
    } else { document.querySelector('.error-message').classList.remove('is-hide') }
  })
}

const handleRulesOverlay = () => {
  document.querySelector('#rules-button').addEventListener('click', event => {
    document.querySelector('.home-section-main').classList.add('is-hide')
    document.querySelector('.overlay').classList.add('open-overlay')
  })
  document.querySelector('.close-button').addEventListener('click', event => {
    document.querySelector('.overlay').classList.remove('open-overlay')
    document.querySelector('.home-section-main').classList.remove('is-hide')
  })
}

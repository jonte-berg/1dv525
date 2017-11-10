'use strict'

const homeComponent = require('./components/home/home.component')
const gameComponent = require('./components/game/game.component')

document.addEventListener('DOMContentLoaded', () => { startGame() })

const startGame = () => {
  importComponent(homeComponent)
  homeComponent.display(nickname => {
    importComponent(gameComponent)
    gameComponent.display(nickname, startGame)
  })
}

const importComponent = (component) => {
  var link = document.querySelector(component.getPath())
  var template = link.import.querySelector('template')
  var clone = document.importNode(template.content, true)
  document.querySelector('main').appendChild(clone)
}

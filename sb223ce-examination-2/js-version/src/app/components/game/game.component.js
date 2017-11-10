'use strict'

const totalTime = 20
var countdown = totalTime
var response
var timeUsed = 0
var interval = null
var nickname

module.exports.display = (name, subscriber) => {
  nickname = name
  getQuestion()
  getAnswer('.alternatives button', 'click')
  getAnswer('.answer-input', 'change')
  restartGame(subscriber)
}

module.exports.getPath = () => { return 'link[href="app/components/game/game.component.html"]' }

const getQuestion = (url = 'http://vhost3.lnu.se:20080/question/1') => {
  window.fetch(url)
    .then(res => { if (res.ok) { return res.json() } else { throw new Error() } })
    .then(result => {
      document.querySelector('.question').textContent = (response = result).question
      if (response.alternatives) { displayAlternatives(response.alternatives) } else { hideAlternatives() }
      startTimer()
    })
    .catch(() => getQuestion())
}

const getAnswer = (clas, type) => {
  document.querySelectorAll(clas).forEach(element => {
    element.addEventListener(type, event => {
      stopTimer()
      window.fetch(response.nextURL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 'answer': event.target.tagName === 'INPUT' ? event.target.value : event.target.id })
      })
        .then(res => { if (res.ok) { return res.json() } else { throw new Error() } })
        .then(result => { if ((response = result).nextURL) { getQuestion(response.nextURL) } else { gameOver() } })
        .catch(() => gameOver())
    })
  })
}

const displayAlternatives = (alternatives) => {
  let array = [alternatives.alt1, alternatives.alt2, alternatives.alt3, alternatives.alt4]
  document.querySelectorAll('.alternatives button').forEach((button, index) => {
    array[index] === undefined ? button.classList.add('is-hide') : button.classList.remove('is-hide')
    button.textContent = array[index]
  })
  document.querySelector('.alternatives').classList.remove('is-hide')
  document.querySelector('.answer-input').classList.add('is-hide')
}

const hideAlternatives = () => {
  document.querySelector('.answer-input').classList.remove('is-hide')
  document.querySelector('.alternatives').classList.add('is-hide')
  document.querySelector('.answer-input').value = ''
  document.querySelector('.answer-input').focus()
}

const gameOver = () => {
  stopTimer()
  if (!response.nextURL) {
    document.querySelector('#game-over-header').textContent = nickname + ', You Won!!'
    document.querySelector('#score').textContent = 'Score: ' + timeUsed + ' sec'
    displayHighScores()
  }
  document.querySelector('#game').classList.add('is-hide')
  document.querySelector('#game-over').classList.remove('is-hide')
}

const restartGame = (subscriber) => {
  document.querySelector('#restart-btn').addEventListener('click', event => {
    document.querySelector('#game-component').remove()
    timeUsed = 0
    interval = null
    subscriber()
  })
}

const displayHighScores = () => {
  let players = JSON.parse(window.localStorage.getItem('players')) === null ? [] : JSON.parse(window.localStorage.getItem('players'))
  players.push({ name: nickname, score: timeUsed })
  players.sort((p1, p2) => { return p1.score - p2.score })
  players.splice(5, 1)
  let elements = document.querySelectorAll('#high-score ol li')
  players.forEach((player, index) => { elements[index].textContent = player.name + ': ' + player.score + ' sec' })
  document.querySelector('#high-score').classList.remove('is-hide')
  window.localStorage.setItem('players', JSON.stringify(players))
}

const startTimer = () => {
  document.querySelector('.timer').textContent = (countdown = totalTime)
  interval = setInterval(() => {
    document.querySelector('.timer').textContent = --countdown
    if (countdown <= 0) { gameOver() }
  }, 1000)
}

const stopTimer = () => {
  clearInterval(interval)
  timeUsed += totalTime - countdown
}

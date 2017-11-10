'use strict'

module.exports = class Memory {
  /**
   * @param {string} id
   * Create an object with given id and assign value to its properties
   */
  constructor (id) {
    this.id = 'memory' + id
    this.images = []
    this.currentImage = null
    this.imagesLeft = null
    this.interval = null
    this.timer = null
    this.matrix = { rows: 4, columns: 4 }
  }

  /** Clone template, add events to it and display it */
  open () {
    document.querySelector('main').appendChild(this.cloneTemplate('#app'))
    this.setIdToElements()
    this.addEventToElements()
    this.addSettings()
    this.showGame()
  }

  /** Stop timer and close close it */
  close () {
    if (this.interval !== null) {
      this.stopTimer()
    }
    document.querySelector(this.getId()).remove()
  }

  /**
   * @param {number} size
   * Create array based on size, shuffle and return it
   */
  shuffle (size) {
    switch (size) {
      case 16: return [1, 2, 3, 4, 5, 6, 7, 8, 8, 7, 6, 5, 4, 3, 2, 1].sort(() => Math.random() - 0.5)
      case 8: return [1, 2, 3, 4, 4, 3, 2, 1].sort(() => Math.random() - 0.5)
      case 4: return [1, 1, 2, 2].sort(() => Math.random() - 0.5)
    }
  }

  /** Make game board and diplay it */
  showGame () {
    this.makeBoard(this.matrix.rows, this.matrix.columns)
    if (document.querySelector('#' + this.id + '-images').classList.contains('dimmer')) {
      document.querySelector('#' + this.id + '-images').classList.remove('ui', 'dimmer')
      document.querySelector('#' + this.id + '-settingsDiv').classList.add('ui', 'dimmer')
    }
    if (!document.querySelector('#' + this.id + '-message').classList.contains('dimmer')) {
      document.querySelector('#' + this.id + '-message').classList.add('ui', 'dimmer')
    }
  }

  /**
   * @param {number} rows
   * @param {number} columns
   * Make game board based on given parameters. Delete existing elememts if available. Assign values to class fields based on board * size
   */
  makeBoard (rows, columns) {
    Array.prototype.forEach.call(document.querySelectorAll('#' + this.id + '-images br'), element => element.remove())
    Array.prototype.forEach.call(document.querySelectorAll('#' + this.id + '-images a'), element => element.remove())
    for (var i = 1; i <= rows * columns; i++) {
      let element = this.cloneTemplate('#image')
      element.firstElementChild.setAttribute('id', i)
      document.querySelector('#' + this.id + '-images').appendChild(element)
      if (columns === 2 && i === 2) {
        document.querySelector('#' + this.id + '-images').classList.add('twoByTwo')
      }
    }
    this.images = this.shuffle(rows * columns)
    this.imagesLeft = rows * columns
    this.currentImage = null
    document.querySelector('#' + this.id + '-attempts').textContent = '0 attempts'
    document.querySelector('#' + this.id + '-clock').textContent = '00:00:' + (this.timer === null ? '00' : this.timer)
    this.stopTimer()
  }

  /** Save settings in order to dynamically change the game */
  handleSettings (event) {
    if (event.target.tagName === 'INPUT') {
      switch (event.target.id) {
        case 'twoByFour': this.matrix = { rows: 2, columns: 4 }
          break
        case 'twoByTwo': this.matrix = { rows: 2, columns: 2 }
          break
        case 'fourByFour': this.matrix = { rows: 4, columns: 4 }
          break
        case 'sixtySec': document.querySelector('#' + this.id + '-clock').textContent = '00:00:' + (this.timer = 60)
          break
        case 'thirtySec': document.querySelector('#' + this.id + '-clock').textContent = '00:00:' + (this.timer = 30)
          break
        case 'tenSec': document.querySelector('#' + this.id + '-clock').textContent = '00:00:' + (this.timer = 10)
          break
        case 'none': document.querySelector('#' + this.id + '-clock').textContent = '00:00:00'
          this.timer = null
      }
    }
  }

  addSettings () {
    ['fourByFour', 'twoByFour', 'twoByTwo', 'sixtySec', 'thirtySec', 'tenSec', 'none'].forEach((id, index) => {
      let element = this.cloneTemplate('#checkbox')
      element.firstElementChild.firstElementChild.firstElementChild.setAttribute('id', id)
      if (index === 0 || index === 6) {
        element.firstElementChild.firstElementChild.firstElementChild.setAttribute('checked', 'true')
      }
      if (index <= 2) {
        element.firstElementChild.firstElementChild.lastElementChild.textContent = ['4 x 4', '2 x 4', '2 x 2'][index]
        document.querySelector('#' + this.id + '-size').appendChild(element)
      } else {
        element.firstElementChild.firstElementChild.firstElementChild.setAttribute('name', 'timer')
        element.firstElementChild.firstElementChild.lastElementChild.textContent = ['60 sec', '30 sec', '10 sec', 'none'][index - 3]
        document.querySelector('#' + this.id + '-timer').appendChild(element)
      }
    })
  }

  /** Stop timer and show settings */
  showSettings () {
    this.stopTimer()
    if (document.querySelector('#' + this.id + '-settingsDiv').classList.contains('dimmer')) {
      document.querySelector('#' + this.id + '-settingsDiv').classList.remove('ui', 'dimmer')
      document.querySelector('#' + this.id + '-images').classList.add('ui', 'dimmer')
      document.querySelector('#' + this.id + '-message').classList.add('ui', 'dimmer')
    }
  }

  /**
   * @param {Event} event
   * Start time if not started, then if clicked tile have default image show the image and compare it if possible
   */
  showImage (event) {
    if (this.interval === null) {
      this.startTimer()
    }
    let element = event.target.tagName === 'IMG' ? event.target : event.target.firstElementChild
    if (element.getAttribute('src') === 'assets/image/0.png') {
      element.setAttribute('src', 'assets/image/' + this.images[element.parentElement.id - 1] + '.png')
      this.currentImage === null ? this.currentImage = element : setTimeout(() => this.compareImages(element), 1000)
    }
  }

  /**
   * @param {DOMElement} image
   * If current image is null, set its src default and return. If given image is same to current image then hide both and decrease   * value, otherwise make the current set default src to both. In both cases, set the current image to null, increment the attempts * and stop if game is finished
   */
  compareImages (image) {
    if (this.currentImage === null) {
      image.setAttribute('src', 'assets/image/0.png')
      return
    }
    if (this.currentImage.getAttribute('src') === image.getAttribute('src')) {
      image.parentElement.classList.add('hide')
      this.currentImage.parentElement.classList.add('hide')
      this.imagesLeft -= 2
    } else {
      image.setAttribute('src', 'assets/image/0.png')
      this.currentImage.setAttribute('src', 'assets/image/0.png')
    }
    this.currentImage = null
    let attempts = parseInt(++document.querySelector('#' + this.id + '-attempts').textContent.split(' ')[0])
    document.querySelector('#' + this.id + '-attempts').textContent = attempts + ' attempts'
    if (this.imagesLeft === 0) {
      this.gameOver('You Won.')
    }
  }

  /**
   * @param {string} text
   * Display given text when game is over
   */
  gameOver (text) {
    this.stopTimer()
    document.querySelector('#' + this.id + '-message').firstElementChild.textContent = text
    document.querySelector('#' + this.id + '-images').classList.add('ui', 'dimmer')
    document.querySelector('#' + this.id + '-message').classList.remove('ui', 'dimmer')
  }

  /** Start timer, decrement it if user has not set timer else do increment */
  startTimer () {
    let time = { hour: 0, min: 0, sec: 0 }
    this.interval = setInterval(() => {
      time.sec = parseInt(document.querySelector('#' + this.id + '-clock').textContent.trim().split(':')[2])
      if (this.timer === null) {
        time.sec++
        if (time.sec >= 60) {
          time.min++
          time.sec = 0
        }
        if (time.min >= 60) {
          time.hour++
          time.min = 0
        }
      } else {
        time.sec--
      }
      document.querySelector('#' + this.id + '-clock').textContent = (time.hour < 10 ? '0' + time.hour : time.hour) +
        ':' + (time.min < 10 ? '0' + time.min : time.min) + ':' + (time.sec < 10 ? '0' + time.sec : time.sec)
      if (time.sec === 0 && this.imagesLeft !== 0 && this.timer !== null) {
        this.gameOver('You Lost.')
      }
    }, 1000)
  }

  stopTimer () {
    clearInterval(this.interval)
    this.interval = null
  }

  /**
   * @param {string} templateID
   * Clone template based on id and return its content
   */
  cloneTemplate (templateID) {
    let link = document.querySelector('link[href="app/components/memory/memory.component.html"]')
    let template = link.import.querySelector(templateID)
    return document.importNode(template.content, true)
  }

  getId () {
    return '#' + this.id + '-app'
  }

  setIdToElements () {
    ['#memory-app', '#memory-close', '#memory-settings', '#memory-content', '#memory-extraContent', '#memory-attempts', '#memory-clock', '#memory-images', '#memory-settingsDiv', '#memory-doneBtn', '#memory-size', '#memory-timer', '#memory-restart', '#memory-message'].forEach(id => document.querySelector(id).setAttribute('id', this.id + '-' + id.split('-')[1]))
  }

  addEventToElements () {
    document.querySelector('#' + this.id + '-close').addEventListener('click', this.close.bind(this))
    document.querySelector('#' + this.id + '-images').addEventListener('click', this.showImage.bind(this))
    document.querySelector('#' + this.id + '-settings').addEventListener('click', this.showSettings.bind(this))
    document.querySelector('#' + this.id + '-doneBtn').addEventListener('click', this.showGame.bind(this))
    document.querySelector('#' + this.id + '-size').addEventListener('click', this.handleSettings.bind(this))
    document.querySelector('#' + this.id + '-restart').addEventListener('click', this.showGame.bind(this))
    document.querySelector('#' + this.id + '-timer').addEventListener('click', this.handleSettings.bind(this))
    document.querySelector('#' + this.id + '-images').addEventListener('keydown', this.handleKeys.bind(this))
  }

  /** Extra feature for play the game with arrow keys */
  handleKeys (event) {
    let element = event.target
    switch (event.key) {
      case 'ArrowLeft':
        if (element.previousElementSibling === null) {
          element.focus()
        } else {
          while (element.previousElementSibling !== null && element.previousElementSibling.classList.contains('hide')) {
            element = element.previousElementSibling
          }
          element.previousElementSibling === null ? element.focus() : element.previousElementSibling.focus()
        }
        break
      case 'ArrowRight':
        if (element.nextElementSibling === null) {
          element.focus()
        } else {
          while (element.nextElementSibling !== null && element.nextElementSibling.classList.contains('hide')) {
            element = element.nextElementSibling
          }
          element.nextElementSibling === null ? element.focus() : element.nextElementSibling.focus()
        }
        break
      case 'ArrowUp':
        if (element.previousElementSibling === null) {} else if (element.id > this.matrix.columns) {
          do {
            for (let i = 0; i < this.matrix.columns; i++) {
              element = element.previousElementSibling
            }
          } while (element.classList.contains('hide') && element.id > this.matrix.columns)
        } else {
          do {
            for (let i = 0; i < this.matrix.rows - 1; i++) {
              for (let i = 0; i < this.matrix.columns; i++) {
                element = element.nextElementSibling
              }
            }
          } while (element.classList.contains('hide') && element.id <= this.matrix.columns)
          element = element.previousElementSibling
        }
        element.focus()
        break
      case 'ArrowDown':
        if (element.nextElementSibling === null) { } else if
        (parseInt(element.id) + this.matrix.columns <= this.matrix.rows * this.matrix.columns) {
          do {
            for (let i = 0; i < this.matrix.columns; i++) {
              element = element.nextElementSibling
            }
          } while (element.classList.contains('hide') && parseInt(element.id) + this.matrix.columns <= this.matrix.rows * this.matrix.columns)
        } else {
          do {
            for (let i = 0; i < this.matrix.rows - 1; i++) {
              for (let i = 0; i < this.matrix.columns; i++) {
                element = element.previousElementSibling
              }
            }
          } while (element.classList.contains('hide') && parseInt(element.id) + this.matrix.columns > this.matrix.rows * this.matrix.columns)
          element = element.nextElementSibling
        }
        element.focus()
    }
  }
}

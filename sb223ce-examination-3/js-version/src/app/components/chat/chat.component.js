'use strict'

module.exports = class Chat {
  /**
   * @param {string} id
   * Create an object with given id and assign value to its properties
   */
  constructor (id) {
    this.id = 'chat' + id
    this.socket = null
    this.username = window.localStorage.getItem('chat') === null ? '' : JSON.parse(window.localStorage.getItem('chat')).username
    this.channel = window.localStorage.getItem('chat') === null ? '' : JSON.parse(window.localStorage.getItem('chat')).channel
    this.messages = null
  }

  /** Append template then set id, add events and open app */
  open () {
    document.querySelector('main').appendChild(this.cloneTemplate('#app'))
    this.setIdToElements()
    this.addEventToElements()
    this.username === '' ? this.showSettings() : this.showMessagesList()
  }

  close () {
    if (this.socket !== null) {
      this.socket.close()
    }
    document.querySelector(this.getId()).remove()
  }

  /** Connect socket and then return it in promise. Whenever gets message, call the given method */
  connect () {
    return new Promise((resolve, reject) => {
      this.socket = new window.WebSocket('ws://vhost3.lnu.se:20080/socket/')
      this.socket.onopen = () => resolve(this.socket)
      this.socket.onerror = () => reject(this.socket)
      this.socket.onmessage = (event) => this.showMessage(JSON.parse(event.data))
    })
  }

  /**
   * @param {Event} event
   * Send message when enter key is pressed
   */
  sendMessage (event) {
    if (event.keyCode === 13) {
      this.socket.send(JSON.stringify({
        type: 'message',
        data: event.target.value,
        username: this.username,
        channel: this.channel,
        key: 'eDBE76deU7L0H9mEBgxUKVR0VCnq0XBd'
      }))
      event.target.value = ''
      event.preventDefault()
    }
  }

  /**
   * @param {Object} response
   * Clone the template and set the data and show it. Save message in list if user is in setting mode. Play sound too.
   */
  showMessage (response) {
    if (response.type !== 'heartbeat') {
      let message = this.cloneTemplate('#message')
      Array.prototype.forEach.call(message.children[0].children[0].children, child => {
        switch (child.getAttribute('class')) {
          case 'author': child.textContent = response.username
            break
          case 'metadata': child.children[0].textContent = response.date ? response.date : this.timeStamp(new Date())
            break
          case 'text': child.textContent = response.data
        }
      })
      if (document.querySelector('#' + this.id + '-messagesList').classList.contains('dimmer')) {
        this.messages.firstElementChild.appendChild(message)
      } else {
        document.querySelector('#' + this.id + '-messagesList').appendChild(message)
      }
      this.playSound()
    }
  }

  showSettings () {
    document.querySelector('#' + this.id + '-username').value = this.username
    document.querySelector('#' + this.id + '-channel').value = this.channel
    document.querySelector('#' + this.id + '-settingsDiv').classList.remove('ui', 'dimmer')
    document.querySelector('#' + this.id + '-messagesDiv').classList.add('ui', 'dimmer')
  }

  /** Connect if not connected and show the new messages list if open first time else show with existing messages */
  showMessagesList () {
    if (this.socket === null) {
      this.connect()
        .then(socket => this.sendMessage(socket))
        .catch(() => document.querySelector('#' + this.id + '-extraContent').classList.remove('dimmer'))
    }
    if (this.messages !== null) {
      document.querySelector('#' + this.id + '-messsagesList').appendChild(this.messages)
      this.messages = null
    }
    document.querySelector('#' + this.id + '-settingsDiv').classList.add('ui', 'dimmer')
    document.querySelector('#' + this.id + '-messagesDiv').classList.remove('ui', 'dimmer')
  }

  /** Clone tempate and play the sound */
  playSound () {
    this.cloneTemplate('#sound').firstElementChild.play()
  }

  /**
   * @param {Date} stamp
   * Return the current date and time
   */
  timeStamp (stamp) {
    return stamp.toDateString().split(' ')[2] + ' ' + stamp.toDateString().split(' ')[1] + ' at ' + stamp.toTimeString().substring(0, 5)
  }

  /** Save the data and show the messsages */
  saveUserData () {
    let username = ('' + document.querySelector('#' + this.id + '-username').value).trim()
    let channel = ('' + document.querySelector('#' + this.id + '-channel').value).trim()
    if (username.length > 0 && channel.length > 0) {
      window.localStorage.setItem('chat', JSON.stringify({
        username: (this.username = username),
        channel: (this.channel = channel)
      }))
      this.showMessagesList()
    }
  }

  /**
   * @param {string} templateID
   * Clone and return the template
   */
  cloneTemplate (templateID) {
    let link = document.querySelector('link[href="app/components/chat/chat.component.html"]')
    let template = link.import.querySelector(templateID)
    return document.importNode(template.content, true)
  }

  getId () {
    return '#' + this.id + '-app'
  }

  setIdToElements () {
    ['#chat-app', '#chat-close', '#chat-settings', '#chat-content', '#chat-messagesList', '#chat-messagesDiv', '#chat-textarea', '#chat-settingsDiv', '#chat-username', '#chat-channel', '#chat-doneBtn', '#chat-extraContent']
      .forEach(id => document.querySelector(id).setAttribute('id', this.id + '-' + id.split('-')[1]))
  }

  addEventToElements () {
    document.querySelector('#' + this.id + '-close').addEventListener('click', this.close.bind(this))
    document.querySelector('#' + this.id + '-settings').addEventListener('click', this.showSettings.bind(this))
    document.querySelector('#' + this.id + '-textarea').addEventListener('keydown', this.sendMessage.bind(this))
    document.querySelector('#' + this.id + '-doneBtn').addEventListener('click', this.saveUserData.bind(this))
  }
}

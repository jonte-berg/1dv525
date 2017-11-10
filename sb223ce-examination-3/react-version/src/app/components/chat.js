import React from 'react'
import PropTypes from 'prop-types'

export class Chat extends React.Component {
  constructor () {
    super()
    this.state = {
      socket: new window.WebSocket('ws://vhost3.lnu.se:20080/socket/'),
      username: window.localStorage.getItem('chat') === null ? '' : JSON.parse(window.localStorage.getItem('chat')).username,
      channel: window.localStorage.getItem('chat') === null ? '' : JSON.parse(window.localStorage.getItem('chat')).channel,
      isMainView: window.localStorage.getItem('chat') !== null,
      messages: [],
      isError: false
    }
    this.ping()
  }

  close () {
    this.state.socket.close()
    document.querySelector('#' + this.props.id).remove()
  }

  connect () {
    return new Promise((resolve, reject) => {
      this.state.socket.onopen = () => resolve(this.state.socket)
      this.state.socket.onerror = () => reject(this.state.socket)
      this.state.socket.onmessage = (event) => this.addMessage(JSON.parse(event.data))
    })
  }

  ping () {
    this.connect()
      .then(socket => this.setState({ socket: socket }))
      .catch(() => this.showError())
  }

  sendMessage (event) {
    if (event.key === 'Enter') {
      this.state.socket.send(JSON.stringify({
        type: 'message',
        data: event.target.value,
        username: this.state.username,
        channel: this.state.channel,
        key: 'eDBE76deU7L0H9mEBgxUKVR0VCnq0XBd'
      }))
      event.target.value = ''
      event.preventDefault()
    }
  }

  timeStamp (stamp) {
    return stamp.toDateString().split(' ')[2] + ' ' + stamp.toDateString().split(' ')[1] + ' at ' + stamp.toTimeString().substring(0, 5)
  }

  handleUsername (event) { this.setState({ username: ('' + event.target.value).trim() }) }

  handleChannel (event) { this.setState({ channel: ('' + event.target.value).trim() }) }

  showSettings () { this.setState({ isMainView: false }) }

  showError () { this.setState({ isError: true }) }

  showMainView () {
    this.setState({ isMainView: this.state.username.length > 0 && this.state.channel.length > 0 })
    if (this.state.username.length > 0 && this.state.channel.length > 0) {
      window.localStorage.setItem('chat', JSON.stringify({
        username: this.state.username,
        channel: this.state.channel
      }))
    }
  }

  render () {
    return (
      <div id={this.props.id} draggable='true' onDragOver={this.props.dragOver} onDragStart={this.props.dragStart} className='ui card'>
        <div id='header' className='content'>
          <i className='circular talk icon' />Chat
          <i className='right floated circular close icon link' onClick={this.close.bind(this)} />
          <i className='right floated circular setting icon link' onClick={this.showSettings.bind(this)} />
        </div>
        <div className='content'>
          {this.state.isError ? this.error() : (this.state.isMainView ? this.messages() : this.settings())}
        </div>
      </div>
    )
  }

  addMessage (response) {
    if (response.type !== 'heartbeat') {
      let arr = this.state.messages
      arr.push(
        <div className='comment'>
          <div className='content'>
            <span className='author'>{response.username}</span>
            <div className='metadata'>
              <span className='date'>{this.timeStamp(new Date())}</span>
            </div>
            <div className='text'>{response.data}</div>
          </div>
        </div>
      )
      this.setState({messages: arr})
      if (this.state.username !== '') { document.querySelector('audio').play() }
    }
  }

  error () {
    return (
      <div className='ui extra content'>
        <div className='ui icon message'>
          <div className='content'>Connection failed, invalid address.</div>
        </div>
      </div>
    )
  }

  messages () {
    return (
      <div>
        <div className='ui comments chat-content-area'>
          {this.state.messages.map((child, index) => <div key={index}>{child}</div>)}
        </div>
        <form className='ui reply form'>
          <div className='field'>
            <textarea placeholder='Type a message...' onKeyDown={this.sendMessage.bind(this)} />
          </div>
        </form>
      </div>
    )
  }

  settings () {
    return (
      <div>
        <div className='ui fluid icon input'>
          <input type='text' value={this.state.username} placeholder='Add a username' onChange={this.handleUsername.bind(this)} />
          <i className='user icon' />
        </div>
        <br />
        <div className='ui fluid icon input'>
          <input type='text' value={this.state.channel} placeholder='Add a channel' onChange={this.handleChannel.bind(this)} />
          <i className='rss icon' />
        </div>
        <br />
        <div className='ui bottom attached button' onClick={this.showMainView.bind(this)}>Done</div>
      </div>
    )
  }
}

Chat.propTypes = {
  id: PropTypes.string,
  dragStart: PropTypes.func,
  dragOver: PropTypes.func
}

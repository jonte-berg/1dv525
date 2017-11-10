import React from 'react'
import { render } from 'react-dom'
import { Header } from './components/header'
import { Chat } from './components/chat'
import { Memory } from './components/memory'
import { News } from './components/news'

class App extends React.Component {
  constructor () {
    super()
    this.state = {
      id: 1,
      apps: []
    }
    document.body.ondragover = (event) => event.preventDefault()
    document.body.ondrop = (event) => {
      let offset = event.dataTransfer.getData('text/plain').split(',')
      let div = document.querySelector('#' + event.dataTransfer.getData('id'))
      div.style.left = (event.clientX + parseInt(offset[0], 10)) + 'px'
      div.style.top = (event.clientY + parseInt(offset[1], 10)) + 'px'
      event.preventDefault()
    }
  }

  openApp (event) {
    event.target.tagName === 'I' ? event.target.id = event.target.parentElement.id : event.target.id = event.target.id
    let arr = this.state.apps
    switch (event.target.id) {
      case 'chat': arr.push(
        <Chat id={'chat' + this.state.id} dragStart={this.handleDragStart.bind(this)} dragOver={this.handleDragOver.bind(this)} />)
        break
      case 'memory': arr.push(
        <Memory id={'memory' + this.state.id} dragStart={this.handleDragStart.bind(this)} dragOver={this.handleDragOver.bind(this)} />)
        break
      case 'news': arr.push(
        <News id={'news' + this.state.id} dragStart={this.handleDragStart.bind(this)} dragOver={this.handleDragOver.bind(this)} />)
        break
    }
    this.setState({
      id: this.state.id + 1,
      apps: arr
    })
  }

  handleDragOver (event) { event.preventDefault() }

  handleDragStart (event) {
    let style = window.getComputedStyle(event.target, null)
    event.dataTransfer.setData('text/plain', (parseInt(style.getPropertyValue('left'), 10) - event.clientX) + ',' + (parseInt(style.getPropertyValue('top'), 10) - event.clientY))
    event.dataTransfer.setData('id', event.target.id)
    event.target.remove()
    document.querySelector('main').appendChild(event.target)
  }

  render () {
    return (
      <div id='app'>
        <Header openApp={this.openApp.bind(this)} />
        <main>
          {this.state.apps.map((child, index) => <div key={index}>{child}</div>)}
        </main>
      </div>
    )
  }
}

render(<App />, document.querySelector('#root'))

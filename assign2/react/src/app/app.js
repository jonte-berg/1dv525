import React from 'react'
import { render } from 'react-dom'
import { Home } from './components/home'
import { Quiz } from './components/quiz'

class App extends React.Component {
  constructor () {
    super()
    this.state = { isQuizView: false, nickname: '' }
  }

  showQuiz () { this.setState({ isQuizView: this.state.nickname !== '' }) }

  restart () { this.setState({ isQuizView: false, nickname: '' }) }

  handleNickname (event) { this.setState({ nickname: event.target.value.trim() }) }

  render () {
    return (
      this.state.isQuizView ? <Quiz restart={this.restart.bind(this)} nickname={this.state.nickname} />
      : <Home showQuiz={this.showQuiz.bind(this)} handleNickname={this.handleNickname.bind(this)} nickname={this.state.nickname} />
    )
  }
}
render(<App />, document.querySelector('#root'))

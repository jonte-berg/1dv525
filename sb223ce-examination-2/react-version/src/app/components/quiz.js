import React from 'react'

export class Quiz extends React.Component {
  constructor () {
    super()
    this.state = {
      coundtdown: 20,
      interval: null,
      response: {},
      isQuizOver: false
    }
    this.timeUsed = 0
    document.querySelector('body').classList.remove('home-background', 'rules-background')
    document.querySelector('body').classList.add('quiz-background')
  }

  componentWillMount () {
    this.fetchQuestion()
  }

  fetchQuestion (url = 'http://vhost3.lnu.se:20080/question/1') {
    window.fetch(url)
    .then(res => { if (res.ok) { return res.json() } else { throw new Error() } })
      .then(response => this.setState({ response: response }))
      .then(() => this.startTimer())
      .catch(() => this.fetchQuestion())
  }

  postAnswer (event) {
    if (event.target.tagName === 'BUTTON' || event.key === 'Enter') {
      this.timeUsed += 20 - this.state.coundtdown
      window.fetch(this.state.response.nextURL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 'answer': event.target.tagName === 'INPUT' ? event.target.value : event.target.id })
      })
      .then(res => { if (res.ok) { return res.json() } else { throw new Error() } })
      .then(response => response.nextURL ? this.fetchQuestion(response.nextURL) : this.showQuizOver(response))
      .catch(() => this.showQuizOver())
    }
  }

  showQuizOver (response = '') {
    this.stopTimer()
    this.setState({ isQuizOver: true, response: response || this.state.response })
  }

  startTimer () {
    if (this.state.interval === null) {
      this.state.interval = setInterval(() => {
        this.setState({ coundtdown: --this.state.coundtdown })
        if (this.state.coundtdown <= 0) { this.showQuizOver() }
      }, 1000)
    } else { this.setState({ coundtdown: 20 }) }
  }

  stopTimer () {
    clearInterval(this.state.interval)
    this.setState({ interval: null })
  }

  highScores () {
    let players = window.localStorage.getItem('players') === null ? [] : JSON.parse(window.localStorage.getItem('players'))
    players.push({ name: this.props.nickname, score: this.timeUsed })
    players.sort((p1, p2) => { return p1.score - p2.score })
    players.splice(5, 1)
    window.localStorage.setItem('players', JSON.stringify(players))
    return players
  }

  quiz () {
    return (
      <section>
        <h1 className='timer'>{this.state.coundtdown}</h1>
        <header>{this.state.response.question}</header>
        {this.state.response.alternatives
          ? <section>
            {[this.state.response.alternatives.alt1, this.state.response.alternatives.alt2, this.state.response.alternatives.alt3, this.state.response.alternatives.alt4].map((alternative, index) =>
              alternative ? <button className='alternatives-button' onClick={this.postAnswer.bind(this)} key={index} id={'alt' + (index + 1)}>{alternative}</button> : '')}
          </section>
          : <input onKeyUp={this.postAnswer.bind(this)} type='text' placeholder='Your answer' />}
      </section>
    )
  }

  quizOver () {
    return (
      <section>
        <header className='quiz-over-header'>{!this.state.response.nextURL ? this.props.nickname + ', You Won!!' : 'Game Over'}</header>
        {!this.state.response.nextURL ? (<h1 className='score'>Score: {this.timeUsed} sec</h1>) : ''}
        <button onClick={this.props.restart}>Restart</button>
        {!this.state.response.nextURL ? <section className='high-score'>
          <h1>Top 5 High-scores</h1>
          <ol>{this.highScores().map((player, index) => <li key={index}>{player.name + ': ' + player.score + ' sec'} </li>)}</ol>
        </section> : ''}
      </section>
    )
  }

  render () {
    return (this.state.isQuizOver ? this.quizOver() : this.quiz())
  }
}

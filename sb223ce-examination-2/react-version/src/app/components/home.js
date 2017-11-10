import React from 'react'

export class Home extends React.Component {
  constructor () {
    super()
    this.state = {
      isMainView: true,
      isError: false
    }
  }

  showSettings () {
    this.setState({ isMainView: false })
  }

  showHome () {
    this.setState({ isMainView: true })
  }

  showQuiz (event) {
    this.setState({ isError: this.props.nickname === '' })
    this.props.showQuiz(event)
  }

  render () {
    document.querySelector('body').classList.remove('home-background', 'rules-background', 'quiz-background')
    document.querySelector('body').classList.add(this.state.isMainView ? 'home-background' : 'rules-background')
    return (this.state.isMainView ? this.home() : this.settings())
  }

  home () {
    return (
      <section>
        <header>Quiz Game</header>
        <input type='text' placeholder='Your nickname' value={this.props.nickname} onChange={this.props.handleNickname} /><br />
        <button onClick={this.showQuiz.bind(this)}>Play</button>
        <button onClick={this.showSettings.bind(this)}>Rules</button>
        {this.state.isError ? <h1 className='error-message'>Please, write your name</h1> : ''}
      </section>
    )
  }

  settings () {
    return (
      <section>
        <div className='overlay open-overlay'>
          <a className='close-button' onClick={this.showHome.bind(this)}>close</a>
          <div className='overlay-content'>
            <ul>
              <li><h1>Before the game starts you have to choose a nickname</h1></li>
              <li><h1>We will ask you some questions and you will have 20 seconds to answer each question</h1></li>
              <li><h1>The goal is to answer all questions correctly and as fast as possible</h1></li>
              <li><h1>When you have gotten all questions right, you will be able to see your score as well as the top five scores</h1></li>
              <li><h1>If you fail to answer the question, you can restart the game</h1></li>
            </ul>
          </div>
        </div>
      </section>
    )
  }
}

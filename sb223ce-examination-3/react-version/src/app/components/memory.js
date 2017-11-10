import React from 'react'
import PropTypes from 'prop-types'

export class Memory extends React.Component {
  constructor () {
    super()
    this.state = {
      images: this.shuffle(),
      currentImage: null,
      matchedImages: [],
      rows: 4,
      columns: 4,
      attempts: 0,
      countdown: 'default',
      timer: '00:00:00',
      interval: null,
      isGameView: true,
      message: ''
    }
  }

  close () {
    if (this.state.interval !== null) { this.stopTimer() }
    document.querySelector('#' + this.props.id).remove()
  }

  shuffle (size = 16) {
    switch (size) {
      case 16: return [1, 2, 3, 4, 5, 6, 7, 8, 8, 7, 6, 5, 4, 3, 2, 1].sort(() => Math.random() - 0.5)
      case 8: return [1, 2, 3, 4, 4, 3, 2, 1].sort(() => Math.random() - 0.5)
      case 4: return [1, 2, 2, 1].sort(() => Math.random() - 0.5)
    }
  }

  gameOver (text) {
    this.stopTimer()
    this.setState({ message: text })
  }

  startTimer () {
    let time = {hour: 0, min: 0, sec: 0}
    this.state.interval = setInterval(() => {
      time.sec = this.state.timer.split(':')[2]
      if (this.state.countdown === 'default') {
        time.sec++
        if (time.sec >= 60) {
          time.min++
          time.sec = 0
        }
        if (time.min >= 60) {
          time.hour++
          time.min = 0
        }
      } else { time.sec-- }
      this.setState({ timer: (time.hour < 10 ? '0' + time.hour : time.hour) + ':' + (time.min < 10 ? '0' + time.min : time.min) + ':' + (time.sec < 10 ? '0' + time.sec : time.sec) })
      if (time.sec === 0 && this.state.countdown !== 'default' && this.state.matchedImages.length !== this.state.rows * this.state.clearInterval) { this.gameOver('You Lost.') }
    }, 1000)
  }

  stopTimer () {
    clearInterval(this.state.interval)
    this.setState({ interval: null })
  }

  handleSettings (event) {
    if (event.target.name === 'size') {
      this.setState({
        rows: parseInt(event.target.id.split(' ')[0]),
        columns: parseInt(event.target.id.split(' ')[2])
      })
    } else {
      this.setState({
        countdown: event.target.id,
        timer: event.target.id === 'default' ? '00:00:00' : '00:00:' + event.target.id
      })
    }
  }

  compareImages (image) {
    if (this.state.currentImage === null) {
      image.setAttribute('src', 'assets/image/0.png')
      return
    }
    if (this.state.currentImage.getAttribute('src') === image.getAttribute('src')) {
      image.parentElement.classList.add('hide')
      this.state.currentImage.parentElement.classList.add('hide')
      let arr = this.state.matchedImages
      arr.push(image.parentElement, this.state.currentImage.parentElement)
      this.setState({ matchedImages: arr })
    } else {
      image.setAttribute('src', 'assets/image/0.png')
      this.state.currentImage.setAttribute('src', 'assets/image/0.png')
    }
    this.setState({
      currentImage: null,
      attempts: ++this.state.attempts
    })
    if (this.state.matchedImages.length === this.state.rows * this.state.columns) { this.gameOver('You Won.') }
  }

  showImage (event) {
    if (this.state.interval === null) { this.startTimer() }
    let element = event.target.tagName === 'IMG' ? event.target : event.target.firstElementChild
    if (element.getAttribute('src') === 'assets/image/0.png') {
      element.setAttribute('src', 'assets/image/' + this.state.images[element.parentElement.id - 1] + '.png')
      this.state.currentImage === null
        ? this.setState({ currentImage: element }) : setTimeout(() => this.compareImages(element), 1000)
    }
  }

  showGame () {
    if (this.state.interval !== null) { this.stopTimer() }
    if (this.state.currentImage !== null) { this.state.currentImage.setAttribute('src', 'assets/image/0.png') }
    this.state.matchedImages.forEach(element => {
      element.classList.remove('hide')
      element.firstElementChild.setAttribute('src', 'assets/image/0.png')
    })
    this.setState({
      images: this.shuffle(this.state.rows * this.state.columns),
      currentImage: null,
      matchedImages: [],
      isGameView: true,
      attempts: 0,
      timer: this.state.countdown === 'default' ? '00:00:00' : '00:00:' + this.state.countdown,
      message: ''
    })
  }

  showSettings () {
    this.stopTimer()
    this.setState({
      isGameView: false,
      message: ''
    })
  }

  render () {
    return (
      <div id={this.props.id} draggable='true' onDragOver={this.props.dragOver} onDragStart={this.props.dragStart} className='ui card'>
        <div id='header' className='content'>
          <i className='circular newspaper icon' />Memory
          <i className='right floated circular close icon link' onClick={this.close.bind(this)} />
          <i className='right floated circular setting icon link' onClick={this.showSettings.bind(this)} />
          <i className='right floated circular refresh icon link' onClick={this.showGame.bind(this)} />
        </div>
        <div className='content center'>
          {this.state.message !== '' ? <h1 className='header'>{this.state.message}</h1> : (this.state.isGameView ? this.game() : this.settings())}
        </div>
        <div className='extra content'>
          <span className='right floated'>{this.state.attempts} attempt</span>
          <span>
            <i className='clock icon' />
            <span>{this.state.timer}</span>
          </span>
        </div>
      </div>
    )
  }

  game () {
    return (
      <div className={this.state.rows === 2 && this.state.columns === 2 ? 'twoByTwo' : ''} onKeyDown={this.handleKeys.bind(this)} onClick={this.showImage.bind(this)}>
        {this.state.images.map((image, index) => <a id={index + 1} key={index} href='#'><img src='assets/image/0.png' height='60' width='60' /></a>)}
      </div>
    )
  }

  settings () {
    let sizes = ['4 x 4', '2 x 4', '2 x 2']
    let countdowns = ['60', '30', '10', 'default']
    return (
      <div>
        <div className='ui form'>
          {['Size', 'Play against countdown'].map((label, index) =>
            <div key={index} className='grouped fields'>
              <label>{label}</label>
              {(index === 0 ? sizes : countdowns).map((id, idx) =>
                <div key={idx} className='field'>
                  <div className='ui checkbox'>
                    <input id={id} type='radio' name={index === 0 ? 'size' : 'countdown'} onChange={this.handleSettings.bind(this)}
                      checked={index === 0 ? (this.state.rows + ' x ' + this.state.columns === id) : this.state.countdown === id} />
                    <label>{index === 0 ? sizes[idx] : ['60 sec', '30 sec', '10 sec', 'default'][idx]}</label>
                  </div>
                </div>)}
            </div>)}
        </div>
        <div className='ui bottom attached button' onClick={this.showGame.bind(this)}>Done</div>
      </div>
    )
  }
  
  /** Extra feature for play the game with arrow keys */
  handleKeys (event) {
    let element = event.target
    switch (event.key) {
      case 'ArrowLeft':
        if (element.previousElementSibling === null) { element.focus() } else {
          while (element.previousElementSibling !== null && element.previousElementSibling.classList.contains('hide')) {
            element = element.previousElementSibling
          }
          element.previousElementSibling === null ? element.focus() : element.previousElementSibling.focus()
        }
        break
      case 'ArrowRight':
        if (element.nextElementSibling === null) { element.focus() } else {
          while (element.nextElementSibling !== null && element.nextElementSibling.classList.contains('hide')) {
            element = element.nextElementSibling
          }
          element.nextElementSibling === null ? element.focus() : element.nextElementSibling.focus()
        }
        break
      case 'ArrowUp':
        if (element.previousElementSibling === null) {} else if (element.id > this.state.columns) {
          do {
            for (let i = 0; i < this.state.columns; i++) { element = element.previousElementSibling }
          } while (element.classList.contains('hide') && element.id > this.state.columns)
        } else {
          do {
            for (let i = 0; i < this.state.rows - 1; i++) {
              for (let i = 0; i < this.state.columns; i++) { element = element.nextElementSibling }
            }
          } while (element.classList.contains('hide') && element.id <= this.state.columns)
          element = element.previousElementSibling
        }
        element.focus()
        break
      case 'ArrowDown':
        if (element.nextElementSibling === null) { } else if (parseInt(element.id) + this.state.columns <= this.state.rows * this.state.columns) {
          do {
            for (let i = 0; i < this.state.columns; i++) { element = element.nextElementSibling }
          } while (element.classList.contains('hide') && parseInt(element.id) + this.state.columns <= this.state.rows * this.state.columns)
        } else {
          do {
            for (let i = 0; i < this.state.rows - 1; i++) {
              for (let i = 0; i < this.state.columns; i++) { element = element.previousElementSibling }
            }
          } while (element.classList.contains('hide') && parseInt(element.id) + this.state.columns > this.state.rows * this.state.columns)
          element = element.nextElementSibling
        }
        element.focus()
    }
  }
}

Memory.propTypes = {
  id: PropTypes.string,
  dragStart: PropTypes.func,
  dragOver: PropTypes.func
}

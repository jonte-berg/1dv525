import React from 'react'
import PropTypes from 'prop-types'

export class News extends React.Component {
  constructor () {
    super()
    this.state = {
      channels: window.localStorage.getItem('news') === null ? ['techcrunch'] : JSON.parse(window.localStorage.getItem('news')),
      isNewsView: true,
      isError: false,
      isLoading: true,
      articles: []
    }
    this.fetchNews()
  }

  close () { document.querySelector('#' + this.props.id).remove() }

  handleSettings (event) {
    let arr = this.state.channels
    arr.indexOf(event.target.name) === -1 ? arr.push(event.target.name) : arr.splice(arr.indexOf(event.target.name), 1)
    this.setState({ channels: arr })
    window.localStorage.setItem('news', JSON.stringify(this.state.channels))
  }

  fetchNews () {
    let articles = []
    this.state.channels.forEach((channel, index) => {
      window.fetch('https://newsapi.org/v1/articles?source=' + channel + '&sortBy=top&apiKey=71f12b1d877b4b0882f1e2c2ce163a34')
        .then(res => res.json())
        .then(res => res.articles.forEach(article => articles.push(article)))
        .then(() => this.setState({ articles: articles }))
        .then(() => { if (index === this.state.channels.length - 1) { this.setState({ isLoading: false }) } })
        .catch(() => this.showError())
    })
  }

  showSettings () {
    this.setState({
      isNewsView: false,
      isLoading: false,
      isError: false
    })
  }

  showError () {
    this.setState({
      isError: true,
      isLoading: false
    })
  }

  showNews () {
    this.setState({
      isNewsView: true,
      isError: false,
      isLoading: true
    })
    this.fetchNews()
  }

  render () {
    return (
      <div id={this.props.id} draggable='true' onDragOver={this.props.dragOver} onDragStart={this.props.dragStart} className='ui card'>
        <div id='header' className='content'>
          <i className='circular newspaper icon' />News
          <i className='right floated circular close icon link' onClick={this.close.bind(this)} />
          <i className='right floated circular setting icon link' onClick={this.showSettings.bind(this)} />
          <i className='right floated circular refresh icon link' onClick={this.showNews.bind(this)} />
        </div>
        {this.state.isNewsView ? this.news() : this.settings()}
        {this.state.isLoading ? this.loading() : ''}
        {this.state.isError ? this.error() : ''}
      </div>
    )
  }

  error () {
    return (
      <div className='ui extra content'>
        <div className='ui icon message'>
          <div className='content'>Unable to fetch, please try again.</div>
        </div>
      </div>
    )
  }

  loading () {
    return (
      <div className='ui active inverted dimmer'>
        <div className='ui text loader'>Loading</div>
      </div>
    )
  }

  news () {
    return (
      <div className='content ui cards news-content-area'>
        {this.state.articles.map((article, index) =>
          <div key={index} className='card' onClick={() => window.open(article.url)}>
            <div className='ui image'>
              <img src={article.urlToImage} />
            </div>
            <div className='content'>
              <div className='header'>{article.title}</div>
              <div className='meta'>
                <span className='author'>{article.author}</span>
                <span className='date right floated'>{('' + article.publishedAt).split('T')[0]}</span>
              </div>
              <div className='description'>{article.description}</div>
            </div>
          </div>)}
      </div>
    )
  }

  settings () {
    return (
      <div className='content news-content-area'>
        <div className='ui middle aligned divided list'>
          {this.getChannels().map((channel, index) =>
            <div key={index} className='item'>
              <div className='right floated content'>
                <div className='ui slider checkbox'>
                  <input type='checkbox' name={channel.name} checked={this.state.channels.indexOf(channel.name) !== -1} onChange={this.handleSettings.bind(this)} />
                  <label>Subscribe</label>
                </div>
              </div>
              <img className='image' height='90' width='90' src={channel.image} />
            </div>)}
        </div>
        <div className='ui bottom attached button' onClick={this.showNews.bind(this)}>Done</div>
      </div>
    )
  }

  getChannels () {
    return [
        { name: 'abc-news-au', image: 'http://mobile.abc.net.au/cm/cb/4355924/News+iOS+120x120/data.png' },
        { name: 'al-jazeera-english', image: 'http://www.aljazeera.com/mritems/assets/images/touch-icon-iphone-retina.png' },
        { name: 'bbc-news', image: 'http://m.files.bbci.co.uk/modules/bbc-morph-news-waf-page-meta/1.2.0/apple-touch-icon.png' },
        { name: 'bbc-sport', image: 'http://static.bbci.co.uk/onesport/2.11.248/images/web-icons/bbc-sport-180.png' },
        { name: 'cnn', image: 'http://i.cdn.cnn.com/cnn/.e/img/3.0/global/misc/apple-touch-icon.png' },
        { name: 'the-wall-street-journal', image: 'https://www.wsj.com/apple-touch-icon-precomposed.png' },
        { name: 'espn', image: 'http://a.espncdn.com/wireless/mw5/r1/images/bookmark-icons/espn_icon-152x152.min.png' },
        { name: 'daily-mail', image: 'http://www.dailymail.co.uk/apple-touch-icon.png' },
        { name: 'the-new-york-times', image: 'https://mobile.nytimes.com/vi-assets/apple-touch-icon-319373aaf4524d94d38aa599c56b8655.png' }
    ]
  }
}

News.propTypes = {
  id: PropTypes.string,
  dragStart: PropTypes.func,
  dragOver: PropTypes.func
}

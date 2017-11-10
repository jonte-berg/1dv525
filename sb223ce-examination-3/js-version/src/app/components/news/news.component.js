'use strict'

module.exports = class News {
  /**
   * @param {string} id
   * Create a new instance of News and assign id and other values to it
   */
  constructor (id) {
    this.id = 'news' + id
    this.channels = window.localStorage.getItem('news') === null ? ['techcrunch'] : JSON.parse(window.localStorage.getItem('news'))
  }

  /** Clone the template, add it to body and then set id, add events to it. Finally show the news */
  open () {
    document.querySelector('main').appendChild(this.cloneTemplate('#app'))
    this.setIdToElements()
    this.addEventToElements()
    this.showNews()
    this.addChannels()
  }

  /** Close the app and save the current subscription */
  close () {
    document.querySelector(this.getId()).remove()
    window.localStorage.setItem('news', JSON.stringify(this.channels))
  }

  /** First remove the existing news, then fetch the news and display it. Added timeout for keeping the browser unblocked */
  showNews () {
    document.querySelector('#' + this.id + '-loader').classList.add('active')
    if (!document.querySelector('#' + this.id + '-extraContent').classList.contains('dimmer')) {
      document.querySelector('#' + this.id + '-extraContent').classList.add('dimmer')
    }
    Array.prototype.forEach.call(document.querySelectorAll('#' + this.id + '-newsDiv .card'), element => element.remove())
    this.channels.forEach(channel => {
      window.fetch(
        'https://newsapi.org/v1/articles?source=' + channel + '&sortBy=top&apiKey=71f12b1d877b4b0882f1e2c2ce163a34'
      ).then(response => response.json())
        .then(response => {
          response.articles.forEach((article, index) => {
            setTimeout(() => {
              let news = this.cloneTemplate('#news')
              let element = news.firstElementChild
              element.firstElementChild.firstElementChild.setAttribute('src', article.urlToImage)
              element.children[1].firstElementChild.textContent = article.title
              element.children[1].lastElementChild.textContent = article.description
              element.children[1].children[1].firstElementChild.textContent = article.author
              element.children[1].children[1].lastElementChild.textContent = ('' + article.publishedAt).split('T')[0]
              if (element.children[1].children[1].lastElementChild.textContent === 'null') {
                element.children[1].children[1].lastElementChild.textContent = ''
              }
              element.onclick = () => window.open(article.url)
              document.querySelector('#' + this.id + '-newsDiv').appendChild(news)
              if (index === response.articles.length - 1) {
                document.querySelector('#' + this.id + '-loader').classList.remove('active')
              }
            }, 0)
          })
        }).catch(() => document.querySelector('#' + this.id + '-extraContent').classList.remove('dimmer'))
    })
    document.querySelector('#' + this.id + '-newsDiv').classList.remove('dimmer')
    document.querySelector('#' + this.id + '-settingsDiv').classList.add('ui', 'dimmer')
  }

  showSettings () {
    if (document.querySelector('#' + this.id + '-settingsDiv').classList.contains('dimmer')) {
      document.querySelector('#' + this.id + '-newsDiv').classList.add('dimmer')
      document.querySelector('#' + this.id + '-settingsDiv').classList.remove('ui', 'dimmer')
    }
  }

  /** Add the channels in setting mode */
  addChannels () {
    this.getChannels().forEach(channel => {
      let template = this.cloneTemplate('#channel')
      template.firstElementChild.lastElementChild.setAttribute('src', channel.image)
      template.firstElementChild.firstElementChild.firstElementChild.firstElementChild.setAttribute('name', channel.name)
      if (this.channels.indexOf(channel.name) !== -1) {
        template.firstElementChild.firstElementChild.firstElementChild.firstElementChild.setAttribute('checked', 'true')
      }
      document.querySelector('#' + this.id + '-channels').appendChild(template)
    })
  }

  /**
   * @param {string} templateID
   * Clone and retunr the template content based on the given id
   */
  cloneTemplate (templateID) {
    let link = document.querySelector('link[href="app/components/news/news.component.html"]')
    let template = link.import.querySelector(templateID)
    return document.importNode(template.content, true)
  }

  /** Mark the subscribed channels */
  setSubscription (event) {
    if (event.target.tagName === 'INPUT') {
      let channel = event.target.name
      if (this.channels.indexOf(channel) === -1) {
        this.channels.push(channel)
      } else {
        this.channels.splice(this.channels.indexOf(channel), 1)
        event.target.setAttribute('checked', 'false')
      }
    }
  }

  setIdToElements () {
    ['#news-app', '#news-close', '#news-settings', '#news-refresh', '#news-newsDiv', '#news-settingsDiv', '#news-channels', '#news-doneBtn', '#news-loader', '#news-extraContent']
      .forEach(id => document.querySelector(id).setAttribute('id', this.id + '-' + id.split('-')[1]))
  }

  addEventToElements () {
    document.querySelector('#' + this.id + '-close').addEventListener('click', this.close.bind(this))
    document.querySelector('#' + this.id + '-settings').addEventListener('click', this.showSettings.bind(this))
    document.querySelector('#' + this.id + '-channels').addEventListener('click', this.setSubscription.bind(this))
    document.querySelector('#' + this.id + '-refresh').addEventListener('click', this.showNews.bind(this))
    document.querySelector('#' + this.id + '-doneBtn').addEventListener('click', this.showNews.bind(this))
  }

  getId () {
    return '#' + this.id + '-app'
  }

  /** List of channels which user can follow */
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

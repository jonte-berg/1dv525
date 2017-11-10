import React from 'react'
import PropTypes from 'prop-types'

export class Header extends React.Component {
  render () {
    return (
      <nav>
        <div className='ui labeled icon menu' onClick={this.props.openApp}>
          <a id='chat' className='item' ><i className='talk icon' />Chat</a>
          <a id='memory' className='item'><i className='delicious icon' />Memory</a>
          <a id='news' className='item'><i className='newspaper icon' />News</a>
        </div>
      </nav>
    )
  }
}

Header.propTypes = {
  openApp: PropTypes.func
}

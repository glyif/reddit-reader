import React, { Component } from 'react'
import TextField from 'material-ui/TextField'

class SubredditsInput extends Component {

  handleKeyPress = e => {
    if (e.key === 'Enter') {
      this.props.add(e.target.value)
      e.target.value = ''
    }
  }

  render () {
    return (
      <div className='reddit-reader-input-group'>
        <span>{'subreddit.com/r/'}</span>
        <TextField onKeyPress={this.handleKeyPress} style={{maxWidth: 200}} autoFocus hintText="subreddit name" />
      </div>
    )
  }
}

export default SubredditsInput

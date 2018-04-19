import React, { Component } from 'react'
import Toggle from 'material-ui/Toggle'

class SubredditsList extends Component {
  handleRemove = (subreddit) => {
    this.props.remove(subreddit)
  }

  handleToggle = (subreddit) => {
    this.props.toggle(subreddit)
  }

  renderList (subreddits, filtered) {
    const styles = {width: '100%'}

    return subreddits.map((subreddit, idx) => {
      if (subreddit) {
        const defaultToggled = !filtered.filter(el => (el === subreddit)).length
          ? true
          : false

        return (
          <li key={idx}>
            <Toggle
              defaultToggled={defaultToggled}
              style={styles}
              label={`r/${subreddit}`}
              labelPosition='right'
              onToggle={e => this.handleToggle(subreddit, e)}
            />
          <button onClick={e => this.handleRemove(subreddit, e)} className='subreddit-delete'>⨯</button>
          </li>
        )
      }
      return false
    })
  }

  render () {
    return (
      <ul className='reddit-reader-subreddits-list'>
        {this.renderList(this.props.subreddits, this.props.filtered)}
      </ul>
    )
  }
}

export default SubredditsList

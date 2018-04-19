import React, { Component } from 'react'
import moment from 'moment'

import { Card, CardTitle, CardText } from 'material-ui/Card'
import FlatButton from 'material-ui/FlatButton'
import Avatar from 'material-ui/Avatar'
import Chip from 'material-ui/Chip'

import PlaceholderImage from './Reddit-logo-150x150.png'
import SubLogo from './Reddit_Logo.png'

class Feed extends Component {
  momentize (submitDate) {
    return moment(submitDate * 1000).fromNow()
  }

  renderFeed (cards, filtered) {
    if (cards) {
      const styles = {display: 'inline-block'}
      return cards.map(card => {
        if (card && !filtered.filter(el => (el === card.data.subreddit)).length) {
          return (
            <Card key={card.data.id} className='feed-card'>
              <figure>
                <img
                  src={
                    (card.data.thumbnail_width && card.data.thumbnail !== 'nsfw')
                      ? card.data.thumbnail
                      : PlaceholderImage
                  }
                  alt={card.data.title}
                />
                <figcaption>
                  <CardTitle className='card-title' title={card.data.title} />
                  <CardText>
                    <Chip style={styles}>
                      <Avatar color='#444' src={SubLogo} />
                      r/{card.data.subreddit}
                    </Chip>
                    <FlatButton style={styles} label={this.momentize(card.data.created_utc)} disabled />
                    <FlatButton style={styles} target="_blank" label='read &raquo;' primary href={card.data.url} />
                  </CardText>
                </figcaption>
              </figure>
            </Card>
          )
        }

        return false
      })
    }

    return <div className="preload"></div>
  }

  render () {
    return (
      <article className='reddit-reader-feed'>
        {this.renderFeed(this.props.cards, this.props.filtered)}
      </article>
    )
  }
}

export default Feed

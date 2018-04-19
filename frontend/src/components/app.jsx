import React, { Component } from 'react'

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import getMuiTheme from 'material-ui/styles/getMuiTheme'
import Theme from '../utils/theme'

import FloatingActionButton from 'material-ui/FloatingActionButton'
import ArrowTop from 'material-ui/svg-icons/navigation/arrow-upward'

import AppSidebar from './aside/sidebar'
import Feed from './feed/feed'

import './app.css'

class App extends Component {
  componentWillMount () {
    this.state = {
      data: null,
      subreddits: this.getSavedSubreddits(),
      filtered: this.getFilteredSubreddits()
    }

    window.socket = this.props.socket

    document.body.style.display = 'block'

    this.navButton = document.getElementById('app-main-nav-button')
    this.navButton.addEventListener('click', (e) => {
      e.preventDefault()
      document.body.classList.toggle('active-left-place')
    }, false)

    this.props.socket.on('connect', () => {
      let subreddits = this.getSavedSubreddits()
      subreddits = subreddits.length
        ? subreddits
        : ['news']
      this.props.socket.emit('getSubreddits', subreddits)
    })

    this.props.socket.on('fetchClientData', data => {
      this.setState({data})
    })

    this.props.socket.on('fetchClientDataPortion', data => {
      let toConcat = this.state.data
      this.setState({data: toConcat.concat(data)})
    })

    this.props.socket.on('validateSubredditDone', payload => {
      if (payload[1] === true) {
        let subreddits = this.getSavedSubreddits()
        subreddits.push(payload[0])
        const newSubs = subreddits

        window.localStorage.setItem('subreddits', newSubs)

        this.setState({
          subreddits: newSubs,
          data: null
        })

        this.props.socket.emit('getSubreddits', newSubs)
      } else {
        alert(`Invalid subreddit name: ${payload[0]}`)
      }
    })

  }

  componentDidMount () {
    window.onscroll = () => {
      const html = document.documentElement
      const body = document.body
      const offset = html.scrollTop + window.innerHeight

      const height = Math.max(
        body.scrollHeight,
        body.offsetHeight,
        html.clientHeight,
        html.scrollHeight,
        html.offsetHeight
      )

      if (offset === height) {
        console.log('At the bottom')
        this.props.socket.emit('getNextPortion')
      }
    }
  }

  validateSubreddit = (name) => {
    this.props.socket.emit('validateSubreddit', name)
  }

  subredditsListWillBeEmpty = () => {
    if (this.state.subreddits.length === 1) {
      return true
    }

    return false
  }

  getSavedSubreddits = () => {
    const raw = window.localStorage.getItem('subreddits')
    return raw
      ? raw.split(',').filter(item => (item !== ''))
      : []
  }

  getFilteredSubreddits = () => {
    const raw = window.localStorage.getItem('filteredSubreddits')
    return raw
      ? raw.split(',')
      : []
  }

  toggleFilterSubreddit = (name) => {
    let filtered = this.getFilteredSubreddits()
    let newFils = filtered
    if (!filtered.includes(name)) {
      filtered.push(name)
      newFils = filtered
      window.localStorage.setItem('filteredSubreddits', newFils)
      this.setState({
        filtered: newFils
      })
    } else {
      newFils = filtered.join(',')
        .replace(name, '')
        .split(',')
        .filter(item => (item !== ''))
      window.localStorage.setItem('filteredSubreddits', newFils)
      this.setState({
        filtered: newFils
      })
    }
  }

  addSubredit = name => {
    let subreddits = this.getSavedSubreddits()
    name = name.trim()

    if (!subreddits.includes(name)) {
      this.validateSubreddit(name)
    } else {
      alert(`Subreddit "${name}" is already in your feed`)
    }
  }

  removeSubredit = name => {
    let subreddits = this.getSavedSubreddits()
    let newSubs = subreddits
    name = name.trim()

    if (subreddits.includes(name)) {
      newSubs = subreddits.join(',')
        .replace(name, '')
        .split(',')
        .filter(item => (item !== ''))

        window.localStorage.setItem('subreddits', newSubs)

        this.setState({
          subreddits: newSubs,
          data: null
        })

        if (!this.subredditsListWillBeEmpty()) {
          this.props.socket.emit('getSubreddits', newSubs)
        } else {
          this.props.socket.emit('getSubreddits', ['news'])
        }
    } else {
      alert(`You're not watching the subreddit named "${name}"`)
    }
  }

  handleScrollTop = () => {
    document.body.scrollTop = 0
    document.documentElement.scrollTop = 0
  }

  renderFeed () {
    return (
      <section className='dynamic-block'>
        <Feed
          cards={this.state.data}
          filtered={this.state.filtered}
        />
      </section>
    )
  }

  renderActionButtons () {
    const styles = {
      position: 'fixed',
      bottom: 30,
      right: 30
    }
    return (
      <FloatingActionButton onClick={this.handleScrollTop} style={styles}>
        <ArrowTop />
      </FloatingActionButton>
    )
  }

  render () {
    return (
      <div>

        <div className='panel'>
          <h3>Your Feed</h3>
        </div>

        <MuiThemeProvider muiTheme={getMuiTheme(Theme)}>
          <main className='reddit-reader'>
            <AppSidebar
              subreddits={this.state.subreddits}
              filtered={this.state.filtered}
              add={this.addSubredit}
              remove={this.removeSubredit}
              validate={this.validateSubreddit}
              toggle={this.toggleFilterSubreddit}
            />
            {this.renderFeed()}
            {this.renderActionButtons()}
          </main>
        </MuiThemeProvider>

      </div>
    )
  }
}

export default App

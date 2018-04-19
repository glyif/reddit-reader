import React, { Component } from 'react'
import SubredditsList from './controls/subredditsList'
import SubredditsInput from './controls/subredditsInput'

class AppSidebar extends Component {
  componentWillMount () {
    this.magnetOverlay = document.getElementById('magnet-overlay')
    this.magnetOverlay.addEventListener('click', this.handleCloseSidebar, false)
    document.addEventListener('keyup', this.handleCloseSidebar, false)
  }

  handleCloseSidebar = e => {
    if (e.type === 'keyup' && e.keyCode === 27) {
      if (document.body.classList.length) {
        document.body.classList.toggle('active-left-place')
      }
    } else if (e.type === 'click') {
      document.body.classList.toggle('active-left-place')
    }
  }

  render () {
    return (
      <aside id='main-sidebar'>
        <div className='main-sidebar-wrapper'>
          <div className='header-section'>
            <h2>Reddit Reader</h2>
            <h3>with React and Node.js</h3>
            <button onClick={this.handleCloseSidebar}>⨯</button>
          </div>
          <section className='container-fluid'>
            <div className='row'>
              <aside className='reddit-reader-sidebar'>
                <SubredditsInput add={this.props.add} />
                <SubredditsList
                  remove={this.props.remove}
                  toggle={this.props.toggle}
                  filtered={this.props.filtered}
                  subreddits={this.props.subreddits}
                />
              </aside>
            </div>
          </section>
        </div>
        <footer className='main-footer'>
          <p>Designed &amp; coded with &hearts;
            <a target='_blank' rel='noopener noreferrer' href='https://github.com/glyif'>
            </a>
          </p>
        </footer>
      </aside>
    )
  }
}

export default AppSidebar

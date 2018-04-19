const https = require('https')
const server = require('http').createServer()
const io = require('socket.io')(server, {})

io.on('connection', socket => {
  let lazyLoadPortion = []
  let unsortedFeed = []
  let subredditsCounter = 0

  console.log('New client connected', `ID: ${socket.id}`)

  socket.on('disconnect', function() {
    console.log('Client disconnected', `ID: ${socket.id}`)
  });

  socket.on('validateSubreddit', payload => {
    https.get(`https://www.reddit.com/r/${payload}/new.json`, res => {
      console.log('Validation statusCode:', res.statusCode)

      if (res.statusCode === 200) {
        socket.emit('validateSubredditDone', [payload, true])
      } else {
        socket.emit('validateSubredditDone', [payload, false])
      }
    })
  })

  socket.on('getSubreddits', payload => {
    subredditsCounter = payload.length
    getEachSubreddit(payload, 'fetchClientData')
  })

  socket.on('getNextPortion', () => {
    console.log(lazyLoadPortion)
    subredditsCounter = lazyLoadPortion.length
    getEachSubreddit(lazyLoadPortion, 'fetchClientDataPortion')
    lazyLoadPortion = []
  })

  function getEachSubreddit(subreddits, eventName) {
    const baseUrl = 'https://www.reddit.com/r/'
    return subreddits.map((subreddit) => {
      if (Array.isArray(subreddit)) {
        https.get(`${baseUrl}${subreddit[0]}/new.json?after=${subreddit[1]}`, res => {
          processResponses(res, subreddit[0], eventName)
        })
      } else {
        https.get(`${baseUrl}${subreddit}/new.json`, res => {
          processResponses(res, subreddit, eventName)
        })
      }
    })
  }

  function processResponses (response, subredditName, eventName) {
      console.log('statusCode:', response.statusCode)

    let body = ''

    response.on('data', (data) => {
      body += data
    })

    response.on("end", () => {
      body = JSON.parse(body)
      unsortedFeed.push(body.data.children)
      lazyLoadPortion.push([subredditName, body.data.after])
      subredditsCounter--

      if (subredditsCounter === 0) {
        socket.emit(eventName, sortFeedData(unsortedFeed))
        unsortedFeed = []
      }
    })

    response.on('error', (e) => {
      console.error('ERROR ::', e)
    })
  }

  function sortFeedData (raw) {
    let sorted

    const unsorted = raw.reduce((prev, curr) => {
      return (prev) ? curr.concat(prev) : curr
    })

    sorted = unsorted.sort((a,b) => (
      a.data.created_utc - b.data.created_utc)
    ).reverse()

    return sorted
  }

})

server.listen(3030)

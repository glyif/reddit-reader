# Reddit Feed Take Home Assignment

## Project Overview
This project is a takehome assignment for interviewing at Make Wonder.
The general idea is to create a personalized reddit feed/reader. The user can add and delete subreddits that they want or don't want on the feed. Then the feed displays new posts of added subreddits. If the user doesn’t configure any subreddits, show posts from /r/news by default.

## Get Started
### Docker
```
$ docker-compose build
$ docker-compose up -d
```

This uses port `3000` and `3030`.

Navigate to `http://localhost:3000`

### Without Docker


Install Dependencies
```
$ /install.sh
```

Need 2 terminals:


Terminal 1 (Node.js Backend Server)
```
$ ./dev-server.sh -b
```

Terminal 2 (React Client)
```
$ ./dev-server.sh -f
```
This uses port `3000` and `3030`.

Navigate to `http://localhost:3000`


## Features
- If the user doesn’t configure any subreddits, show posts from https://www.reddit.com/r/news/ by default.
- When the user adds or deletes subreddits, the posts displayed should update appropriately
- Infinite scrolling and to top of page button
- Stores added subreddits to localStorage
- Subreddit duplicate entry handling
- Invalid subreddit error handling
- Ability to "disable" a subreddit to temporarily remove posts from a subreddit in the user's feed
- Live new post updates without reloading the page using `socket-io` (WIP)

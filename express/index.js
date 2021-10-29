const express = require('express')
const { getAllPosts, getPost } = require('./utils/helper')
const app = express()
const cors = require('cors')

app.use(cors())

var corsOptions = {
  origin: 'http://localhost:3000',
  optionsSuccessStatus: 200
}

app.get('/', async function (req, res) {
  res.send('<a href="http://localhost:3333/posts">Click to go to posts JSON API endpoint</a>')
})

/**
 * Returns a json array of all posts, formatted as:
 * [
 *  {
 *    title: <article's title>,
 *    slug: <article's slug>
 *  },
 *  ...
 * ]
 */
app.get('/posts', cors(corsOptions), async function (req, res) {
  let posts = await getAllPosts()
  res.send(posts)
})

/**
 *  Returns the detail of an individual post in json, formatted as:
 * {
 *  post: {
 *    content: <article's markdown content>,
 *    tags: <array of 5 top tags for the post>
 *  }
 * }
 */

 app.get('/posts/:slug', async function (req, res) {
  let post = await getPost(req.params.slug)
  res.send(post)
})

app.listen(3333, function () {
  console.log('Dev app listening on port 3333!')
})

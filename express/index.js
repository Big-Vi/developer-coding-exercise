const express = require('express')
const { getTopWords } = require('./utils/tags')
const app = express()
const rootPostDir = '../assets/posts'
const readMarkdown = require('read-markdown')
const cors = require('cors')
const fs = require('fs')
var markdown = require( "markdown" ).markdown;

app.use(cors())

var corsOptions = {
  origin: 'http://localhost:3000',
  optionsSuccessStatus: 200
}

function getPosition(string, subString, index) {
  return string.split(subString, index).join(subString).length;
}

async function getAllPosts() {
  let posts = []
  // TODO: Get all posts using fs.readFile & get rid of the read-markdown dependency
  await readMarkdown.default(`${rootPostDir}/*.md`, html=true)
    .then(function(data){
      // Getting the paths of all the posts
      let paths = Object.keys(data);
      
      paths.forEach((path, index) => {
        // Title & Slug are always in the array at index 1 & 3 respectively
        let title = data[path].content.split("\n")[1].split(":")[1].trim().replace('&amp;#39;', "'");
        let slug = data[path].content.split("\n")[3].split(":")[1].trim();
        posts.push({'title': title, 'slug': slug})
      })
      
    }).catch(console.error) 
    return posts
}

async function getPost(slug) {
  let post = {}
  let postData = await fs.promises.readFile(`${rootPostDir}/${slug}.md`, 'utf-8')
  // Finding the position of '===' in second occurrence, so that content can be extracted
  let markdownEndPos = getPosition(postData.toString(), '===', 2) + 3;
  let content = postData.toString().substring(markdownEndPos, postData.toString().length)
  // Getting the 5 top words from the cotent
  let tags = getTopWords(content, 5)
  // Using markdown.js to convert the markdown to html
  post['content'] = markdown.toHTML(content);
  post['tags'] = tags
  return post;
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

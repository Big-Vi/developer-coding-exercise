const readMarkdown = require('read-markdown')
const rootPostDir = '../assets/posts'
const fs = require('fs')
var markdown = require( "markdown" ).markdown;

const stopWords = [
    '#', '##', 'a', 'about', 'above', 'after', 'again', 'against', 'all', 'am',
    'an', 'and', 'any', 'are', 'aren\'t', 'as', 'at', 'be', 'because', 'been',
    'before', 'being', 'below', 'between', 'both', 'but', 'by', 'can\'t', 'cannot',
    'could', 'couldn\'t', 'did', 'didn\'t', 'do', 'does', 'doesn\'t', 'doing', 'don\'t',
    'down', 'during', 'each', 'few', 'for', 'from', 'further', 'had', 'hadn\'t',
    'has', 'hasn\'t', 'have', 'haven\'t', 'having', 'he', 'he\'d', 'he\'ll', 'he\'s',
    'her', 'here', 'here\'s', 'hers', 'herself', 'him', 'himself', 'his', 'how',
    'how\'s', 'i', 'i\'d', 'i\'ll', 'i\'m', 'i\'ve', 'if', 'in', 'into', 'is', 'isn\'t',
    'it', 'it\'s', 'its', 'itself', 'let\'s', 'me', 'more', 'most', 'mustn\'t', 'my',
    'myself', 'no', 'nor', 'not', 'of', 'off', 'on', 'once', 'only', 'or', 'other',
    'ought', 'our', 'ours', 'ourselves', 'out', 'over', 'own', 'same', 'shan\'t', 'she',
    'she\'d', 'she\'ll', 'she\'s', 'should', 'shouldn\'t', 'so', 'some', 'such', 'than', 'that',
    'that\'s', 'the', 'their', 'theirs', 'them', 'themselves', 'then', 'there', 'there\'s',
    'these', 'they', 'they\'d', 'they\'ll', 'they\'re', 'they\'ve', 'this', 'those', 'through',
    'to', 'too', 'under', 'until', 'up', 'very', 'was', 'wasn\'t', 'we', 'we\'d', 'we\'ll',
    'we\'re', 'we\'ve', 'were', 'weren\'t', 'what', 'what\'s', 'when', 'when\'s', 'where',
    'where\'s', 'which', 'while', 'who', 'who\'s', 'whom', 'why', 'why\'s', 'with', 'won\'t',
    'would', 'wouldn\'t', 'you', 'you\'d', 'you\'ll', 'you\'re', 'you\'ve', 'your', 'yours',
    'yourself', 'yourselves', ''
]
  
/**
 * This function returns a list of the top `tagCount` frequently used words in the blog post.
 * These words should not include any words from the `stopWords` array, and should also exclude
 * strings relating to markdown.
 *
 * @param {string} bodyText
 * @param {number} tagCount
 * @returns {[string]} - An array of the most frequently used non-Stopwords
 */
function getTopWords (bodyText, tagCount = 5) {
    // Tidying up the text to remove characters that are not letters.
    let bodyTextArray = bodyText.toLowerCase().replace(/[.,*–\s]/g, ' ').split("\n").join(' ').split("/").join(' ').split(' ')
    let wordsCount = {}
    bodyTextArray.map(item => {
        // Removing stop words and non-alphabetical characters.
        if( !stopWords.includes(item) && item.search(/[0-9]/g, '') === -1) {
        if(wordsCount[item] == undefined) {
            wordsCount[item] = 1 
        } else {
            wordsCount[item] += 1
        }
        }
    })
    // Sorting the words by frequency.
    let entries = Object.entries(wordsCount)
    let sorted = entries.sort((a, b) => b[1] - a[1]);
    let tags = sorted.slice(0, tagCount).map(item => {
        return item[0]
    })
    return tags
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

module.exports = { getAllPosts, getPost }

import './App.css';
import {useEffect, useState} from 'react'
import { Link, BrowserRouter as Router, Route } from "react-router-dom";
import parse from 'html-react-parser';
 
// Creating all components in here for simplicity
const HomePage = () => {
  const [posts, setPosts] = useState("")

  useEffect(() => {
    async function fetchPosts() {
      let response = await fetch('http://localhost:3333/posts');
      response = await response.json()
      setPosts(response)
    }
    fetchPosts();
  }, [])

  return (
    <>
      {posts.length > 0 &&
        posts.map((post, index) => {
          return (
            <div key={index}>
              <Link to={`/posts/${post.slug}`}>{post.title}</Link><br></br>
            </div>
          )
        })
      }
    </>
  );
};

const Post = ({ match }) => {
  const { params: { slug } } = match;
  const [post, setPost] = useState("")

  useEffect(() => {
    async function fetchPost() {
      let response = await fetch(`http://localhost:3333/posts/${slug}`);
      response = await response.json()
      setPost(response)
    }
    fetchPost();
  }, [slug])

  return (
      <div>
          {post && 
          <div>
            <div>{parse(post.content)}</div>
            {post.tags.length > 0 &&
              post.tags.map(tag => {
                return <p>{tag}</p>
              })
            }
          </div>
          }
      </div>
  )
}

function App() {
  return (
    <div className="App">
      <Router>
        <Route exact path="/" component={HomePage} />
        <Route path="/posts/:slug" component={Post} />
      </Router>
    </div>
  );
}

export default App;

import React, { useState, useEffect } from "react";
import axios from "axios";
import CommunityInput from "./CommunityInput.jsx";
import CommunityFeed from "./CommunityFeed.jsx";


const CommunityPage = ({user}) => {
    const [posts, setPosts] = useState([]);
    const [makeAPost, setMakeAPost] = useState(false);

    useEffect(() => {
      getPosts()
    }, [])
  
    useEffect(() => {
    }, [posts])

    useEffect(() => {
      }, [makeAPost])
  
    const getPosts = () => {
      axios.get('/community/post')
        .then(({data}) => {
          setPosts(data)
        })
        .catch((err) => {
          console.error('NOT Invoked from client', err)
        })
    }

    const toggleInput = () => {
      setMakeAPost((makeAPost) => !makeAPost)
    }

  return (
    <div>
    <h1>Playcay Community</h1>
    <h2>
    {`Venture On, ${user.username}`}
    </h2>
    {makeAPost && <CommunityInput getPosts={() => getPosts()} userId={user.id} /> }
    <CommunityFeed posts={posts} toggleInput={() => toggleInput()} getPosts={() => getPosts()} user={user} />
    </div>
  )
}

export default CommunityPage;
import React, { useContext, useEffect, useState } from 'react'
import UserContext from '../Context/UserContext'
import Post from './Post'
import CreatePost from './CreatePost'
import { Oval } from 'react-loader-spinner'


const PostContainer = () => {

  const [loading, setLoading] = useState(true)
  const { userData, posts, fetchAllPosts, user } = useContext(UserContext)

  useEffect(() => {
    
    const loadAllPosts = async() => {
      setLoading(true)
      await fetchAllPosts()
      setLoading(false)
    }

    loadAllPosts()
  }, [])

  return (
    <div className="posts-container">
      <CreatePost />
      {loading ? (
        <h1>Loading...</h1>
      ) : posts.length > 0 ? (
        posts.map((post) => (
          <Post key={post?._id} post={post} userData={userData} />
        ))
      ) : (
        <h1>No posts to display</h1>
      )}
    </div>
  );
}

export default PostContainer
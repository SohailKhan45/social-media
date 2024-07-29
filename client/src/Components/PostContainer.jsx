/* eslint-disable react-hooks/exhaustive-deps */

import React, { useContext, useEffect, useState } from 'react'
import UserContext from '../Context/UserContext'
import Post from './Post'
import CreatePost from './CreatePost'
import { Oval } from 'react-loader-spinner'
import '../Styles/PostContainer.css' // Make sure you have the appropriate CSS for the loader

const PostContainer = () => {
  const [loading, setLoading] = useState(true)
  const { userData, posts, fetchAllPosts } = useContext(UserContext)

  useEffect(() => {
    const loadAllPosts = async () => {
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
        <div className="loader-container">
          <Oval
            height={80}
            width={80}
            color="#4fa94d"
            visible={true}
            ariaLabel='oval-loading'
            secondaryColor="#4fa94d"
            strokeWidth={2}
            strokeWidthSecondary={2}
          />
        </div>
      ) : posts.length > 0 ? (
        posts.map((post) => (
          <Post key={post?._id} post={post} userData={userData} />
        ))
      ) : (
        <h1>No posts to display</h1>
      )}
    </div>
  )
}

export default PostContainer

/* eslint-disable react-hooks/exhaustive-deps */

import React, { useContext, useEffect, useState } from 'react';
import UserContext from '../Context/UserContext';
import Post from './Post';

const LikedPosts = () => {

  const [loading, setLoading] = useState(false)
  const { likedPosts, userData, fetchLikedPosts } = useContext(UserContext);

  useEffect(() => {
    const loadLikedPosts = async () => {
      setLoading(true);
      await fetchLikedPosts();
      setLoading(false);
    };

    loadLikedPosts();
  }, []);

  return (
    <div className="liked-posts-container">
      <h1>Liked Posts</h1>
      {loading ? (
        // <div className="loader" style={{height: "100%", display: "flex", alignItems: "center", justifyContent: "center"}}>
        //   <Oval color="green" height={50} width={50} />
        // </div>
        <h1>Loading...</h1>
      ) : likedPosts.length > 0 ? (
        likedPosts.map((post) => (
          <Post key={post._id} post={post} userData={userData} />
        ))
      ) : (
        <h1>No liked posts</h1>
      )}
    </div>
  );
};

export default LikedPosts;

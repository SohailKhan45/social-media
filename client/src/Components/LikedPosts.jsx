/* eslint-disable react-hooks/exhaustive-deps */

import React, { useContext, useEffect, useState } from 'react';
import UserContext from '../Context/UserContext';
import Post from './Post';
import { Oval } from 'react-loader-spinner';

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

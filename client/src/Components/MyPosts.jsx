/* eslint-disable react-hooks/exhaustive-deps */

import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import UserContext from '../Context/UserContext';
import Post from "../Components/Post"
import { toast } from 'react-toastify';

const MyPosts = ({ userId }) => {
  const { userData } = useContext(UserContext);
  const [posts, setPosts] = useState([]);
  const navigate = useNavigate()

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const token = sessionStorage.getItem('accessToken');
        if (!token) {
          navigate("/login");
          return;
        }
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/api/users/uploaded-posts/${userId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setPosts(response.data.posts);
      } catch (error) {
        if (error.response.status === 401) {
          navigate('/login')
          sessionStorage.clear()
        }
        toast.error(error?.response?.data?.msg || 'Error while fetching posts')
      }
    };

    
    if (userData?._id) {
      fetchPosts();
    }
  }, [userId]);

  if (posts.length < 1) {
    return (
      <h1>No posts yet</h1>
    )
  }

  return (
    <div>
      {userId === userData?._id ? <h1>Your posts</h1> : <h1>Posts</h1>}
      {posts.map((post) => (
        <Post key={post._id} post={post} userData={userData} />
      ))}
    </div>
  );
};

export default MyPosts;

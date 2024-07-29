/* eslint-disable react-hooks/exhaustive-deps */

import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import UserContext from "../Context/UserContext";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart as regularHeart } from '@fortawesome/free-regular-svg-icons';
import { faHeart as solidHeart } from '@fortawesome/free-solid-svg-icons';
import { faComment } from '@fortawesome/free-regular-svg-icons';
import { faShare } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import moment from "moment";
import "../Styles/Post.css";

const debounce = (func, wait) => {
  let timeout;
  return function(...args) {
    const context = this;
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(context, args), wait);
  };
};

const Post = ({ post, userData }) => {
  const [liked, setLiked] = useState(post?.likes?.includes(userData?._id));
  const [likeCount, setLikeCount] = useState(post?.likes?.length || 0);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { fetchAllPosts } = useContext(UserContext);

  useEffect(() => {
    setLiked(post?.likes?.includes(userData?._id));
    setLikeCount(post?.likes?.length || 0);
  }, [post]);

  const handleLikeClick = debounce(async () => {
    if (loading) return;
    setLoading(true);

    const previousLiked = liked;
    const previousLikeCount = likeCount;

    // Optimistic UI update
    setLiked(!previousLiked);
    setLikeCount(previousLiked ? previousLikeCount - 1 : previousLikeCount + 1);

    try {
      const data = {
        userId: userData._id,
        postId: post._id,
      };

      const token = sessionStorage.getItem('accessToken');
      if (!token) {
        navigate('/login');
        return;
      }
      await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/posts/like`, data, {
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (error) {
      // Rollback UI update if request fails
      setLiked(previousLiked);
      setLikeCount(previousLikeCount);

      if (error.response.status === 401) {
        navigate('/login');
        sessionStorage.clear();
      }
      toast.error(error?.response?.data?.msg || 'Error while liking/unliking post');
    } finally {
      setLoading(false);
    }
  }, 300);

  const handleDeleteClick = async () => {
    const toastId = toast.loading("Deleting...");
    try {
      const token = sessionStorage.getItem('accessToken');
      if (!token) {
        navigate('/login');
        return;
      }
      const response = await axios.delete(
        `${process.env.REACT_APP_BACKEND_URL}/api/posts/delete`,
        {
          headers: { Authorization: `Bearer ${token}` },
          data: { postId: post._id },
        }
      );
      if (response.status === 200) {
        toast.update(toastId, { render: response.data.msg || "Post deleted successfully", type: "success", isLoading: false, autoClose: 3000 });
      }
      fetchAllPosts();
    } catch (error) {
      if (error.response.status === 401) {
        navigate('/login');
        sessionStorage.clear();
      }
      toast.error(error?.response?.data?.msg || 'Error while deleting post');
      toast.update(toastId, { render: "Error while deleting the post", type: "error", isLoading: false, autoClose: 3000 });
    }
  };

  const handleUserProfileClick = () => {
    navigate(`/profile/${post?.createdBy?._id}`);
  };

  return (
    <div className="post">
      <div className="post-top">
        <div className="user-data">
          <img src={post?.createdBy?.profilePic} onClick={handleUserProfileClick} alt="" />
          <div className="user-info">
            <h3 onClick={handleUserProfileClick}>{post?.createdBy?.username}</h3>
            <p>{moment(post?.createdAt).fromNow()}</p>
          </div>
        </div>
        {userData?.username === post?.createdBy?.username && (
          <i className='bx bx-trash-alt delete' onClick={handleDeleteClick}></i>
        )}
      </div>
      <div className="post-caption">
        <h3>{post?.caption}</h3>
      </div>
      <div className="post-image">
        <img src={post?.postUrl} alt="" />
      </div>
      <div className="post-icons">
        <FontAwesomeIcon 
          className='icon'
          icon={liked ? solidHeart : regularHeart} 
          style={{ color: liked ? "red" : "" }} 
          onClick={handleLikeClick} 
        />
        <FontAwesomeIcon 
          className='icon' 
          icon={faComment} 
        />
        <FontAwesomeIcon 
          className='icon' 
          icon={faShare} 
        />
      </div>
      <div className="post-likes">
        <p>{likeCount} likes</p>
      </div>
    </div>
  );
};

export default Post;

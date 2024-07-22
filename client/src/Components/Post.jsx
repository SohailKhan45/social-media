import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import UserContext from "../Context/UserContext"
import axios from 'axios';
import moment from "moment";
import "../Styles/Post.css";

const Post = ({ post, userData }) => {
  const [liked, setLiked] = useState(post?.likes?.includes(userData?._id));
  const [likeCount, setLikeCount] = useState(post?.likes?.length || 0);
  const navigate = useNavigate();
  const { fetchAllPosts } = useContext(UserContext)

  useEffect(() => {
    setLiked(post?.likes?.includes(userData?._id));
    setLikeCount(post?.likes?.length || 0);
  }, [post]);

  const handleLikeClick = async () => {
    try {
      const data = {  
        userId: userData._id,
        postId: post._id,
      };

      setLiked((prev) => !prev);
      setLikeCount((prev) => (liked ? prev - 1 : prev + 1));
      const token = sessionStorage.getItem('accessToken');
        if (!token) {
          navigate('/login')
          return;
        }
      await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/posts/like`, data,
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (error) {
      if (error.response.status === 401) {
        navigate('/login')
        sessionStorage.clear()
      }
      toast.error(error?.response?.data?.msg || 'Error while fetching followers')
      setLiked((prev) => !prev);
      setLikeCount((prev) => (liked ? prev + 1 : prev - 1));
    }
  };

  const handleDeleteClick = async () => {
    const toastId = toast.loading("Deleting...");
    try {
      const token = sessionStorage.getItem('accessToken');
        if (!token) {
          navigate('/login')
          return;
      }
      console.log('Token present sending request')
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
      fetchAllPosts()
    } catch (error) {
      if (error.response.status === 401) {
        navigate('/login')
        sessionStorage.clear()
      }
      toast.error(error?.response?.data?.msg || 'Error while fetching followers')
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
        <i className='bx bxs-heart' style={{ color: liked ? "red" : "" }} onClick={handleLikeClick}></i>
        <i className="bx bx-comment-dots"></i>
        <i className="bx bx-share"></i>
      </div>
      <div className="post-likes">
        <p>{likeCount} likes</p>
      </div>
    </div>
  );
};

export default Post;

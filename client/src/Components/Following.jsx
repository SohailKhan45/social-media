/* eslint-disable react-hooks/exhaustive-deps */

import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import "../Styles/Following.css";
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import UserContext from '../Context/UserContext';


const Following = ({ userId, onClose, onUnfollow }) => {
  const [following, setFollowing] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const { user } = useContext(UserContext)
  const isOwner = userId === user
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFollowing = async () => {
      setIsLoaded(false);
      try {
        const token = sessionStorage.getItem('accessToken');
        if (!token) {
          navigate("/login");
          return;
        }
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/users/following`, {
          params: { userId },
          headers: { Authorization: `Bearer ${token}` }
        });
        setIsLoaded(true);
        setFollowing(response.data.following);
      } catch (error) {
        if (error?.response?.status === 401) {
          navigate('/login')
          sessionStorage.clear()
        }
        setIsLoaded(true);
        toast.error(error?.response?.data?.msg || 'Error while fetching following')
      }
    };
    fetchFollowing();
  }, [userId]);

  const handleUnfollow = async (followUserId) => {
    try {
      const token = sessionStorage.getItem('accessToken');
        if (!token) {
          navigate('/login')
          return;
        }
      await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/users/toggle-follow`,
        {
          userId,
          followUserId,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setFollowing(following.filter(user => user._id !== followUserId));
    } catch (error) {
      if (error?.response?.status === 401) {
        navigate('/login')
        sessionStorage.clear()
      }
      toast.error(error?.response?.data?.msg || 'Error while unfollowing')
    }
  };

  const handleProfileClick = (followingId) => {
    navigate(`/profile/${followingId}`);
    onClose();
  };

  return (
    <div className="following-container">
      <button onClick={onClose} className="close-button">
        Close
      </button>
      <h2>Following</h2>
      <ul>
        {isLoaded ? (
          following.length > 0 ? (
            following.map((user) => (
              <li key={user._id}>
                <div className="following-info">
                  <img
                    src={user.profilePic}
                    alt={user.username}
                    onClick={() => handleProfileClick(user._id)}
                  />
                  <span onClick={() => handleProfileClick(user._id)}>
                    {user.username}
                  </span>
                </div>
                {isOwner ? <button onClick={() => handleUnfollow(user._id)}>Unfollow</button> : ""}
              </li>
            ))
          ) : (
            <li>No users to display</li>
          )
        ) : (
          <li>Loading...</li>
        )}
      </ul>
    </div>
  );
};

export default Following;

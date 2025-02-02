/* eslint-disable react-hooks/exhaustive-deps */

import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import UserContext from "../Context/UserContext";
import "../Styles/Followers.css";
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Oval } from 'react-loader-spinner'; // Import the Oval loader

const Followers = ({ userId, onClose }) => {
  const [followers, setFollowers] = useState([]);
  const [loading, setLoading] = useState(true); // Add loading state
  const { user } = useContext(UserContext);
  const isOwner = userId === user;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFollowers = async () => {
      try {
        const token = sessionStorage.getItem('accessToken');
        if (!token) {
          navigate('/login');
          return;
        }
        setLoading(true); // Set loading to true before starting fetch
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/users/followers`, {
          params: { userId },
          headers: { Authorization: `Bearer ${token}` }
        });
        setFollowers(response.data.followers);
      } catch (error) {
        if (error?.response?.status === 401) {
          navigate('/login');
          sessionStorage.clear();
        }
        toast.error(error?.response?.data?.msg || 'Error while fetching followers');
      } finally {
        setLoading(false); // Set loading to false after fetching
      }
    };
    fetchFollowers();
  }, [userId]);

  const handleRemoveFollower = async (followerId) => {
    try {
      const token = sessionStorage.getItem('accessToken');
      if (!token) {
        navigate('/login');
        return;
      }
      await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/users/remove-follower`, {
        userId,
        followerId
      },
      { headers: { Authorization: `Bearer ${token}` } });
      setFollowers(followers.filter(follower => follower._id !== followerId));
    } catch (error) {
      if (error?.response?.status === 401) {
        navigate('/login');
        sessionStorage.clear();
      }
      toast.error(error?.response?.data?.msg || 'Error while removing followers');
    }
  };

  const handleProfileClick = (followerId) => {
    navigate(`/profile/${followerId}`);
  }

  return (
    <div className="followers-container">
      <button onClick={onClose} className="close-button">
        Close
      </button>
      <h2>Followers</h2>
      {loading ? (
        <div className="loader-container">
          <Oval
            height={30}
            width={30}
            color="#4fa94d"
            visible={true}
            ariaLabel='oval-loading'
            secondaryColor="#4fa94d"
            strokeWidth={2}
            strokeWidthSecondary={2}
          />
        </div>
      ) : (
        <ul>
          {followers.map((follower) => (
            <li key={follower._id}>
              <div className="follower-info">
                <img src={follower.profilePic} alt={follower.username} onClick={() => {
                  handleProfileClick(follower?._id);
                  onClose();
                }} />
                <span onClick={() => {
                  handleProfileClick(follower?._id);
                  onClose();
                }}>{follower.username}</span>
              </div>
              {isOwner ? <button onClick={() => handleRemoveFollower(follower._id)}>
                Remove
              </button> : ""}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Followers;

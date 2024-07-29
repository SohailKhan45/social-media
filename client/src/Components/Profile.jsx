/* eslint-disable react-hooks/exhaustive-deps */

import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import "../Styles/Profile.css";
import CreatePost from './CreatePost';
import UserContext from '../Context/UserContext';
import MyPosts from './MyPosts';
import axios from "axios";
import Followers from './Followers';
import Following from './Following';
import { toast } from 'react-toastify';
import { Oval } from 'react-loader-spinner';

const Profile = () => {
  const navigate = useNavigate();
  const { posts, userData } = useContext(UserContext);
  const { userId } = useParams();
  const [user, setUser] = useState([]);
  const [showFollowers, setShowFollowers] = useState(false);
  const [showFollowing, setShowFollowing] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [loadingFollow, setLoadingFollow] = useState(false);
  const [loadingUserData, setLoadingUserData] = useState(true);
  // eslint-disable-next-line
  const [loadingFollowStatus, setLoadingFollowStatus] = useState(true);

  const fetchUserData = async () => {
    try {
      const token = sessionStorage.getItem('accessToken');
      if (!token) {
        navigate('/login')
        return;
      }
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/users/info`, {
        params: { userId },
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser(response.data.user);
    } catch (error) {
      if (error.response.status === 401) {
        navigate('/login')
        sessionStorage.clear()
      }
      toast.error(error?.response?.data?.msg || 'Error while fetching user data')
    } finally {
      setLoadingUserData(false);
    }
  };

  const fetchFollowStatus = async () => {
    try {
      const token = sessionStorage.getItem('accessToken');
      if (!token) {
        navigate("/login");
        return;
      }
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/users/following`, {
        params: { userId: userData._id },
        headers: { Authorization: `Bearer ${token}` }
      });
      const following = response.data.following.map(followingUser => followingUser._id);
      setIsFollowing(following.includes(userId));
    } catch (error) {
      if (error.response.status === 401) {
        navigate('/login')
        sessionStorage.clear()
      }
      toast.error(error?.response?.data?.msg || 'Error while fetching follow status')
    } finally {
      setLoadingFollowStatus(false);
    }
  };

  const handleFollowToggle = async () => {
    try {
      setLoadingFollow(true);
      const token = sessionStorage.getItem('accessToken');
      if (!token) {
        navigate('/login')
        return;
      }
      await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/users/toggle-follow`, {
        userId: userData._id,
        followUserId: userId
      },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setIsFollowing(!isFollowing);
    } catch (error) {
      if (error.response.status === 401) {
        navigate('/login')
        sessionStorage.clear()
      }
      toast.error(error?.response?.data?.msg || 'Error while toggling follow status')
    } finally {
      setLoadingFollow(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, [userId]);

  useEffect(() => {
    if (userData._id && userId !== userData._id) {
      fetchFollowStatus();
    }
  }, [userData, userId]);

  const handleFollowersClick = () => {
    setShowFollowers(true);
  };

  const handleFollowingClick = () => {
    setShowFollowing(true);
  };

  const closeFollowersOverlay = () => {
    setShowFollowers(false);
  };

  const closeFollowingOverlay = () => {
    setShowFollowing(false);
  };

  return (
    <>
      <div className="profile-main">
        {loadingUserData ? (
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
        ) : (
          <>
            <img src={user?.profilePic} alt="" />
            <h3>{user?.username}</h3>
            <h3>{user?.fullname}</h3>
            <p>{user?.bio}</p>
            {user?._id === userData?._id && (
              <button className='edit-button' onClick={() => navigate(`/edit-profile/${user._id}`)}>Edit Profile</button>
            )}
            {user?._id !== userData?._id && (
              <button className='follow-button' onClick={handleFollowToggle} disabled={loadingFollow}>
                {loadingFollow ? '...' : isFollowing ? 'Unfollow' : 'Follow'}
              </button>
            )}
            <div className="follower-following">
              <div className="following" style={{ cursor: "pointer" }} onClick={handleFollowingClick}>
                <h3>{user?.following?.length}</h3>
                <p>Following</p>
              </div>
              <div className="followers" style={{ cursor: "pointer" }} onClick={handleFollowersClick}>
                <h3>{user?.followers?.length}</h3>
                <p>Followers</p>
              </div>
              <div className="posts">
                <h3>{posts?.filter((post) => post?.createdBy?._id === user?._id)?.length}</h3>
                <p>Posts</p>
              </div>
            </div>
          </>
        )}
      </div>
      <CreatePost />
      <MyPosts userId={userId} />
      {showFollowers && (
        <div className="overlay">
          <div className="overlay-content">
            <Followers userId={userId} onClose={closeFollowersOverlay} />
          </div>
        </div>
      )}
      {showFollowing && (
        <div className="overlay">
          <div className="overlay-content">
            <Following userId={userId} onClose={closeFollowingOverlay} />
          </div>
        </div>
      )}
    </>
  );
};

export default Profile;

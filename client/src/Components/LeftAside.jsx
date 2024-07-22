import React, { useContext, useEffect, useState } from 'react'
import axios from 'axios'
import Avatar from '../avatar.jpg'
import UserContext from '../Context/UserContext'
import { Link, useNavigate } from 'react-router-dom'
import { Oval } from 'react-loader-spinner'
import { toast } from 'react-toastify'
import '../Styles/LeftAside.css'

const LeftAside = () => {
  const { userData } = useContext(UserContext)
  const [suggestedUsers, setSuggestedUsers] = useState([])
  const [loadingFollow, setLoadingFollow] = useState({}) 
  const navigate = useNavigate()

  useEffect(() => {
    const fetchSuggestedUsers = async () => {
      try {
        const token = sessionStorage.getItem('accessToken');
        if (!token) {
          navigate("/login");
          return;
        }
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/users/suggested-users`, {
          params: { userId: userData._id },
          headers: { Authorization: `Bearer ${token}` }
        });
        setSuggestedUsers(response.data.suggestedUsers)
      } catch (error) {
        if (error.response.status === 401) {
          navigate('/login')
          sessionStorage.clear()
        }
        toast.error(error?.response?.data?.msg || 'Error while fetching suggested users')
      }
    };

    if (userData._id) {
      fetchSuggestedUsers();
    }
  }, [userData]);

  const handleFollowToggle = async (followUserId) => {
    try {
      const token = sessionStorage.getItem('accessToken');
        if (!token) {
          navigate('/login')
          return;
        }
      setLoadingFollow((prev) => ({ ...prev, [followUserId]: true })); // Set loading true for this user
      await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/users/toggle-follow`,
        {
          userId: userData._id,
          followUserId,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSuggestedUsers((prev) =>
        prev.map((user) =>
          user._id === followUserId
            ? {
                ...user,
                isFollowing: !user.isFollowing
              }
            : user
        )
      );
    } catch (error) {
      if (error.response.status === 401) {
        navigate('/login')
        sessionStorage.clear()
      }
      toast.error(error?.response?.data?.msg || 'Error while following or unfollowing')
    } finally {
      setLoadingFollow((prev) => ({ ...prev, [followUserId]: false }))
    }
  };

  const handleOnClick = (userId) => {
    navigate(`/profile/${userId}`);
  };
  
  return (
    <aside className="left-aside">
      <div className="profile-card">
        <img src={userData?.profilePic} alt="Profile" />
        <h3>{userData?.username}</h3>
        <p>{userData?.bio}</p>
        <div className="follower-following">
          <div className="following">
            <h3>{userData?.following?.length}</h3>
            <p>Following</p>
          </div>
          <div className="followers">
            <h3>{userData?.followers?.length}</h3>
            <p>Followers</p>
          </div>
        </div>
        <Link to={`/profile/${userData?._id}`}>My Profile</Link>
      </div>
      <h3 className='suggested-heading'>People you may know</h3>
      <div className="suggested-users">
        {suggestedUsers?.map((user) => (
          <div className="user" key={user?._id}>
            <div className="user-left">
              <img
                src={user?.profilePic || Avatar}
                alt="Avatar"
                onClick={() => handleOnClick(user?._id)}
              />
              <div className="name">
                <h3 onClick={() => handleOnClick(user?._id)}>{user?.fullname}</h3>
                <p onClick={() => handleOnClick(user?._id)}>@{user?.username}</p>
              </div>
            </div>
            <button style={{display: "flex", alignItems: "center", justifyContent: "center"}} onClick={() => handleFollowToggle(user?._id)} disabled={loadingFollow[user._id]}>
              {loadingFollow[user._id] ? <Oval color="#fff" height={15} c width={15} /> : user?.isFollowing ? 'Unfollow' : 'Follow'}
            </button>
          </div>
        ))}
      </div>
    </aside>
  );
};

export default LeftAside

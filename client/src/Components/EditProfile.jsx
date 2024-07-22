import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import UserContext from '../Context/UserContext';
import { toast } from "react-toastify"
import '../Styles/EditProfile.css';

const EditProfile = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { setUserData } = useContext(UserContext);

  const [formData, setFormData] = useState({
    username: '',
    fullname: '',
    oldPassword: '',
    newPassword: '',
    bio: '',
    profilePic: null,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
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
        const { username, fullname, bio } = response?.data?.user;
        setFormData({ ...formData, username, fullname, bio });
      } catch (error) {
        navigate('/login')
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, [userId]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({ ...formData, [name]: files ? files[0] : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formDataToSend = new FormData();
    formDataToSend.append('userId', userId);
    formDataToSend.append('username', formData.username);
    formDataToSend.append('fullname', formData.fullname);
    formDataToSend.append('oldPassword', formData.oldPassword);
    formDataToSend.append('bio', formData.bio);
    if (formData.newPassword) {
      formDataToSend.append('newPassword', formData.newPassword);
    }
    if (formData.profilePic) {
      formDataToSend.append('profilePic', formData.profilePic);
    }

    try {
      const token = sessionStorage.getItem('accessToken');
        if (!token) {
          navigate('/login')
          return;
        }
      const response = await axios.put(
        `${process.env.REACT_APP_BACKEND_URL}/api/users/edit-profile/${userId}`,
        formDataToSend,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUserData(response?.data?.user)
      toast.success(response?.data?.msg)
      navigate(`/profile/${userId}`);
      
    } catch (error) {
      if (error.response.status === 401 || error.response.status === 403) {
        navigate('/login')
        sessionStorage.clear()
      }
      toast.error(error?.response?.data?.msg || "Error updating post");
    } finally {
      setLoading(false);  
    }
  };

  return (
    <div className="edit-profile">
      <h2>Edit Profile</h2>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <label>
          Username:
          <input type="text" name="username" value={formData.username} onChange={handleChange} required />
        </label>
        <label>
          Full Name:
          <input type="text" name="fullname" value={formData.fullname} onChange={handleChange} required />
        </label>
        <label>
          Bio:
          <textarea name="bio" value={formData.bio} onChange={handleChange} />
        </label>
        <label>
          Old Password:
          <input type="password" name="oldPassword" value={formData.oldPassword} onChange={handleChange} />
        </label>
        <label>
          New Password:
          <input type="password" name="newPassword" value={formData.newPassword} onChange={handleChange} />
        </label>
        <label>
          Profile Picture:
          <input type="file" name="profilePic" onChange={handleChange} />
        </label>
        <button type="submit" disabled={loading}>
          {loading ? <div className="loader">...</div> : 'Edit'}
        </button>
      </form>
    </div>
  );
};

export default EditProfile;

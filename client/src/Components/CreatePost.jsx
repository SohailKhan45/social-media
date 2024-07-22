import React, { useContext, useState } from 'react';
import axios from 'axios';
import UserContext from '../Context/UserContext';
import { toast } from "react-toastify";
import { Oval } from 'react-loader-spinner'; 
import { useNavigate } from 'react-router-dom';
import "../Styles/CreatePost.css";


const CreatePost = () => {
  const { userData, fetchAllPosts } = useContext(UserContext);
  const [caption, setCaption] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileName, setFileName] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate()

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
    setFileName(event.target.files[0].name);
  };

  const handleCreatePost = async () => {
    setLoading(true); 
    const formData = new FormData();
    formData.append('postImage', selectedFile);
    formData.append('caption', caption);
    formData.append('createdBy', userData?._id);

    try {
      const token = sessionStorage.getItem('accessToken');
      if (!token) {
        return;
      }
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/posts/create`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        },
      });
      fetchAllPosts()
      toast.success(response.data.msg ||  'Post created successfully');
      setCaption('');
      setSelectedFile(null);
      setFileName('');
    } catch (error) {
      if (error.response.status === 401) {
        navigate('/login')
        sessionStorage.clear()
      }
      toast.error(error.response?.data?.msg || 'Error while creating post');
    } finally {
      setLoading(false); // Set loading to false when the request completes
    }
  };

  return (
    <div className="post-container">
      <input
        type="text"
        placeholder="Add caption"
        value={caption}
        onChange={(event) => setCaption(event.target.value)}
      />
      <div className="post-files">
        <label htmlFor="photo" className="photo-label">
          <div className="photo">
            <i className="bx bx-image"></i>
            <h3>Photo</h3>
            <span>{fileName}</span>
          </div>
        </label>
        <input
          type="file"
          id="photo"
          onChange={handleFileChange}
        />
        <label htmlFor="" className="video-label">
          <div className="video">
            <i className="bx bx-play-circle"></i>
            <h3>Video</h3>
          </div>
        </label>
        <label htmlFor="" className="schedule-label">
          <div className="schedule">
            <i className="bx bx-calendar"></i>
            <h3>Schedule</h3>
          </div>
        </label>
        <button onClick={handleCreatePost} disabled={loading}>
          {loading ? <Oval color="#fff" height={20} width={20} /> : 'Post'}
        </button>
      </div>
    </div>
  );
};

export default CreatePost;

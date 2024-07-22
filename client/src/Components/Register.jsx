import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from "react-toastify"
import "../Styles/Register.css";

const Register = () => {
  const [newUserData, setNewUserData] = useState({
    username: "",
    fullname: "",
    password: ""
  });
  const [isLoading, setIsLoading] = useState(false)
  const [file, setFile] = useState(null);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setNewUserData({ ...newUserData, [id]: value });
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleRemoveFile = () => {
    setFile(null);
    document.getElementById('profilePic').value = "";
  };

  const handleSubmit = async (e) => {
    setIsLoading(true)
    e.preventDefault();
    const formData = new FormData();
    formData.append("username", newUserData.username);
    formData.append("fullname", newUserData.fullname);
    formData.append("password", newUserData.password);
    formData.append("profilePic", file);

    try {
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/users/create`, formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });
      setIsLoading(false)
      toast.success(response.data.msg || 'User created successfully')
      setNewUserData({ username: "", fullname: "", password: "" });
      setFile(null);
      document.getElementById('profilePic').value = "";
      navigate('/login');
    } catch (error) {
      setIsLoading(false)
      toast.error(error.response.data.msg || 'Error while registering user')
    }
  };

  return (
    <div className="register-container">
      <form onSubmit={handleSubmit}>
        <h2>Register</h2>
        <div className="input-group">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            value={newUserData.username}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="input-group">
          <label htmlFor="fullname">Full Name</label>
          <input
            type="text"
            id="fullname"
            value={newUserData.fullname}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="input-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={newUserData.password}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="input-group">
          <label htmlFor="profilePic">Profile Picture</label>
          <input
            type="file"
            id="profilePic"
            onChange={handleFileChange}
            required
          />
          {file && (
            <div className="file-info">
              <span>{file.name}</span>
              <button type="button" onClick={handleRemoveFile}>Remove</button>
            </div>
          )}
        </div>
        <button type="submit">{isLoading ? "Loading..." : "Register"}</button>
        <button type="button" className="login-direct" onClick={() => navigate("/login")} >Already have an account</button>
      </form>
    </div>
  );
}

export default Register;

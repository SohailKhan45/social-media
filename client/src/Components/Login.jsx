import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import UserContext from "../Context/UserContext";
import { toast } from "react-toastify";
import "../Styles/Login.css";

const Login = () => {
  const [credentials, setCredentials] = useState({ username: "", password: "" })
  const { setUser } = useContext(UserContext)
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCredentials({ ...credentials, [name]: value });
  };

  const handleSubmit = async (e) => {
    setIsLoading(true)
    e.preventDefault();
    try {
      console.log(credentials, 'Sending request')
      console.log('Backend URL:', process.env.REACT_APP_BACKEND_URL); 
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/users/login`, credentials, { withCredentials: true });

      if (response?.status === 200) {
        setIsLoading(false)
        toast.success("Logged in successfully!");
        sessionStorage.setItem('accessToken', response.data.accessToken)
        sessionStorage.setItem('userId', response.data.userId)
        setUser(response.data.userId);
        setCredentials({ username: "", password: "" })
        navigate("/home");
      }
    } catch (error) {
      console.log(error, 'Error was this')
      setIsLoading(false)
      toast.error(error?.response?.data?.msg || "Error while logging in");
    }
  };


  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Login</h2>
        <input
          type="text"
          placeholder="Username"
          name="username"
          className="login-input"
          value={credentials.username}
          onChange={handleInputChange}
          required
        />
        <input
          type="password"
          placeholder="Password"
          name="password"
          className="login-input"
          value={credentials.password}
          onChange={handleInputChange}
          required
        />
        <button type="submit" className="login-button">{isLoading ? "Loading..." : "Login"}</button>
        <button type="button" className="account-button" onClick={() => navigate("/register")}>
          Don't have an account?
        </button>
      </form>
    </div>
  );
};

export default Login;

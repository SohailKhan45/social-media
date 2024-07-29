/* eslint-disable react-hooks/exhaustive-deps */

import React, { useEffect, useState } from "react";
import UserContext from "./UserContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
const UserContextProvider = ({ children }) => {

  const [user, setUser] = useState(sessionStorage.getItem('userId') || null);
  const [userData, setUserData] = useState({});
  const [posts, setPosts] = useState([]);
  const [likedPosts, setLikedPosts] = useState([]);
  const navigate = useNavigate()

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = sessionStorage.getItem('accessToken');
        if (!token) {
          navigate('/login')
          return;
        }
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/users/info`, {
          params: { userId: user },
          headers: { Authorization: `Bearer ${token}` }
        });
        setUserData(response.data.user);
      } catch (error) {
        if (error?.response?.status === 401) {
          navigate('/login')
          sessionStorage.clear()
        }
        toast.error(error?.response?.data?.msg || 'Error while fetching followers')
      }
    };
    

    if (user) {
      fetchUserData()
    }
  }, [user])

  const fetchAllPosts = async () => {
    try {
      const token = sessionStorage.getItem('accessToken');
        if (!token) {
          navigate('/login')
          return;
        }
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/posts/allposts`,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setPosts(response.data.posts)
    } catch (error) {
      if (error.response.status === 401) {
        navigate('/login')
        sessionStorage.clear()
      }
      toast.error(error?.response?.data?.msg || 'Error while fetching followers')
    }
  }

  const fetchLikedPosts = async () => {
    if (!userData._id) return
    try {
      const token = sessionStorage.getItem('accessToken');
        if (!token) {
          navigate('/login')
          return;
        }
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/users/liked-posts`, {
        params: { userId: userData._id },
        headers: { Authorization: `Bearer ${token}` }
      })
      setLikedPosts(response.data.likedPosts)
    } catch (error) {
      if (error.response.status === 401) {
        navigate('/login')
        sessionStorage.clear()
      }
      toast.error(error?.response?.data?.msg || 'Error while fetching followers')
    }
  }

  useEffect(() => {
    if (userData._id) {
      fetchLikedPosts()
    }
  }, [userData])

  return (
    <UserContext.Provider value={{ user, setUser, userData, setUserData, posts, likedPosts, fetchLikedPosts, fetchAllPosts }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserContextProvider;

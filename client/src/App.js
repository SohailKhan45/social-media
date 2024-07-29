import React, { useContext } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./Components/Login";
import Register from "./Components/Register";
import UserContextProvider from "./Context/UserContextProvider";
import UserContext from "./Context/UserContext";
import Home from "./Components/Home";
import Profile from "./Components/Profile";
import LikedPosts from "./Components/LikedPosts";
import PostContainer from "./Components/PostContainer";
import EditProfile from "./Components/EditProfile";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import "./App.css";

const App = () => {
  const { user } = useContext(UserContext);

  return (
      <Routes>
        <Route path="/" element={user ? <Navigate to="/home" /> : <Navigate to="/login" />} />
        <Route path="/home" element={user ? <Home><PostContainer /></Home> : <Navigate to="/login" />} />
        <Route path="/liked-posts/:userId" element={user ? <Home><LikedPosts /></Home> : <Navigate to="/login" />} />
        <Route path="/profile/:userId" element={user ? <Home><Profile /></Home> : <Navigate to="/login" />} />
        <Route path="/edit-profile/:userId" element={user ? <Home><EditProfile /></Home> : <Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
  );
};

const WrappedApp = () => (
  
  <Router>
    <UserContextProvider>
      <App />
      <ToastContainer />
    </UserContextProvider>
  </Router>
);

export default WrappedApp;

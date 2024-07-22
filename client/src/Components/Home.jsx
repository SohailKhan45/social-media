import React from 'react';
import "../Styles/Home.css";
import '../Styles/Navbar.css';
import LeftAside from './LeftAside';
import RightAside from './RightAside';
import Navbar from './Navbar';

const Home = ({ children }) => {
  return (
    <>
      <Navbar />
      <div className="home-container">
        <LeftAside />
        <main className="main">
          {children}
        </main>
        <RightAside />
      </div>
    </>
  );
};

export default Home;

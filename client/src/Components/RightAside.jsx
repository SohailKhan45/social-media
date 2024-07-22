import React from 'react'
import "../Styles/RightAside.css"

const RightAside = () => {
  return (
    <aside className="right-aside">
      <div className="trend-container">
        <h3 className="trends-heading">Trends for you</h3>
        <div className="trend">
          <h3>#Minions</h3>
          <p>97k shares</p>
        </div>
        <div className="trend">
          <h3>#ReactJS</h3>
          <p>72k shares</p>
        </div>
        <div className="trend">
          <h3>#NeedforSpeed</h3>
          <p>75k shares</p>
        </div>
        <div className="trend">
          <h3>#FIFA22</h3>
          <p>78k shares</p>
        </div>
        <div className="trend">
          <h3>#MERN</h3>
          <p>89k shares</p>
        </div>
        <div className="trend">
          <h3>#Rizz</h3>
          <p>56k shares</p>
        </div>
        <div className="trend">
          <h3>#WGeneration</h3>
          <p>77k shares</p>
        </div>
      </div>
    </aside>
  );
}

export default RightAside
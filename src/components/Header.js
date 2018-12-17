import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class Header extends Component {
  render() {
    return (
      <header>
        <div className="Navbar">
          <Link to="/">Home</Link>
          <Link to="/photo">Photo Input</Link>
          <Link to={{ pathname: '/camera-front', state: 'front' }}>
            Video Camera
          </Link>
          {/* <Link to={{ pathname: '/camera-back', state: 'back' }}>
            Back Camera
          </Link> */}
        </div>
      </header>
    );
  }
}

export default Header;

import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class Header extends Component {
  render() {
    return (
      <header>
        <Link to="/photo">Photo </Link>
        <Link to={{ pathname: '/camera-front', state: 'front' }}>
          Front Camera{' '}
        </Link>
        <Link to={{ pathname: '/camera-back', state: 'back' }}>
          Back Camera{' '}
        </Link>
      </header>
    );
  }
}

export default Header;

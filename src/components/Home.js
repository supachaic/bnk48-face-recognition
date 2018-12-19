import React, { Component } from 'react';

export default class Home extends Component {
  render() {
    const WIDTH = document.documentElement.clientWidth;
    return (
      <div
        style={{
          border: 'solid',
          borderRadius: 10,
          width: { WIDTH },
          margin: 10,
          marginTop: 10,
          padding: 5
        }}
      >
        <h3>BNK48 Facial Recognition App</h3>
        <a href="https://github.com/supachaic/bnk48-face-recognition">
          My Repo
        </a>
      </div>
    );
  }
}

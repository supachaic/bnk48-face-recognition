import React, { Component } from 'react';
import { Route, Router } from 'react-router-dom';
import createHistory from 'history/createBrowserHistory';
import FaceRecognition from './components/faceRecognition';
import CameraFaceDetect from './components/cameraFaceDetect';
import Home from './components/Home';
import Header from './components/Header';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Router history={createHistory({ basename: process.env.PUBLIC_URL })}>
          <div className="route">
            <Header />
            <Route exact path="/" component={Home} />
            <Route exact path="/photo" component={FaceRecognition} />
            <Route exact path="/camera" component={CameraFaceDetect} />
          </div>
        </Router>
      </div>
    );
  }
}

export default App;

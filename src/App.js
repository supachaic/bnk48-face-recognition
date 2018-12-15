import React, { Component } from 'react';
import { Route, BrowserRouter as Router } from 'react-router-dom';
import FaceRecognition from './components/faceRecognition';
import CameraFaceDetect from './components/cameraFaceDetect';
import Header from './components/Header';
//import { createBrowserHistory } from 'history';
import './App.css';

//var hist = createBrowserHistory();

class App extends Component {
  render() {
    return (
      <div className="App">
        <Router basename={process.env.PUBLIC_URL}>
          <div className="route">
            <Header />
            {/* <Route exact path="/" component={FaceRecognition} /> */}
            <Route
              exact
              path="/"
              render={routerProps => (
                <FaceRecognition routerProps={routerProps} />
              )}
            />
            <Route
              exact
              path="/photo"
              render={routerProps => (
                <FaceRecognition routerProps={routerProps} />
              )}
            />
            {/* <Route exact path="/photo" component={FaceRecognition} /> */}
            <Route exact path="/camera-front" component={CameraFaceDetect} />
            <Route exact path="/camera-back" component={CameraFaceDetect} />
          </div>
        </Router>
      </div>
    );
  }
}

export default App;

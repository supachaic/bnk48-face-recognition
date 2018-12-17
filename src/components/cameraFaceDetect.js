import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import Webcam from 'react-webcam';
import { getFullFaceDescription, createMatcher } from '../api/face';
import DrawBox from './drawBox';

const bnk48JSON = require('../descriptors/bnk48.json');
const WIDTH = 480;
const HEIGHT = 480;

class CameraFaceDetect extends Component {
  constructor(props) {
    super(props);
    this.webcam = React.createRef();
    this.state = {
      fullDesc: null,
      faceMatcher: null,
      facingMode: null,
      inputDeviceVideo: 0
    };
  }

  componentWillMount() {
    this.setInputDevice();
    this.matcher();
  }

  setInputDevice = () => {
    navigator.mediaDevices.enumerateDevices().then(async devices => {
      let inputDevice = await devices.filter(
        device => device.kind === 'videoinput'
      );
      await this.setState({ inputDeviceVideo: inputDevice.length });
      if (inputDevice.length < 2) {
        await this.setState({
          facingMode: 'user'
        });
      } else {
        await this.setState({
          facingMode: { exact: 'environment' }
        });
      }
      this.startCapture();
    });
  };

  matcher = async () => {
    const faceMatcher = await createMatcher(bnk48JSON);
    this.setState({ faceMatcher });
  };

  startCapture = () => {
    this.interval = setInterval(() => {
      this.capture();
    }, 1000);
  };

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  capture = async () => {
    if (!!this.webcam.current) {
      await getFullFaceDescription(this.webcam.current.getScreenshot()).then(
        fullDesc => this.setState({ fullDesc })
      );
    }
  };

  render() {
    const { fullDesc, faceMatcher, facingMode, inputDeviceVideo } = this.state;
    let videoConstraints = null;
    if (!!facingMode) {
      videoConstraints = {
        width: WIDTH,
        height: HEIGHT,
        facingMode: facingMode
      };
    }

    return (
      <div
        className="Camera"
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}
      >
        <p>Number of Camera: {inputDeviceVideo}</p>
        <div
          style={{
            width: WIDTH,
            height: HEIGHT,
            marginTop: 10,
            border: 'solid'
          }}
        >
          <div style={{ position: 'relative', width: WIDTH }}>
            {!!videoConstraints ? (
              <div style={{ position: 'absolute' }}>
                <Webcam
                  audio={false}
                  width={WIDTH}
                  height={HEIGHT}
                  ref={this.webcam}
                  screenshotFormat="image/jpeg"
                  videoConstraints={videoConstraints}
                />
              </div>
            ) : null}
            {!!fullDesc ? (
              <DrawBox
                fullDesc={fullDesc}
                faceMatcher={faceMatcher}
                imageWidth={WIDTH}
                boxColor={'blue'}
              />
            ) : null}
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(CameraFaceDetect);

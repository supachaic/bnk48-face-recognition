import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import {
  getFullFaceDescription,
  createMatcher,
  isFaceDetectionModelLoaded
} from '../api/face';
import DrawBox from './drawBox';
import ShowDescriptors from './showDescriptors';

const MaxWidth = 600;
const bnk48JSON = require('../descriptors/bnk48.json');
const boxColor = '#BE80B5';
const testImg = '/img/test.jpg';

const INIT_STATE = {
  url: null,
  imageURL: null,
  fullDesc: null,
  imageDimension: null,
  error: null,
  loading: false
};

class FaceRecognition extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ...INIT_STATE,
      faceMatcher: null,
      showDescriptors: false,
      WIDTH: null,
      isModelLoaded: !!isFaceDetectionModelLoaded()
    };
  }

  componentWillMount() {
    console.log('component will mount');
    this.resetState();
    let _W = document.documentElement.clientWidth;
    if (_W > MaxWidth) _W = MaxWidth;
    this.setState({ WIDTH: _W });
    this.matcher();
    this.setState({ imageURL: testImg, loading: true });
    this.handleImageChange(testImg);
  }

  matcher = async () => {
    const faceMatcher = await createMatcher(bnk48JSON);
    this.setState({ faceMatcher });
  };

  handleFileChange = async event => {
    this.resetState();
    await this.setState({
      imageURL: URL.createObjectURL(event.target.files[0]),
      loading: true
    });
    this.handleImageChange();
  };

  handleURLChange = event => {
    this.setState({ url: event.target.value });
  };

  handleButtonClick = async () => {
    this.resetState();
    let blob = await fetch(this.state.url)
      .then(r => r.blob())
      .catch(error => this.setState({ error }));
    if (!!blob && blob.type.includes('image')) {
      this.setState({
        imageURL: URL.createObjectURL(blob),
        loading: true
      });
      this.handleImageChange();
    }
  };

  handleImageChange = async (image = this.state.imageURL) => {
    await getFullFaceDescription(image).then(fullDesc => {
      this.setState({ fullDesc, loading: false });
    });
    this.getImageDimension(image);
  };

  getImageDimension = imageURL => {
    let img = new Image();
    img.onload = () => {
      this.setState({
        imageDimension: {
          width: img.width,
          height: img.height
        }
      });
    };
    img.src = imageURL;
  };

  handleDescriptorsCheck = event => {
    this.setState({ showDescriptors: event.target.checked });
  };

  resetState = () => {
    this.setState({ ...INIT_STATE });
  };
  render() {
    const {
      WIDTH,
      imageURL,
      fullDesc,
      faceMatcher,
      showDescriptors,
      imageDimension,
      isModelLoaded,
      error,
      loading
    } = this.state;

    // Set display image Height after resize
    let HEIGHT = 0;
    if (!!imageDimension) {
      HEIGHT = (WIDTH * imageDimension.height) / imageDimension.width;
    }

    // Display working status
    let status = <p>Status: Model Loaded = {isModelLoaded.toString()}</p>;
    if (!!error && error.toString() === 'TypeError: Failed to fetch') {
      status = (
        <p style={{ color: 'red' }}>Status: Error Failed to fetch Image URL</p>
      );
    } else if (loading) {
      status = <p style={{ color: 'blue' }}>Status: LOADING...</p>;
    } else if (!!fullDesc && !!imageURL && !loading) {
      if (fullDesc.length < 2)
        status = <p>Status: {fullDesc.length} Face Detect</p>;
      if (fullDesc.length > 1)
        status = <p>Status: {fullDesc.length} Faces Detect</p>;
    }

    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}
      >
        {status}
        <div
          style={{
            width: WIDTH,
            height: HEIGHT
          }}
        >
          {!!imageURL ? (
            <div
              style={{
                position: 'relative'
              }}
            >
              <div style={{ position: 'absolute' }}>
                <img style={{ width: WIDTH }} src={imageURL} alt="imageURL" />
              </div>
              {!!fullDesc ? (
                <DrawBox
                  fullDesc={fullDesc}
                  faceMatcher={faceMatcher}
                  imageWidth={WIDTH}
                  boxColor={boxColor}
                />
              ) : null}
            </div>
          ) : null}
        </div>
        <div
          style={{
            width: WIDTH,
            padding: 10,
            border: 'solid',
            marginTop: 10
          }}
        >
          <p>Input Image file or URL</p>
          <input
            id="myFileUpload"
            type="file"
            onChange={this.handleFileChange}
            accept=".jpg, .jpeg, .png"
          />
          <br />
          <div className="URLInput">
            <input
              type="url"
              name="url"
              id="url"
              placeholder="Place your photo URL here (only .jpg, .jpeg, .png)"
              pattern="https://.*"
              size="30"
              onChange={this.handleURLChange}
            />
            <button onClick={this.handleButtonClick}>Upload</button>
          </div>
          <div>
            <input
              name="descriptors"
              type="checkbox"
              checked={this.state.showDescriptors}
              onChange={this.handleDescriptorsCheck}
            />
            <label>Show Descriptions</label>
          </div>
          {!!showDescriptors ? <ShowDescriptors fullDesc={fullDesc} /> : null}
        </div>
      </div>
    );
  }
}

export default withRouter(FaceRecognition);

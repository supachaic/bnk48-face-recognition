import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import {
  getFullFaceDescription,
  createMatcher,
  isFaceDetectionModelLoaded
} from '../api/face';
import DrawBox from './drawBox';
import ShowDescriptors from './showDescriptors';

const MaxWidth = 800;
const bnk48JSON = require('../descriptors/bnk48.json');
const boxColor = '#BE80B5';

class FaceRecognition extends Component {
  constructor(props) {
    super(props);
    this.state = {
      url: null,
      imageURL: null,
      fullDesc: null,
      faceMatcher: null,
      showDescriptors: false,
      imageDimension: null,
      WIDTH: null,
      modelLoaded: !!isFaceDetectionModelLoaded()
    };
  }

  componentWillMount() {
    let _W = document.documentElement.clientWidth;
    if (_W > MaxWidth) _W = MaxWidth;
    this.setState({ WIDTH: _W });
    this.matcher();
  }

  matcher = async () => {
    const faceMatcher = await createMatcher(bnk48JSON);
    this.setState({ faceMatcher });
  };

  handleFileChange = async event => {
    await this.setState({
      imageURL: URL.createObjectURL(event.target.files[0])
    });
    this.handleImageChange();
  };

  handleURLChange = event => {
    this.setState({ url: event.target.value });
  };

  handleButtonClick = async () => {
    let blob = await fetch(this.state.url).then(r => r.blob());
    if (blob.type.includes('image')) {
      this.setState({
        imageURL: URL.createObjectURL(blob)
      });
      this.handleImageChange();
    }
  };

  handleImageChange = async (image = this.state.imageURL) => {
    await this.setState({
      fullDesc: getFullFaceDescription(image)
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

  render() {
    const {
      WIDTH,
      imageURL,
      fullDesc,
      faceMatcher,
      showDescriptors,
      imageDimension
    } = this.state;

    let HEIGHT = 0;
    if (!!imageDimension) {
      HEIGHT = (WIDTH * imageDimension.height) / imageDimension.width;
    }

    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}
      >
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

        <div>
          <p>Test image here</p>
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
              size="50"
              onChange={this.handleURLChange}
            />
            <button onClick={this.handleButtonClick}>Upload</button>
          </div>
          <p>{!!fullDesc ? fullDesc.toString() : 'no desc'}</p>
          <div>
            <input
              name="descriptors"
              type="checkbox"
              checked={this.state.showDescriptors}
              onChange={this.handleDescriptorsCheck}
            />
            <label>Show Descriptors</label>
          </div>
          {!!showDescriptors ? <ShowDescriptors fullDesc={fullDesc} /> : null}
        </div>
      </div>
    );
  }
}

export default withRouter(FaceRecognition);

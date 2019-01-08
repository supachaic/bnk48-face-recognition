# BNK48 Facial Recognition Web App

Single Page App for face detection and recognition of BNK48 idol group, running in front-end browser using React and [face-api.js](https://github.com/justadudewhohacks/face-api.js) (without back-end)

![example-image](https://raw.githubusercontent.com/supachaic/bnk48-face-recognition/master/src/img/example.jpg)

## Demo

**[Check out the Demo in Github Page](https://supachaic.github.io/bnk48-face-recognition/)**

## How to Run App in localhost

Clone the repository:

```bash
git clone https://github.com/supachaic/bnk48-face-recognition.git
```

In the project directory, you can run:

```bash
cd bnk48-face-recognition
npm i
npm start
```

This will run app in development mode.
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## How to create descriptors profile

This App uses descriptors profile of known faces (facial feature vector of 128 array of number) stored in JSON format as reference for face recognition. The sample profile of BNK48 current members (as of December 2018) is located in folder `src/descriptors/bnk48.json`

### JSON Profile

The JSON profile contains members' nickname and array of 5-10 facial feature vector generate per member from sample photos. We don't store sample photos in the app to save processing time and optimize application size. You can create new descriptor (feature vector) by uploading photo to the app and check `Show Descriptors` to see the descriptor. If there're multiple faces detected in one photo, app will show all descriptors.

JSON File Format:

```text
{
  "MEMBER_1": {
    "name": "nickname",
    "descriptors": [
      [FEATURE_VECTOR],[FEATURE_VECTOR],...
    ]
  },
  "MEMBER_2": {
    "name": "nickname",
    "descriptors": [
      [FEATURE_VECTOR],[FEATURE_VECTOR],...
    ]
  },
  ...
}
```

Note:

- `MEMBER_1`, `MEMBER_2` are object keys to be referred by the App
- `nickname` will be displayed when app recognizes the face
- `FEATURE_VECTOR` is array of 128 number facial feature known as `descriptor` in face-api.js

### Create new profile

You can create new JSON profile of your own and register to the App by editing file name in `/src/common/profile.js`

```javascript
export const JSON_PROFILE = require('../descriptors/bnk48.json');

// change to
export const JSON_PROFILE = require('../descriptors/YOUR_PROFILE.json');

```

In this project, with 5-10 feature vector per member for 30-40 members of BNK48 idol group, JSON profile sizes around 1MB before compress, which is good enough for experiment and store in Single Page App. However, if you're going to run facial recoginition for hundreds or thousands people, storing a huge JSON file for reference will not be practical. In this case, you can use front-end web app only to do face-detection and let your back-end (Node.js) to handle face-recoginition. If that the case, I recommend to check [face-api.js](https://github.com/justadudewhohacks/face-api.js) for more detail.

## How to Deploy App to Github Pages

Since we don't need back-end in this project, so any static hosting platform would be sufficient for our small app. To deploy React app on Github Pages will require some trick. Make sure you have all this setting then you will be fine. (if you are not going to use Github Pages, this setup would not be necessary)

Step 1 - You need to have Github account and create new repository. Then you copy the new reposity git URL.

```bash
https://github.com/YOUR_GITHUB_ACCOUNT/YOUR-APP-NAME.git
```

Step 2 - App.js : make sure you have `basename: process.env.PUBLIC_URL` in `Router` component

```javascript
import React, { Component } from 'react';
import { Route, Router } from 'react-router-dom';
import createHistory from 'history/createBrowserHistory';
//... the rest of code

class App extends Component {
  render() {
    return (
      <div className="App">
        <Router history={createHistory({ basename: process.env.PUBLIC_URL })}>
          // Your code
        </Router>
      </div>
    );
  }
}

export default App;
```

Step 3 - install gh-pages

```bash
npm i gh-pages
```

Step 4.1 - package.json : add your `homepage`

```json
"homepage": "http://YOUR_GITHUB_ACCOUNT.github.io/YOUR-APP-NAME"
```

Step 4.2 - package.json : add `predeploy` and `deploy` under `scripts` as below.

```json
"scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject",
    "predeploy": "npm run build",
    "deploy": "gh-pages -d build"
  }
```

Step 5 - commit and update your git and run deploy

```bash
git add .
git commit -am "make something good"
git remote add origin https://github.com/YOUR_GITHUB_ACCOUNT/react-face-recognition.git
git push -u origin master

npm run deploy
```

This should push your code to github and deploy to your github page under `homepage` URL

Note: if you're not going to use Github Pages, you don't have to install gh-pages. (just remove it from package.json file before `npm install`)

## Somethings about face-api.js in this App

This project uses face-api.js for face-detection and face-recognition. The library comes with pre-trained face-detection models, SSD Mobilenet V1, Tiny Face Detector, and MTCNN. The default model is SSD Mobilenet V1, but I choose to use only Tiny Face Detector for its smaller size of weight.

The model weights are located in `public/models`. And the model functions are in `src/api/face.js`.

API start with function `loadModels` to loading models for face-detection, face-landmarks, and face-recognition with tiny face option.

```javascript
async function loadModels() {
  const MODEL_URL = process.env.PUBLIC_URL + '/models';
  await faceapi.loadTinyFaceDetectorModel(MODEL_URL);
  await faceapi.loadFaceLandmarkTinyModel(MODEL_URL);
  await faceapi.loadFaceRecognitionModel(MODEL_URL);
}
```

If you want to use SSD Mobilenet or MTCNN, you need to load new weight to `public/models`. You can find all of the weights in [face-api.js](https://github.com/justadudewhohacks/face-api.js) repo. And follow this [instruction](https://github.com/justadudewhohacks/face-api.js/blob/master/README.md#usage-loading-models) to load the correct model for your task.

Function `getFullFaceDescription` will accept image blob and return with full description (`Detection`, `Landmarks`, and `Descriptor`) of all faces detected in the image. I use Box information from `Detection` to draw face box. And use `Descriptor` to input in `faceMatcher` to find best match. (`Landmarks` are not used in this project)

```javascript
export async function getFullFaceDescription(blob, inputSize = 512) {
  // tiny_face_detector options
  let scoreThreshold = 0.5;
  const OPTION = new faceapi.TinyFaceDetectorOptions({
    inputSize,
    scoreThreshold
  });
  const useTinyModel = true;

  // fetch image to api
  let img = await faceapi.fetchImage(blob);

  // detect all faces and generate full description from image
  // including landmark and descriptor of each face
  let fullDesc = await faceapi
    .detectAllFaces(img, OPTION)
    .withFaceLandmarks(useTinyModel)
    .withFaceDescriptors();
  return fullDesc;
}
```

Function `createMatcher` accept `faceProfile` from `src/descriptors/bnk48.json` as JSON object to create `labeledDescriptors` of all members with their name and Descriptors arrays. The function then return `faceMatcher` with all labeled descriptors and display name. The maximum descriptor distance is set to 0.5 for more precise face recognition. (default is 0.6)

```javascript
export async function createMatcher(faceProfile) {
  // Create labeled descriptors of member from profile
  let members = Object.keys(faceProfile);
  let labeledDescriptors = members.map(
    member =>
      new faceapi.LabeledFaceDescriptors(
        faceProfile[member].name,
        faceProfile[member].descriptors.map(
          descriptor => new Float32Array(descriptor)
        )
      )
  );

  // Create face matcher (maximum descriptor distance is 0.5)
  let faceMatcher = new faceapi.FaceMatcher(
    labeledDescriptors,
    maxDescriptorDistance
  );
  return faceMatcher;
}

export function isFaceDetectionModelLoaded() {
  return !!faceapi.nets.tinyFaceDetector.params;
}
```

`faceMatcher` will be used in Component `DrawBox` to find best match if any face detected in the image.
File `src/components/drawBox.js`

```javascript
// if face detectec and found descriptors
match = await descriptors.map(descriptor => faceMatcher.findBestMatch(descriptor)
```

## License

MIT

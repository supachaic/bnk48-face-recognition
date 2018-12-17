import * as faceapi from 'face-api.js';

const MODEL_URL = 'https://supachaic.github.io/bnk48-face-recognition/models';
// tiny_face_detector options
const useTinyModel = true;

const maxDescriptorDistance = 0.5;

async function loadModels() {
  await faceapi.loadTinyFaceDetectorModel(MODEL_URL);
  await faceapi.loadFaceLandmarkTinyModel(MODEL_URL);
  await faceapi.loadFaceRecognitionModel(MODEL_URL);
}

loadModels();
let inputSize = 512;
let scoreThreshold = 0.5;
const OPTION = new faceapi.TinyFaceDetectorOptions({
  inputSize,
  scoreThreshold
});

export async function getFullFaceDescription(blob) {
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
  let result = faceapi.nets.tinyFaceDetector.params;
  return result;
}

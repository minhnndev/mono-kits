import { requireNativeComponent, UIManager } from 'react-native';

const FaceDetectNative = requireNativeComponent('RCTFaceDetect');
const { Commands } = UIManager.RCTFaceDetect;

export default FaceDetectNative;
export { Commands };

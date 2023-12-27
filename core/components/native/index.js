import {requireNativeComponent, UIManager, ViewPropTypes} from 'react-native';
import PropTypes from 'prop-types';

const RCTBarCodeProps = {
  name: 'RCTBarCode',
  propTypes: {
    code: PropTypes.string,
    width: PropTypes.number,
    height: PropTypes.number,
    ratio: PropTypes.number,
    ...ViewPropTypes,
  },
};

const QRCodeViewProps = {
  name: 'QRCodeView',
  propTypes: {
    code: PropTypes.string,
    size: PropTypes.number,
    ratio: PropTypes.number,
    showLogo: PropTypes.bool,
    ...ViewPropTypes,
  },
};

export const MomoTextInputCalculator = requireNativeComponent(
  'MomoTextInputCalculator',
);
export const RCTQRCode = requireNativeComponent('RCTQRCode', QRCodeViewProps);
export const RCTBarCode = requireNativeComponent('RCTBarCode', RCTBarCodeProps);
export const FaceDetectNativeView = requireNativeComponent('RCTFaceDetect');
export const FaceDetectProgressNativeView = requireNativeComponent(
  'FaceDetectProgressView',
);
export const RCTFaceConfig = UIManager.getViewManagerConfig('RCTFaceDetect');
export const RCTFaceProgressConfig = UIManager.getViewManagerConfig(
  'FaceDetectProgressView',
);
export const FaceDetectProgressCommands = RCTFaceProgressConfig?.Commands ?? {};
export const FaceDetectCommands = RCTFaceConfig?.Commands ?? {};

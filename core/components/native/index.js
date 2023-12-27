import { requireNativeComponent, UIManager, ViewPropTypes, NativeModules } from 'react-native';
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

export const RCTCodeScannerConfig = UIManager.getViewManagerConfig('RCTCodeScanner');
export const RCTCocosViewConfig = UIManager.getViewManagerConfig('RCTCocosView');
export const RCTFaceConfig = UIManager.getViewManagerConfig('RCTFaceDetect');
export const RCTCodeScannerConstants = RCTCodeScannerConfig.Constants;
export const RCTCodeScannerCommands = RCTCodeScannerConfig.Commands;
export const RCTCocosViewCommands = RCTCocosViewConfig.Commands;
export const FaceDetectCommands = RCTFaceConfig.Commands;
export const RCTCodeScannerView = requireNativeComponent('RCTCodeScanner');
export const MomoTextInputCalculator = requireNativeComponent(
    'MomoTextInputCalculator',
);
export const FaceDetectNativeView = requireNativeComponent('RCTFaceDetect');
export const RCTQRCode = requireNativeComponent('RCTQRCode', QRCodeViewProps);
export const RCTBarCode = requireNativeComponent('RCTBarCode', RCTBarCodeProps);

export const CameraXNativeView = requireNativeComponent("MomoCameraX")
const CameraXConfig = UIManager.getViewManagerConfig("MomoCameraX");
export const CameraXCommands = CameraXConfig.Commands;
export const CameraXConstants = CameraXConfig.Constants;

export const RCTCocosView = requireNativeComponent('RCTCocosView');

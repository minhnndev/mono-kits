import React from 'react';
import PropTypes from 'prop-types';
import {
    findNodeHandle,
    StyleSheet,
    UIManager,
    ViewPropTypes,
    View,
    Platform,
} from 'react-native';
import {
    RCTCodeScannerConstants,
    RCTCodeScannerView,
    RCTCodeScannerCommands,
} from '@momo-kits/core';

const styles = StyleSheet.create({
    container: {
        overflow: 'hidden',
    },
    camera: {
        flex: 1,
    },
});

const EventThrottleMs = 500;

const convertNativeProps = (props) => {
    const QRCodeScannerConstants = {
        BarCodeType: RCTCodeScannerConstants?.BarCodeType,
        Type: RCTCodeScannerConstants?.Type,
        TorchMode: RCTCodeScannerConstants?.TorchMode,
    };

    const newProps = { ...props };

    if (typeof props.type === 'string') {
        newProps.type = QRCodeScannerConstants.Type[props.type];
    }

    if (typeof props.torchMode === 'string') {
        newProps.torchMode = QRCodeScannerConstants.TorchMode[props.torchMode];
    }

    if (props.onBarCodeRead) {
        newProps.barCodeScannerEnabled = true;
    }

    if (Platform.OS === 'android' && newProps.torchMode === 1) {
        newProps.torchMode = 2;
    }

    return newProps;
};

class Camera extends React.Component {
    constructor(props) {
        super(props);
        this.obj = null;
    }

    setRef = (component) => {
        this.ref = component;
        this.obj = findNodeHandle(component);
    };

    readImageQRCode = (base64) => {
        const commandId = RCTCodeScannerCommands?.readImageQRCode;
        if (this.obj != null && commandId != null) {
            UIManager.dispatchViewManagerCommand(this.obj, commandId, [base64]);
        }
    };

    startCamera = () => {
        const commandId = RCTCodeScannerCommands?.startCamera;
        if (this.obj != null && commandId != null) {
            UIManager.dispatchViewManagerCommand(this.obj, commandId, []);
        }
    };

    stopCamera = () => {
        const commandId = RCTCodeScannerCommands?.stopCamera;
        if (this.obj != null && commandId != null) {
            UIManager.dispatchViewManagerCommand(this.obj, commandId, []);
        }
    };

    capture(options) {
        const commandId = RCTCodeScannerCommands?.capture;
        if (this.obj != null && commandId != null) {
            UIManager.dispatchViewManagerCommand(this.obj, commandId, [
                {
                    pauseAfterCapture: false,
                    ...options,
                },
            ]);
        }
    }

    onPressFlash = (torchMode) => {
        this.ref?.setNativeProps({
            torchMode: torchMode ?? 0,
        });
    };

    onBarCodeRead = ({ nativeEvent }) => {
        if (
            this._lastEvent &&
            JSON.stringify(nativeEvent) === this._lastEvent &&
            new Date() - this._lastEventTime < EventThrottleMs
        ) {
            return;
        }
        const { onBarCodeRead } = this.props;
        if (typeof onBarCodeRead === 'function') {
            onBarCodeRead(nativeEvent);
            this._lastEvent = JSON.stringify(nativeEvent);
            this._lastEventTime = new Date();
        }
    };

    onImageCaptured = ({ nativeEvent }) => {
        const { onImageCaptured } = this.props;
        if (typeof onImageCaptured === 'function') {
            onImageCaptured(nativeEvent);
        }
    };

    render() {
        const { customFinder, style } = this.props;
        const nativeProps = convertNativeProps(this.props);

        return (
            <View style={[styles.container, style]}>
                <RCTCodeScannerView
                    {...nativeProps}
                    style={styles.camera}
                    ref={this.setRef}
                    onBarCodeRead={this.onBarCodeRead}
                    onImageCaptured={this.onImageCaptured}
                />
                <View style={StyleSheet.absoluteFill}>
                    {customFinder && customFinder()}
                </View>
            </View>
        );
    }
}

Camera.propTypes = {
    ...ViewPropTypes,
    ratio: PropTypes.string,
    focusDepth: PropTypes.number,
    onBarCodeRead: PropTypes.func,
    onImageCaptured: PropTypes.func,
    barCodeTypes: PropTypes.arrayOf(PropTypes.string),
    type: PropTypes.oneOf(['front', 'back']),
    torchMode: PropTypes.oneOf(['on', 'off', 'auto', 'torch']),
    useCamera2Api: PropTypes.bool,
};

Camera.defaultProps = {
    type: 'back',
    ratio: '4:3',
    torchMode: 'off',
    barCodeTypes: Object.values(RCTCodeScannerConstants?.BarCodeType ?? {}),
    useCamera2Api: false,
};

export default Camera;

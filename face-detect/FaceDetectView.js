import React, { useCallback, useImperativeHandle, useRef } from 'react';
import { UIManager, findNodeHandle, Platform } from 'react-native';
import {
    FaceDetectNativeView,
    FaceDetectCommands as Commands,
} from '@momo-kits/core';

function FaceDetect(
    { style, angles, onStepUpdate, onReady, onChangeFaceStatus },
    ref,
) {
    const viewIdRef = useRef();
    const commands = Platform.select({
        ios: Commands.start,
        android: Commands.start.toString(),
    });
    const faceRef = useCallback((_ref) => {
        if (_ref) {
            viewIdRef.current = findNodeHandle(_ref);
        } else {
            viewIdRef.current = null;
        }
    }, []);

    useImperativeHandle(
        ref,
        () => ({
            start: (...args) => {
                UIManager.dispatchViewManagerCommand(
                    viewIdRef.current,
                    commands,
                    args,
                );
            },
        }),
        [],
    );

    return (
        <FaceDetectNativeView
            ref={faceRef}
            style={style}
            onStepUpdate={onStepUpdate}
            onReady={onReady}
            onChangeFaceStatus={onChangeFaceStatus}
            angles={angles}
        />
    );
}

export default React.forwardRef(FaceDetect);

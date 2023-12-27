import React, { forwardRef, useRef, useImperativeHandle } from 'react';
import { StyleSheet, NativeModules, Platform } from 'react-native';
import Modal from './Modal';
import SlideAnimation from './animations/SlideAnimation';

const isAndroid = Platform.OS === 'android';

const styles = StyleSheet.create({
    container: {
        justifyContent: 'flex-end',
    },
    modal: {
        borderBottomRightRadius: 0,
        borderBottomLeftRadius: 0,
    },
});

const BottomModal = ({
    style,
    modalStyle,
    ...restProps
}, ref) => {
    const navigatorRef = useRef(null);
    const isLowPerformance = NativeModules?.RNDeviceInfo?.devicePerformance === 'low-end';

    useImperativeHandle(ref, () => navigatorRef.current);

    return (
        <Modal
            ref={ref}
            modalAnimation={isLowPerformance && isAndroid ? undefined : new SlideAnimation({
                slideFrom: 'bottom',
            })}
            {...restProps}
            style={StyleSheet.flatten([styles.container, style])}
            modalStyle={StyleSheet.flatten([styles.modal, modalStyle])}
            width={1}
            swipeDirection="down"
        />
    );
};

export default forwardRef(BottomModal);

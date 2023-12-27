
import React, { Component } from 'react';
import { StyleSheet, TouchableOpacity, Animated, NativeModules, Platform } from 'react-native';

const isAndroid = Platform.OS === 'android';

export default class Backdrop extends Component {
    componentDidUpdate(prevProps) {
        const {
            visible,
            useNativeDriver,
            opacity,
            animationDuration: duration,
        } = this.props;
        const isLowPerformance = NativeModules?.RNDeviceInfo?.devicePerformance === 'low-end';

        if (prevProps.visible !== visible) {
            const toValue = visible ? opacity : 0;
            Animated.timing(this.opacity, {
                toValue,
                duration,
                useNativeDriver,
                delay: visible ? isLowPerformance && isAndroid ? 0 : 200 : 0
            }).start();
        }
    }

    setOpacity = (value) => {
        this.opacity.setValue(value);
    }

    opacity = new Animated.Value(0)

    render() {
        const { onPress, pointerEvents, backgroundColor } = this.props;
        const { opacity } = this;
        return (
            <Animated.View
                pointerEvents={pointerEvents}
                style={StyleSheet.flatten([StyleSheet.absoluteFill, {
                    backgroundColor,
                    opacity,
                }])}
            >
                <TouchableOpacity
                    onPress={onPress}
                    style={StyleSheet.absoluteFill}
                />
            </Animated.View>
        );
    }
}

Backdrop.defaultProps = {
    backgroundColor: '#000',
    opacity: 0.5,
    animationDuration: 2000,
    visible: false,
    useNativeDriver: true,
    onPress: () => { },
};

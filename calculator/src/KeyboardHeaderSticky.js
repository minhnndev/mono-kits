import PropTypes from 'prop-types';
import React, { Component } from 'react';
import {
    StyleSheet, Animated, Easing, View, Platform, Keyboard
} from 'react-native';
import { ScreenUtils } from '@momo-kits/core';

const { ifIphoneX } = ScreenUtils;

const styles = StyleSheet.create({
    container: {
        left: 0,
        right: 0,
        backgroundColor: '#dadadb'
    }
});

export default class KeyboardHeaderSticky extends Component {
    constructor(props) {
        super(props);
        this.animated = new Animated.Value(0);
        this.nativeKeyboardHeight = 0;
    }

    componentDidMount() {
        this.keyboardWillShowListener = Keyboard.addListener('keyboardWillShow', this.keyboardWillShow);
        this.keyboardWillHideListener = Keyboard.addListener('keyboardWillHide', this.keyboardWillHide);
    }

    keyboardWillShow = (e) => {
        this.nativeKeyboardHeight = e.endCoordinates.height;
        this.openHeaderAnimation();
        this.forceUpdate();
    }

    keyboardWillHide = () => {
        this.closeHeaderAnimation();
    }

    openHeaderAnimation = () => {
        const { duration } = this.props;
        Animated.timing(this.animated, {
            duration,
            toValue: 100,
            easing: Easing.ease,
            useNativeDriver: true
        }).start();
    }

    closeHeaderAnimation = () => {
        const { duration } = this.props;
        Animated.timing(this.animated, {
            duration,
            toValue: 0,
            easing: Easing.ease,
            useNativeDriver: true
        }).start();
    }

    componentWillUnmount() {
        if (this.keyboardWillShowListener) this.keyboardWillShowListener.remove();
        if (this.keyboardWillHideListener) this.keyboardWillHideListener.remove();
    }

    onLayout = ({ nativeEvent }) => {
        this.childrenHeight = nativeEvent.layout.height;
    }

    render() {
        const {
            children, style, bottomOffset, useKeyboardAvoidView
        } = this.props;
        const currentKeyboardHeight = this.nativeKeyboardHeight;
        const bottom = this.animated.interpolate({
            inputRange: [0, 100],
            outputRange: [ifIphoneX(bottomOffset, 0), useKeyboardAvoidView ? ifIphoneX(88, 64) : (currentKeyboardHeight)]
        });

        return (
            <Animated.View style={[styles.container, { bottom, position: useKeyboardAvoidView ? 'relative' : 'absolute' }]}>
                <View style={style}>
                    {children}
                </View>
            </Animated.View>
        );
    }
}

KeyboardHeaderSticky.propTypes = {
    duration: PropTypes.any,
    style: PropTypes.any,
    bottomOffset: PropTypes.number,
    useKeyboardAvoidView: PropTypes.bool
};

KeyboardHeaderSticky.defaultProps = {
    duration: Platform.OS === 'android' ? 200 : 250,
    bottomOffset: 34
};

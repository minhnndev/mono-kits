import React, {
    useEffect, useMemo
} from 'react';
import { Animated, Easing } from 'react-native';
import { G } from 'react-native-svg';

// const { G } = RNSvg;

const AnimatedG = Animated.createAnimatedComponent(G);

const flattenStyle = (style) => {
    if (style === null || typeof style !== 'object') {
        return undefined;
    }

    if (!Array.isArray(style)) {
        return style;
    }

    const result = {};
    for (let i = 0, styleLength = style.length; i < styleLength; ++i) {
        const computedStyle = flattenStyle(style[i]);
        if (computedStyle) {
            computedStyle.forEach((key) => result[key] = computedStyle[key]);
        }
    }
    return result;
};

const TouchableOpacityG = (props = {}) => {
    const {
        disabled,
        onPressIn,
        onPressOut,
        onPress,
        onLongPress,
        activeOpacity = 0.2,
        style,
        children
    } = props;

    const _getChildStyleOpacityWithDefault = () => {
        const childStyle = flattenStyle(style) || {};
        return childStyle.opacity == null ? 1 : childStyle.opacity;
    };

    const anim = useMemo(() => new Animated.Value(_getChildStyleOpacityWithDefault()), []);
    useEffect(() => {
        _opacityInactive(250);
    }, [disabled]);

    /**
     * Animate the touchable to a new opacity.
     */
    const setOpacityTo = (value, duration) => {
        Animated.timing(anim, {
            toValue: value,
            duration,
            easing: Easing.inOut(Easing.quad),
            useNativeDriver: true,
        }).start();
    };

    const touchableHandleActivePressIn = (e) => {
        if (e.dispatchConfig.registrationName === 'onResponderGrant') {
            _opacityActive(0);
        } else {
            _opacityActive(150);
        }
        onPressIn?.(e);
    };

    const touchableHandleActivePressOut = (e) => {
        _opacityInactive(250);
        onPressOut?.(e);
    };

    const touchableHandlePress = (e) => {
        onPress?.(e);
    };

    const touchableHandleLongPress = (e) => {
        onLongPress?.(e);
    };

    const _opacityActive = (duration) => {
        setOpacityTo(activeOpacity, duration);
    };

    const _opacityInactive = (duration) => {
        setOpacityTo(_getChildStyleOpacityWithDefault(), duration);
    };

    return (
        <AnimatedG
            opacity={anim}
            onPress={touchableHandlePress}
            onLongPress={touchableHandleLongPress}
            onPressIn={touchableHandleActivePressIn}
            onPressOut={touchableHandleActivePressOut}
        >
            {children}
        </AnimatedG>
    );
};

export default TouchableOpacityG;

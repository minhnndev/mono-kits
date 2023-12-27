import React from 'react';
import {
    View, Dimensions, StyleSheet, Platform, Animated
} from 'react-native';

const { width } = Dimensions.get('window');

const LEFT = 'left';

const styles = StyleSheet.create({
    right: { position: 'absolute', right: 0 },
    left: { position: 'absolute', left: 0 },
    title: Platform.select({
        ios: {
            fontSize: 17,
            fontWeight: '600',
            alignSelf: 'center',
        },
        android: {
            fontSize: 20,
            fontFamily: 'sans-serif-medium',
            fontWeight: 'normal',
            alignSelf: 'center',
        },
        default: {
            fontSize: 18,
            fontWeight: '500',
            alignSelf: 'center',
        },
    }),
});

const animatedType = ({ distance, offsetY, tintColor }) => {
    const fadeAnim = new Animated.Value(offsetY);
    const inputRange = Array.isArray(distance) ? distance : [0, distance || width / 2];
    return {
        up: fadeAnim.interpolate({
            inputRange,
            outputRange: [1, 0],
            extrapolate: 'clamp',
        }),
        down: fadeAnim.interpolate({
            inputRange,
            outputRange: [0, 1],
            extrapolate: 'clamp',
        }),
        color: fadeAnim.interpolate({
            inputRange,
            outputRange: tintColor || ['#fff', '#000'],
            extrapolate: 'clamp',
        })
    };
};

const ViewDirection = ({ position }) => <View pointerEvents="box-none" style={position === LEFT ? { marginLeft: 20 } : { marginRight: 20 }} />;

const BackgroundView = ({ headerStyle }) => <View pointerEvents="box-none" style={[{ flex: 1, }, headerStyle]} />;

const headerAnimatedPosition = (position, props) => {
    const {
        offsetY, tintColor, direction, defaultOptions, distanceVisible, isShowRight, isShowLeft
    } = props;
    const { headerRight, headerLeft } = defaultOptions;
    const Right = headerRight || ViewDirection;
    const Left = headerLeft || ViewDirection;
    const isAnimated = position === LEFT ? isShowLeft : isShowRight;
    const distance = position === LEFT ? distanceVisible?.left : distanceVisible?.right;
    const style = position === LEFT ? styles.left : styles.right;
    const CompAnimation = position === LEFT ? Left : Right;
    const opacity = isAnimated ? 1 : animatedType({ distance, offsetY })[direction];
    const colorAnimation = tintColor ? animatedType({ distance: distanceVisible?.color, tintColor, offsetY }).color : null;
    return (
        <Animated.View style={[style, { opacity }]}>
            <CompAnimation color={colorAnimation} position={position} />
        </Animated.View>
    );
};

const headerAnimatedTitle = (props) => {
    const {
        offsetY, tintColor, direction, defaultOptions, distanceVisible, isShowTitle
    } = props;
    const {
        title = '', headerTintColor = '', headerTitleAlign = '', headerTitleStyle = {}
    } = defaultOptions;
    const opacity = isShowTitle ? 1 : animatedType({ distance: distanceVisible?.title, offsetY })[direction];
    const colorAnimation = tintColor ? animatedType({ distance: distanceVisible?.color, tintColor, offsetY }).color : null;
    return (
        <Animated.Text
            numberOfLines={1}
            style={[styles.title, {
                color: colorAnimation || headerTintColor || '#ffffff', textAlign: headerTitleAlign || 'center'
            }, headerTitleStyle, { opacity }]}
        >
            {title}
        </Animated.Text>

    );
};

const headerAnimatedBackground = (props) => {
    const {
        offsetY, direction, defaultOptions, distanceVisible
    } = props;
    const {
        headerBackground, headerStyle = {}
    } = defaultOptions;
    const Background = headerBackground || BackgroundView;
    const opacity = animatedType({ distance: distanceVisible?.background, offsetY })[direction];
    return (
        <Animated.View pointerEvents="box-none" style={{ ...StyleSheet.absoluteFillObject, opacity }}>
            <Background headerStyle={headerStyle} />
        </Animated.View>

    );
};

module.exports = {
    headerAnimatedPosition,
    headerAnimatedBackground,
    headerAnimatedTitle
};

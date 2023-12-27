import {
    Animated, StyleSheet, View
} from 'react-native';
import React, { memo, useEffect } from 'react';
import PropTypes from 'prop-types';

const START_VALUE = 0.5;
const END_VALUE = 1;
const useNativeDriver = true;
const isInteraction = false;
const MARGIN_DEFAULT = 12;
const BORDER_DEFAULT = 5;
const DURATION_DEFAULT = 500;
const WIDTH_DEFAULT = 100;
const HEIGHT_DEFAULT = 15;
const SIZE_DEFAULT = 50;
const PRIMARY_COLOR = '#efefef';
const TYPE_SKELETON = {
    line: 'line',
    media: 'media',
    custom: 'custom'
};

const styles = StyleSheet.create({
    line: {
        borderRadius: BORDER_DEFAULT,
        marginBottom: MARGIN_DEFAULT,
        height: HEIGHT_DEFAULT,
        width: WIDTH_DEFAULT,
        backgroundColor: PRIMARY_COLOR
    },
    full: {
        flex: 1
    },
    left: {
        marginRight: MARGIN_DEFAULT
    },
    right: {
        marginLeft: MARGIN_DEFAULT
    },
    row: { flexDirection: 'row', width: '100%' }
});

const useAnimation = ({ duration }) => {
    const animation = new Animated.Value(START_VALUE);
    const startAnimation = () => {
        Animated.sequence([
            Animated.timing(animation, {
                duration,
                isInteraction,
                toValue: END_VALUE,
                useNativeDriver
            }),
            Animated.timing(animation, {
                duration,
                isInteraction,
                toValue: START_VALUE,
                useNativeDriver
            })
        ]).start((e) => {
            if (e.finished) {
                startAnimation();
            }
        });
    };
    useEffect(() => {
        startAnimation();
    }, []);

    return animation;
};
// create a component

const renderLineSkeleton = ({ style, animation }) => (
    <Animated.View style={[styles.line, { opacity: animation }, style]} />
);

const renderMediaSkeleton = ({
    size, isRound, style, animation
}) => (
    <Animated.View style={[{
        opacity: animation,
        height: size,
        width: size,
        borderRadius: isRound ? size / 2 : 3,
        backgroundColor: PRIMARY_COLOR
    }, style]}
    />
);

const renderCustomSkeleton = ({
    left, right, style, children
}) => (
    <View style={[styles.row, style]}>
        {left && <View style={styles.left}>{left}</View>}
        <View style={styles.full}>{children}</View>
        {right && <View style={styles.right}>{right}</View>}
    </View>
);

const Skeleton = ({
    type, children, left, right, style, duration, ...props
}) => {
    const animation = useAnimation({ duration });
    const ObjRender = {
        [TYPE_SKELETON.line]: renderLineSkeleton({ animation, style }),
        [TYPE_SKELETON.media]: renderMediaSkeleton({ animation, style, ...props }),
        [TYPE_SKELETON.custom]: renderCustomSkeleton({
            children, left, right, style
        }),
    };
    if (ObjRender[type]) return ObjRender[type];
    return null;
};

Skeleton.defaultProps = {
    duration: DURATION_DEFAULT,
    type: TYPE_SKELETON.line,
    size: SIZE_DEFAULT,
    style: {},
    isRound: true,
    right: null,
    left: null,
};

Skeleton.propTypes = {
    style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
    type: PropTypes.oneOf([TYPE_SKELETON.line, TYPE_SKELETON.media, TYPE_SKELETON.custom]),
    size: PropTypes.number,
    isRound: PropTypes.bool,
    duration: PropTypes.number,
    right: PropTypes.node,
    left: PropTypes.node,
};

export default memo(Skeleton);

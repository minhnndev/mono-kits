// Flex is basic View/ScrollView with auto children style

import React from 'react';
import {
    View, ScrollView, KeyboardAvoidingView, StyleSheet, Platform, Keyboard, Dimensions, Animated
} from 'react-native';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import { SafeAreaConsumer } from 'react-native-safe-area-context';
import Gradient from 'react-native-linear-gradient';
import { isIphoneX } from '../../../utils/ScreenUtils';
import { utils, imgs } from '../../navigation/assets';

import FastImage from '../../image/FastImage';

const { getDefaultHeaderHeight, PADDING_IMAGE_BACKGROUND } = utils;
const AnimatedImage = Animated.createAnimatedComponent(FastImage);
const AnimatedGradient = Animated.createAnimatedComponent(Gradient);

const mergeStyle = (style) => (Array.isArray(style) ? style.reduce((obj, item) => obj = { ...obj, ...item }, {}) : style);

const { width } = Dimensions.get('window');

const headerHeight = getDefaultHeaderHeight();

export const Orientation = {
    vertical: 'column',
    horizontal: 'row'
};

const styles = StyleSheet.create({
    image: {
        height: 146,
        position: 'absolute',
        top: 0,
        width,
    },
    flex: {
        flex: 1,
    }
});

export default class Flex extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            bottom: 0
        };
    }

    componentDidMount() {
        if (Platform.OS === 'android') {
            this._subscriptions = [
                Keyboard.addListener('keyboardDidHide', this._onKeyboardChange),
                Keyboard.addListener('keyboardDidShow', this._onKeyboardChange),
            ];
        }
    }

    componentWillUnmount() {
        this._subscriptions && this._subscriptions.forEach((subscription) => {
            subscription.remove();
        });
    }

    _onKeyboardChange = (event) => {
        const { bottom } = this.state;
        const { endCoordinates } = event;
        const { keyboardType, height } = endCoordinates;
        if (keyboardType === 'calculator' && height !== bottom) {
            this.setState({ bottom: height });
        }
    }

    _children = (children, childrenStyle) => React.Children.map(React.Children.toArray(children),
        (child, index) => React.cloneElement(child, { key: index.toString(), style: { ...mergeStyle(child.props.style), ...mergeStyle(childrenStyle) } }));

    renderContent = (headerBackground, insets) => {
        const {
            defaultHeaderColor, blurProps, blur, containerStyle, children, style, scrollable = false, childrenStyle,
            type, keyboardVerticalOffset, headerBackgroundStyle, gradientProps, keyboardAvoidView = true
        } = this.props;
        const { bottom } = this.state;
        const newChildren = this._children(children, childrenStyle);
        const backgroundColor = get(style, 'backgroundColor', 'white');
        const flexDirection = Orientation[type] || Orientation.vertical;
        const newStyle = Array.isArray(style)
            ? [...style, { flexDirection }]
            : (typeof style === 'object' ? { ...style, flexDirection } : { flexDirection });
        const _keyboardVerticalOffset = keyboardVerticalOffset;

        const styleOS = { flex: 1, paddingBottom: !scrollable && isIphoneX() ? 14 : bottom };
        const Container = keyboardAvoidView ? KeyboardAvoidingView : View;
        return (
            <Container
                style={[styles.flex, {}]}
                behavior={Platform.OS === 'ios' ? 'padding' : null}
                keyboardVerticalOffset={_keyboardVerticalOffset}
            >
                <View style={[styleOS, { backgroundColor }, containerStyle]}>
                    {
                        Array.isArray(headerBackground) ? (
                            <AnimatedGradient
                                {...gradientProps}
                                colors={headerBackground}
                                style={[styles.image, { height: headerHeight + insets?.top + PADDING_IMAGE_BACKGROUND }, headerBackgroundStyle]}
                            />
                        ) : headerBackground ? (
                            <AnimatedGradient style={[styles.image, { height: headerHeight + insets?.top + PADDING_IMAGE_BACKGROUND }, headerBackgroundStyle]} colors={defaultHeaderColor || ['#b0006d', '#f67b9a']}>
                                <AnimatedImage
                                    source={typeof headerBackground === 'boolean' ? imgs.bg_header : headerBackground}
                                    style={[styles.image, { height: headerHeight + insets?.top + PADDING_IMAGE_BACKGROUND }, headerBackgroundStyle]}
                                />
                                {
                                    blur && (
                                        <AnimatedGradient
                                            {...blurProps}
                                            style={[styles.image, { height: headerHeight + insets?.top + PADDING_IMAGE_BACKGROUND, zIndex: 999 }, headerBackgroundStyle]}
                                        />
                                    )
                                }
                            </AnimatedGradient>
                        ) : null
                    }

                    {scrollable
                        ? (
                            <ScrollView
                                {...this.props}
                                contentInset={{
                                    top: 0, left: 0, bottom: isIphoneX() ? 14 : bottom, right: 0
                                }}
                                style={newStyle}
                            >
                                {newChildren}
                            </ScrollView>
                        )
                        : (
                            <View {...this.props} style={newStyle}>
                                {newChildren}
                            </View>
                        )}
                </View>
            </Container>
        );
    };

    render() {
        const {
            headerBackground
        } = this.props;
        if (headerBackground) {
            return (
                <SafeAreaConsumer>
                    {(insets) => this.renderContent(headerBackground, insets)}
                </SafeAreaConsumer>
            );
        }
        return this.renderContent();
    }
}

Flex.defaultProps = {
    scrollable: false,
    style: {},
    childrenStyle: {},
    type: 'vertical',
    keyboardVerticalOffset: isIphoneX() ? 74 : Platform.OS === 'ios' ? 64 : 0,
    gradientProps: {},
    blurProps: {},
    blur: false
};

Flex.propTypes = {
    blur: PropTypes.bool,
    blurProps: PropTypes.object,
    scrollable: PropTypes.bool,
    gradientProps: PropTypes.object,
    headerBackground: PropTypes.any,
    headerBackgroundStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
    style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
    containerStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
    childrenStyle: PropTypes.any,
    type: PropTypes.oneOf(['vertical', 'horizontal']),
    keyboardVerticalOffset: PropTypes.number,
    keyboardAvoidView: PropTypes.bool,
    defaultHeaderColor: PropTypes.any
};

// newStyle = Array.isArray(style)
//     ? [...style, { flexDirection }]
//     : (typeof style === 'object' ? { ...style, flexDirection } : { flexDirection });
// if (Array.isArray(children)) {
//     // clone all children with childrenStyle
//     for (let index = 0; index < children.length; index += 1) {
//         children[index] && newChildren.push(React.cloneElement(children[index], { key: index, style: { ...children[index].props.style, ...childrenStyle } }));
//     }
// } else if (children) {
//     // just have one children
//     newChildren = children;
// }

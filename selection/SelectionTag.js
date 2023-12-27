import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { View, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Colors, Text, ValueUtil } from '@momo-kits/core';

const backgroundType = StyleSheet.create({
    primary: {
        backgroundColor: Colors.primary,
    },
    outline: {
        backgroundColor: Colors.black_01,
        borderWidth: 1,
        borderColor: Colors.primary,
    },
    default: {
        backgroundColor: Colors.black_03,
    },
});

const textType = StyleSheet.create({
    primary: {
        color: Colors.black_01,
    },
    outline: {
        color: Colors.primary,
    },
    default: {
        color: Colors.black_17,
    },
});

const styles = StyleSheet.create({
    tag: {
        borderRadius: 13,
        height: 24,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 4,
        flexDirection: 'row',
    },
    text: {
        // fontSize: 12,
        lineHeight: 16,
    },
    icon: {
        width: 12,
        height: 12,
        tintColor: Colors.black_17,
    },
    leftIconMargin: {
        marginRight: 2,
    },
    rightIconMargin: {
        marginLeft: 2,
    },
});

export default class SelectionTag extends Component {
    constructor(props) {
        super(props);
        this.state = {
            maxWidth: null,
        };
    }

    onPress = () => {
        const { onPress } = this.props;
        if (typeof onPress === 'function') onPress();
    };

    calculateWidth = (e) => {
        const { leftIcon, rightIcon } = this.props;
        let textWidth = e.nativeEvent.layout.width + 12 * 2;
        if (leftIcon) textWidth += 8;
        if (rightIcon) textWidth += 8;
        this.setState({ maxWidth: textWidth });
    };

    mapType = (type) => backgroundType[type] || backgroundType.default;

    mapTextStyle = (type) => textType[type] || textType.default;

    render() {
        const { maxWidth } = this.state;
        const {
            title,
            leftIcon,
            rightIcon,
            style,
            titleStyle,
            type,
            fontWeight,
            iconStyle,
        } = this.props;
        const leftIconSource = ValueUtil.getImageSource(leftIcon);
        const rightIconSource = ValueUtil.getImageSource(rightIcon);

        const mapTypeStyle = this.mapType(type);
        const mapTextStyle = this.mapTextStyle(type);

        return (
            <TouchableOpacity
                activeOpacity={0.5}
                onPress={this.onPress}
                style={[
                    styles.tag,
                    mapTypeStyle,
                    maxWidth ? { width: maxWidth } : {},
                    ValueUtil.extractStyle(style),
                ]}>
                {leftIcon ? (
                    <Image
                        source={leftIconSource}
                        style={[iconStyle, styles.icon, styles.leftIconMargin]}
                    />
                ) : (
                    <View />
                )}
                <Text.SubTitle
                    style={[
                        styles.text,
                        mapTextStyle,
                        ValueUtil.extractStyle(titleStyle),
                    ]}
                    onLayout={this.calculateWidth}
                    weight={fontWeight}>
                    {title}
                </Text.SubTitle>
                {rightIcon ? (
                    <Image
                        source={rightIconSource}
                        style={[iconStyle, styles.icon, styles.rightIconMargin]}
                    />
                ) : (
                    <View />
                )}
            </TouchableOpacity>
        );
    }
}

SelectionTag.propTypes = {
    leftIcon: PropTypes.oneOfType([
        PropTypes.shape({ uri: PropTypes.string }),
        PropTypes.number,
        PropTypes.string,
    ]),
    onPress: PropTypes.func,
    rightIcon: PropTypes.oneOfType([
        PropTypes.shape({ uri: PropTypes.string }),
        PropTypes.number,
        PropTypes.string,
    ]),
    iconStyle: PropTypes.oneOf([PropTypes.object, PropTypes.array]),
    style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
    title: PropTypes.string,
    type: PropTypes.oneOf(['primary', 'outline', 'default']),
    titleStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
    fontWeight: PropTypes.oneOf(['regular', 'medium', 'bold']),
};

SelectionTag.defaultProps = {
    type: 'default',
    fontWeight: 'regular',
};

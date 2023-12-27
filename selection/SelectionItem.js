/* eslint-disable no-param-reassign */
import React, { Component } from 'react';
import {
    View, StyleSheet, TouchableOpacity
} from 'react-native';
import PropTypes from 'prop-types';
import { get, omit } from 'lodash';
import {
    Image, Colors, ValueUtil, Text
} from '@momo-kits/core';

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        backgroundColor: 'white',
        paddingVertical: 10,
        paddingHorizontal: 15
    },
    leftIcon: {
        width: 20,
        height: 20,
    },
    rightIcon: {
        width: 24,
        height: 24,
        tintColor: Colors.hint,
        right: -6,
    },
    title: {
        // fontSize: 16,
        color: '#222222'
    },
    body: {
        // fontSize: 13,
        color: Colors.hint
    },
    infoView: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        flex: 1,
        alignItems: 'center'
    },
    rightTitle: {
        // fontSize: 15,
        color: 'black',
        marginLeft: 5
    },
    rightButton: {
        backgroundColor: Colors.pale_mauve,
        borderRadius: 16,
        minHeight: 32,
        minWidth: 76,
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 5
    },
    rightButtonTitle: {
        // fontSize: 16,
        fontWeight: 'bold',
        color: Colors.primary
    },
    rightComponent: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingLeft: 5,
        justifyContent: 'flex-end',
    },
    detail: {
        // fontSize: 9,
        fontWeight: '600',
        marginTop: 1,
        color: Colors.hint
    },
    viewWithRightComponent: {
        flexDirection: 'row',
        flex: 1,
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    flex: {
        flex: 1
    },
    contentStyle: { flexDirection: 'row', flex: 1 }
});

export default class SelectionItem extends Component {
    onPress = () => {
        const { onPress } = this.props;
        if (onPress && typeof onPress === 'function') onPress();
    }

    onButtonPress = () => {
        const { onButtonPress, props } = this.props;
        if (onButtonPress && typeof onButtonPress === 'function') onButtonPress(props);
    }

    removeNumberOfLine = (style) => omit(ValueUtil.mergeStyle(style), ['numberOfLines']);

    render() {
        const {
            style, leftIcon, rightIcon, title,
            body, onPress, alignCentered, leftIconStyle = {},
            rightIconStyle = {}, rightTitle, rightTitleStyle = {},
            rightButtonTitle, onButtonPress, rightButtonStyle = {},
            rightButtonTitleStyle = {}, titleStyle, rightComponent, detail, bodyStyle, detailStyle, leftIconContainerStyle,
            leftComponent,
            disabledPress, contentStyle, propsTitle = {}, propsBody = {}
        } = this.props;
        const source = ValueUtil.getImageSource(leftIcon);
        const rightIconSource = ValueUtil.getImageSource(rightIcon);
        const iconWidth = get(leftIconStyle, 'width', 20);
        const iconHeight = get(leftIconStyle, 'height', 20);
        const iconPadding = get(leftIconStyle, 'padding', 0);
        const borderStyle = {
            justifyContent: 'center',
            alignItems: 'center',
            width: iconWidth + iconPadding,
            height: iconHeight + iconPadding,
            marginRight: 8
        };
        const titleNumberOfLines = get(ValueUtil.mergeStyle(titleStyle), 'numberOfLines', 2);
        const bodyNumberOfLines = get(ValueUtil.mergeStyle(bodyStyle), 'numberOfLines', 2);
        const detailNumberOfLines = get(ValueUtil.mergeStyle(detailStyle), 'numberOfLines', 2);

        const flex = get(ValueUtil.mergeStyle(style), 'flex', null);

        return (
            <TouchableOpacity
                disabled={disabledPress}
                onPress={this.onPress}
                style={flex ? { flex } : {}}
                activeOpacity={onPress ? 0.5 : 1}
                accessible={false}
            >
                <View style={[styles.container, style, alignCentered ? { alignItems: 'center' } : {}]}>
                    {(typeof source === 'number' || (source && source.uri))
                        ? (
                            <View style={[ValueUtil.extractStyle(leftIconContainerStyle), borderStyle]}>
                                <Image
                                    source={source}
                                    style={[
                                        styles.leftIcon, leftIconStyle,
                                        alignCentered ? { marginTop: 0 } : {}
                                    ]}
                                />
                            </View>
                        ) : leftIcon || <View />}
                    <View style={[styles.contentStyle, ValueUtil.extractStyle(contentStyle), alignCentered ? { alignItems: 'center' } : {}]}>
                        <View style={styles.infoView}>
                            <View style={styles.viewWithRightComponent}>
                                {leftComponent ? leftComponent({ title, body, detail }) : (
                                    <View style={{ flex: 1 }}>
                                        <Text.H4
                                            style={[styles.title, this.removeNumberOfLine(titleStyle)]}
                                            numberOfLines={titleNumberOfLines}
                                            {...propsTitle}
                                        >
                                            {title}
                                        </Text.H4>
                                        {body
                                            ? (
                                                <Text.Title
                                                    numberOfLines={bodyNumberOfLines}
                                                    style={[styles.body, this.removeNumberOfLine(bodyStyle)]}
                                                    {...propsBody}
                                                >
                                                    {body}
                                                </Text.Title>
                                            ) : <View />}
                                        {detail ? (
                                            <Text.Caption
                                                numberOfLines={detailNumberOfLines}
                                                style={[styles.detail, this.removeNumberOfLine(detailStyle)]}
                                            >
                                                {detail}
                                            </Text.Caption>
                                        ) : <View />}
                                    </View>
                                )}
                                {rightComponent || <View />}
                            </View>
                        </View>
                        {(typeof rightIconSource === 'number' || (rightIconSource && rightIconSource.uri)) && !rightTitle && !rightButtonTitle ? (
                            <Image
                                source={rightIconSource}
                                style={[styles.rightIcon, ValueUtil.extractStyle(rightIconStyle)]}
                            />
                        ) : rightIcon || <View />}
                        {rightTitle && !rightButtonTitle
                            ? (
                                <Text.Title style={[styles.rightTitle, ValueUtil.extractStyle(rightTitleStyle)]}>
                                    {rightTitle}
                                </Text.Title>
                            ) : <View />}
                        {!rightTitle && rightButtonTitle ? (
                            <TouchableOpacity
                                onPress={this.onButtonPress}
                                activeOpacity={onButtonPress ? 0.5 : 1}
                            >
                                <View style={[styles.rightButton, ValueUtil.extractStyle(rightButtonStyle)]}>
                                    <Text.H4 style={[styles.rightButtonTitle, ValueUtil.extractStyle(rightButtonTitleStyle)]}>
                                        {rightButtonTitle}
                                    </Text.H4>
                                </View>
                            </TouchableOpacity>
                        ) : <View />}
                    </View>
                </View>
            </TouchableOpacity>

        );
    }
}

SelectionItem.propTypes = {
    alignCentered: PropTypes.bool,
    leftIconStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
    rightButtonStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
    rightButtonTitleStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
    rightIconStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
    rightTitleStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
    body: PropTypes.string,
    leftIcon: PropTypes.oneOfType([PropTypes.number, PropTypes.object, PropTypes.string, PropTypes.func]),
    title: PropTypes.string,
    onButtonPress: PropTypes.func,
    onPress: PropTypes.func,
    rightButtonTitle: PropTypes.string,
    rightIcon: PropTypes.oneOfType([PropTypes.number, PropTypes.object, PropTypes.string, PropTypes.func]),
    rightTitle: PropTypes.string,
    style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
    detailStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
    titleStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
    bodyStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
    contentStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
    leftIconContainerStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
    rightComponent: PropTypes.element,
    leftComponent: PropTypes.func,
    disabledPress: PropTypes.bool,
};

SelectionItem.defaultProps = {
    alignCentered: true,
    disabledPress: false
};

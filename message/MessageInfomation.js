import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import {
    Text, Image, Colors, Spacing, IconSource, TouchableOpacity, ValueUtil, SwitchLanguage
} from '@momo-kits/core';
import HTMLView from '@momo-kits/html-view';

const styles = StyleSheet.create({
    container: {
        padding: Spacing.M,
        backgroundColor: Colors.indigo_10,
        borderRadius: 8
    },
    content: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    icon_small: {
        width: 16,
        height: 16,
        tintColor: Colors.blue_04
    },
    icon_default: {
        width: 48,
        height: 48
    },
    message: {
        fontSize: 12,
        color: Colors.black_17,
        marginRight: Spacing.M,
        lineHeight: 16
    },
    button: {
        color: Colors.blue_04,
        fontWeight: 'bold',
        fontSize: 12
    },
    icon_close: {
        width: 15,
        height: 15,
        tintColor: Colors.black_17
    },
    button_left: {
        alignSelf: 'flex-start'
    },
    button_right: {
        alignSelf: 'flex-end',
        marginRight: 8
    },
    buttonMargin: {
        marginTop: 14,
        marginBottom: 6
    },
    icon_close_container: {
        height: 16,
        width: 16,
        justifyContent: 'center',
        alignItems: 'center'
    },
    title: {
        marginBottom: Spacing.XS,
    },
    messageContainer: {
        flex: 1,
    }
});

export default class MessageInformation extends Component {
    constructor(props) {
        super(props);
        this.state = {
            expending: props.initExpandState
        };
    }

    mapIconSize = (iconSize) => {
        if (iconSize === 'small') return styles.icon_small;
        if (iconSize === 'default') return styles.icon_default;
        return styles.icon_default;
    }

    mapButtonPosition = (position) => {
        if (position === 'left') return styles.button_left;
        if (position === 'right') return styles.button_right;
        return styles.button_right;
    }

    onPress = () => {
        const { onPress, expandable } = this.props;

        if (expandable) {
            const { expending } = this.state;
            this.setState({ expending: !expending });
        } else if (typeof onPress === 'function') onPress();
    }

    onClose = () => {
        const { onClose } = this.props;
        if (typeof onClose === 'function') onClose();
    }

    render() {
        const {
            iconSize, tintColor, message, buttonTitle, buttonPosition, icon, style, useHtml, resizeMode,
            hideCloseIcon, expandable, shortenMessage, numberOfLineWhenShorten, buttonStyle, maxCharactersDisplay, messageStyle = {},
            title, titleStyle, iconStyle
        } = this.props;
        const { expending } = this.state;
        const defaultIconStyle = this.mapIconSize(iconSize);
        const customButtonStyle = this.mapButtonPosition(buttonPosition);

        const defaultMessageStyle = {};
        if (icon) {
            defaultMessageStyle.marginLeft = Spacing.S;
        }

        let customShortenMessage = shortenMessage;
        if (maxCharactersDisplay) {
            customShortenMessage = message?.substring?.(0, maxCharactersDisplay);
        }
        let messageString = message;
        let buttonTitleString = buttonTitle;
        if (expandable) {
            buttonTitleString = expending ? SwitchLanguage.shorten : SwitchLanguage.viewMore;
            messageString = expending ? message : (customShortenMessage || message);
        }
        const messageWithDot = [messageString];
        if (expandable && !expending) {
            messageWithDot.push('...');
        }
        return (
            <View style={[styles.container, ValueUtil.extractStyle(style)]}>
                <View style={styles.content}>
                    {icon ? <Image resizeMode={resizeMode} source={icon} style={[defaultIconStyle, iconStyle, { tintColor }]} /> : <View />}
                    {
                        useHtml
                            ? (
                                <View style={{ flex: 1, flexDirection: 'row' }}>
                                    <HTMLView
                                        styleSheet={{
                                            div: [styles.message, defaultMessageStyle, ValueUtil.mergeStyle(messageStyle)]
                                        }}
                                        nodeComponentProps={{ numberOfLines: expandable && expending ? null : numberOfLineWhenShorten }}
                                        value={`<div>${messageWithDot.join('')}<div>`}
                                    />
                                </View>
                            ) : (
                                <View style={styles.messageContainer}>
                                    {
                                        title
                                            ? (
                                                <Text.Title style={[styles.title, defaultMessageStyle, titleStyle]} weight="bold">
                                                    {title}
                                                </Text.Title>
                                            )
                                            : null
                                    }
                                    <Text.SubTitle
                                        numberOfLines={expandable && expending ? null : numberOfLineWhenShorten}
                                        style={[styles.message, defaultMessageStyle, ValueUtil.mergeStyle(messageStyle)]}
                                    >
                                        {message}
                                    </Text.SubTitle>
                                </View>
                            )
                    }
                    {hideCloseIcon ? <View /> : (
                        <TouchableOpacity onPress={this.onClose} style={styles.icon_close_container}>
                            <Image source={IconSource.ic_close_x_24} style={styles.icon_close} />
                        </TouchableOpacity>
                    )}
                </View>
                {buttonTitleString ? (
                    <TouchableOpacity onPress={this.onPress} style={[customButtonStyle, styles.buttonMargin]}>
                        <Text.SubTitle style={[styles.button, ValueUtil.extractStyle(buttonStyle)]}>{buttonTitleString}</Text.SubTitle>
                    </TouchableOpacity>
                ) : <View />}
            </View>
        );
    }
}

MessageInformation.propTypes = {
    buttonPosition: PropTypes.string,
    buttonTitle: PropTypes.any,
    hideCloseIcon: PropTypes.bool,
    icon: PropTypes.any,
    iconSize: PropTypes.string,
    message: PropTypes.string,
    onClose: PropTypes.func,
    onPress: PropTypes.func,
    style: PropTypes.any,
    tintColor: PropTypes.string,
    shortenMessage: PropTypes.string,
    numberOfLineWhenShorten: PropTypes.number,
    expandable: PropTypes.bool,
    buttonStyle: PropTypes.any,
    initExpandState: PropTypes.bool,
    maxCharactersDisplay: PropTypes.number,
    useHtml: PropTypes.bool,
    title: PropTypes.string,
    titleStyle: PropTypes.any,
    iconStyle: PropTypes.any
};

MessageInformation.defaultProps = {
    buttonPosition: 'right',
    iconSize: 'default',
    hideCloseIcon: false,
    initExpandState: true,
    useHtml: false
};

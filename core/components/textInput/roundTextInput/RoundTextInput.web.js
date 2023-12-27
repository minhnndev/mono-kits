/* eslint-disable react/jsx-props-no-spreading */
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import {
    View, TextInput, StyleSheet, TouchableOpacity, Platform, Image
} from 'react-native';
import { get } from 'lodash';
import Colors from '../../../colors';
import { Icons } from '../../../icons';
import ValueUtil from '../../../utils/ValueUtil';
import Text from '../../typography';

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 25,
        minHeight: 50,
        backgroundColor: 'white',
        paddingHorizontal: 15
    },
    textInput: {
        textAlign: 'left',
        color: '#222222',
        fontSize: 15,
        padding: 0
    },
    icon: {
        width: 20,
        height: 20,
        tintColor: Colors.custom_keyboard_border_color,
        backgroundColor: 'white',
        borderRadius: 8
    },
    textInputView: {
        flex: 1
    },
    iconViewLeft: {
        width: 30,
        alignItems: 'flex-end',
        position: 'absolute',
        left: 0
    },
    iconViewRight: {
        width: 30,
        alignItems: 'flex-start',
        position: 'absolute',
        right: 0
    },
    passwordView: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        top: 0,
        left: 20,
        right: 20,
        bottom: 0,
        backgroundColor: 'white',
    },
    dot: {
        width: 12,
        height: 12,
        borderRadius: 6,
        marginHorizontal: 4
    },
    emptyDot: {
        backgroundColor: Colors.placeholder,
    },
    filledDot: {
        backgroundColor: Colors.hint,
    },
    underlineText: {
        borderBottomColor: Colors.text_underline_border_bottom,
        borderBottomWidth: 2,
        marginHorizontal: 4,
        height: 32,
        marginTop: 6,
        minWidth: 17,
        alignItems: 'center'
    },
    textUnderline: {
        // fontSize: 17,
        color: 'black',
    }
});

const hitSlop = {
    top: 5, left: 5, bottom: 5, right: 5
};

const PASSWORD_MAX_LENGTH_DEFAULT = 6;

const convertStyle = {
    center: 'center',
    left: 'flex-start',
    right: 'flex-end'
};

export default class RoundTextInput extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value: props.value || ''
        };
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        const { value, secureTextEntry, maxLength } = nextProps;
        if (nextProps.value !== undefined && nextProps.value !== prevState.value) {
            if (secureTextEntry && prevState.value.length >= maxLength && value.length > prevState.value.length) return null;
            return {
                value
            };
        }
        return null;
    }

    onChangeText = (text) => {
        const { value } = this.state;
        const { secureTextEntry, maxLength = PASSWORD_MAX_LENGTH_DEFAULT } = this.props;
        if (secureTextEntry && value.length >= maxLength && text.length > value.length) return;
        this.setState({ value: text }, () => {
            const { onChangeText } = this.props;
            if (onChangeText && typeof onChangeText === 'function') onChangeText(text);
        });
    }

    setText = (value) => {
        this.setState({ value });
    }

    focus = () => {
        const { disableFocus = false } = this.props;
        if (this.textInput && !disableFocus) {
            this.textInput.focus();
        }
    }

    blur = () => {
        if (this.textInput) {
            this.textInput.blur();
            const { onBlur } = this.props;
            if (onBlur && typeof onBlur === 'function') { onBlur(); }
        }
    }

    onRightIconPress = () => {
        const { onRightIconPress, clearOnRightPress } = this.props;
        if (onRightIconPress && typeof onRightIconPress === 'function') onRightIconPress();
        if (clearOnRightPress) {
            if (this.textInput) {
                this.setState({ value: '' }, () => {
                    const { onChangeText } = this.props;
                    if (onChangeText && typeof onChangeText === 'function') onChangeText('');
                });
            }
        }
    }

    onLeftIconPress = () => {
        const { onLeftIconPress } = this.props;
        if (onLeftIconPress && typeof onLeftIconPress === 'function') onLeftIconPress();
    }

    renderDots = () => {
        const { maxLength = PASSWORD_MAX_LENGTH_DEFAULT } = this.props;
        const { value } = this.state;
        const textUnderlines = [];
        for (let i = 0; i < maxLength; i += 1) {
            textUnderlines.push(<View
                key={`k_${i}`}
                style={[styles.dot, i < value.length ? styles.filledDot : styles.emptyDot]}
            />);
        }
        return textUnderlines;
    }

    renderTextUnderline = () => {
        const { maxLength = PASSWORD_MAX_LENGTH_DEFAULT } = this.props;
        const { value } = this.state;
        const valueArray = value.split('');
        const dots = [];
        for (let i = 0; i < maxLength; i += 1) {
            if (valueArray[i]) {
                dots.push(<View key={`k_${i}`} style={styles.underlineText}><Text.Title style={styles.textUnderline}>{valueArray[i]}</Text.Title></View>);
            } else {
                dots.push(<View key={`k_${i}`} style={styles.underlineText}><Text.Title style={styles.textUnderline}> </Text.Title></View>);
            }
        }
        return dots;
    }

    render() {
        const {
            style, textStyle, leftIcon, rightIcon, onRightIconPress, onLeftIconPress, initWithDots,
            leftIconStyle, rightIconStyle, secureTextEntry, separateTextUnderline, rightComponent, clearOnRightPress
        } = this.props;
        const { value } = this.state;
        const rightIconSource = clearOnRightPress ? Icons.ic_close_24 : rightIcon;
        const bgColorContainer = get(style, 'backgroundColor', 'white');
        const textAlign = get(textStyle, 'textAlign', 'left');
        const reduceMarginRight = textAlign !== 'center' && !leftIcon;
        const reduceMarginLeft = textAlign !== 'center' && !rightIconSource;
        const textColor = (!secureTextEntry && initWithDots) ? get(textStyle, 'color', '#222222') : 'transparent';
        const showDots = secureTextEntry && (initWithDots || value.length > 0);
        const hasLeftIcon = typeof leftIcon === 'number' || (leftIcon && leftIcon?.uri) || typeof leftIcon === 'string';
        const hasRightIcon = typeof rightIconSource === 'number' || rightIconSource && rightIconSource?.uri || typeof rightIconSource === 'string';

        let currentTextAlign = textAlign;
        let alignCenterStyleAndroid = {};
        if (textAlign === 'center' && Platform.OS === 'android' && !secureTextEntry) {
            if (value.length === 0) {
                currentTextAlign = 'left';
            } else if (value.length > 0) {
                currentTextAlign = 'center';
            }
            alignCenterStyleAndroid = { alignItems: 'center' };
        }

        return (
            <View style={[styles.container, ValueUtil.mergeStyle(style)]}>
                <View style={[styles.iconViewLeft, { marginRight: reduceMarginRight ? 0 : 8 }]}>
                    {(hasLeftIcon) ? (
                        <TouchableOpacity
                            hitSlop={hitSlop}
                            onPress={this.onLeftIconPress}
                            activeOpacity={onLeftIconPress ? 0.5 : 1}
                        >
                            <Image
                                source={leftIcon}
                                style={[styles.icon, { backgroundColor: bgColorContainer }, ValueUtil.mergeStyle(leftIconStyle)]}
                            />
                        </TouchableOpacity>
                    ) : leftIcon || <View />}
                </View>
                <View style={[styles.textInputView, alignCenterStyleAndroid]}>
                    <TextInput
                        allowFontScaling={false}
                        autoCapitalize="none"
                        {...this.props}
                        secureTextEntry={false}
                        numberOfLines={1}
                        style={[
                            styles.textInput,
                            { color: textColor },
                            ValueUtil.mergeStyle(textStyle),
                            { marginLeft: hasLeftIcon || textAlign === 'center' ? 20 : 5 },
                            { marginRight: hasRightIcon || textAlign === 'center' ? 20 : 5 },
                            { textAlign: currentTextAlign }
                        ]}
                        value={value}
                        selectionColor={showDots && value.length > 0 ? 'transparent' : null}
                        onChangeText={this.onChangeText}
                        autoCorrect={false}
                        ref={(ref) => this.textInput = ref}
                        placeholderTextColor={Colors.brown_grey}
                        underlineColorAndroid="transparent"
                    />
                    {showDots ? (
                        <TouchableOpacity
                            style={[styles.passwordView, { justifyContent: convertStyle[textAlign] || 'flex-start' }]}
                            activeOpacity={1}
                            onPress={this.focus}
                        >
                            {this.renderDots()}
                        </TouchableOpacity>
                    ) : <View />}
                    {separateTextUnderline
                        ? (
                            <TouchableOpacity
                                style={[styles.passwordView, { justifyContent: convertStyle[textAlign] || 'flex-start' }]}
                                activeOpacity={1}
                                onPress={this.focus}
                            >
                                {this.renderTextUnderline()}
                            </TouchableOpacity>
                        ) : <View />}
                </View>
                <View style={[styles.iconViewRight, { marginLeft: reduceMarginLeft ? 0 : 8 }]}>
                    {hasRightIcon ? (
                        <TouchableOpacity
                            hitSlop={hitSlop}
                            onPress={this.onRightIconPress}
                            activeOpacity={onRightIconPress ? 0.5 : 1}
                        >
                            <Image
                                source={rightIconSource}
                                style={[styles.icon, { backgroundColor: bgColorContainer }, ValueUtil.mergeStyle(rightIconStyle)]}
                            />
                        </TouchableOpacity>
                    ) : rightIcon || <View />}

                </View>
                <View style={{}}>
                    {rightComponent || <View />}
                </View>
            </View>
        );
    }
}

RoundTextInput.propTypes = {
    clearOnRightPress: PropTypes.bool,
    leftIcon: PropTypes.oneOfType([PropTypes.object, PropTypes.number, PropTypes.func]),
    leftIconStyle: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
    maxLength: PropTypes.number,
    onBlur: PropTypes.func,
    onChangeText: PropTypes.func,
    onFocus: PropTypes.func,
    onLeftIconPress: PropTypes.func,
    onRightIconPress: PropTypes.func,
    rightIcon: PropTypes.oneOfType([PropTypes.object, PropTypes.number, PropTypes.func, PropTypes.string]),
    rightIconStyle: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
    secureTextEntry: PropTypes.bool,
    style: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
    textStyle: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
    value: PropTypes.string,
    separateTextUnderline: PropTypes.bool,
    rightComponent: PropTypes.any,
    initWithDots: PropTypes.bool,
    disableFocus: PropTypes.bool
};

RoundTextInput.defaultProps = {
    separateTextUnderline: false,
    secureTextEntry: false,
    initWithDots: true,
    disableFocus: false
};

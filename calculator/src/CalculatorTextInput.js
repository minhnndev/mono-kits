/* eslint-disable react/jsx-props-no-spreading */
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import {
    View, StyleSheet, Animated, DeviceEventEmitter,
    TouchableOpacity, Platform, Easing, TextInput, InteractionManager
} from 'react-native';
import { get } from 'lodash';
import {
    Text, Colors, NumberUtils, Image, Keys, ValueUtil
} from '@momo-kits/core';
import CalculatorTextInputBase from './CalculatorTextInputBase';
import CalculatorHelper from './helper/CalculatorHelper';

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 16,
        minHeight: 42,
        borderColor: Colors.black_04,
        borderWidth: 1,
        borderRadius: 8,
        marginTop: 8
    },
    textFloating: {
        fontSize: 15,
        color: Colors.primary,
        marginBottom: 4
    },
    underline: {
        height: 1,
        backgroundColor: Colors.hint,
        marginTop: Platform.OS === 'ios' ? 10 : 0,
    },
    underlineFocus: {

    },
    errorMessage: {
        marginTop: 2,
        color: Colors.danger,
        // fontSize: 13
    },
    textInput: {
        fontSize: 20,
        color: 'black',
        flex: 1
    },
    textInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        overflow: 'hidden'
    },
    textInputContainerCurrency: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    rightIcon: {
        width: 24,
        height: 24,
        tintColor: Colors.black_17,
        backgroundColor: 'white',
        borderRadius: 8,
        marginHorizontal: 5
    },
    currencyUnit: {
        color: Colors.brown_grey,
        // fontSize: 14,
        marginRight: 5
    },
    rightIconAnimatedContainer: {
        overflow: 'hidden',
        justifyContent: 'center',
        alignItems: 'center'
    },
    floatingView: {
        position: 'absolute',
        top: -8,
        backgroundColor: Colors.white,
        paddingHorizontal: 8,
        left: 8,
        flexDirection: 'row'
    },
});

const hitSlop = {
    top: 5, left: 5, bottom: 5, right: 5
};

const animatedStuffsConfig = (toValue) => ({
    toValue,
    duration: 230,
    easing: Easing.ease,
    useNativeDriver: false
});

const KeyboardType = {
    calculator: 'calculator'
};

export default class CalculatorTextInput extends Component {
    constructor(props) {
        super(props);
        // const value = this.getText(props.value || props.defaultValue || '', true);
        this.state = {
            value: props.value || props.defaultValue,
            focused: false,
        };
        this.animatedStuffs = new Animated.Value(0);
        this.typing = false;
        this.mounting = true;
        this.timeout;
    }

    componentDidMount() {
        /**
         * fire on first time
         */
        this.dismissListener = DeviceEventEmitter.addListener(Keys.CALCULATOR_DISMISS, this.dismissKeyBoard);
        this.calculateListener = DeviceEventEmitter.addListener(Keys.CALCULATOR_CALCULATE, this.calculate);
        this.calculatePushKeyListener = DeviceEventEmitter.addListener(Keys.CALULATOR_PUSH_KEY, this.detectEventKey);
        if(this.props.defaultValue && Platform.OS === 'android'){
            InteractionManager.runAfterInteractions(() => {
                this.onChangeTextCalculator(this.props.defaultValue);
                this.mounting = false;
            });
        }
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.value !== undefined && nextProps.value !== prevState.value) {
            return {
                value: nextProps.value
            };
        }
        return null;
    }

    /**
     * if cannot click on first click
     * add keyboardShouldPersistTaps="handled" to scrollView of container
     */
    clearText = () => {
        if (this.textInput) {
            this.textInput.setNativeProps({ text: '' });
            this.onChangeTextCalculator('');
        }
    }

    setText = (text) => {
        if (this.textInput) {
            this.textInput.setNativeProps({ text });
        }
    }

    onChangeText = (callback) => {
        const { value } = this.state;
        const formatedText = this.formatText(value);
        const { onChangeText } = this.props;
        const textChanged = this.textChanged(formatedText);
        if (onChangeText && typeof onChangeText === 'function') {
            onChangeText(textChanged, value, CalculatorHelper.isCalculating(value));
        }
        if (value.length > 0 && !this.typing) {
            this.typing = true;
            Animated.timing(this.animatedStuffs, animatedStuffsConfig(1)).start();
        }
        if (value.length <= 0 && this.typing) {
            this.typing = false;
            Animated.timing(this.animatedStuffs, animatedStuffsConfig(0)).start();
        }
        /**
         * validate if reg is provided
         */
        if (callback && typeof callback === 'function') callback();
    }

    componentWillUnmount() {
        if (this.dismissListener) {
            this.dismissListener.remove();
        }
        if (this.calculateListener) {
            this.calculateListener.remove();
        }
        if (this.calculatePushKeyListener) {
            this.calculatePushKeyListener.remove();
        }
        clearTimeout(this.timeout);
    }

    blur = () => {
        if (this.textInput) {
            this.textInput.blur();
        }
    }

    detectEventKey = (text) => {
        const { onPressKeyboard } = this.props;
        if (text) {
            onPressKeyboard?.(text);
        }
    };

    dismissKeyBoard = () => {
        this.blur();
        this.calculate();
    }

    calculate = (callback) => {
        const { value } = this.state;
        let result = CalculatorHelper.calculate(value);
        result = NumberUtils.formatNumberToMoney(result);
        this.onChangeTextCalculator(result, callback);
    }

    formatText = (text) => {
        const formular = CalculatorHelper.formatFormular(text);
        return formular;
    }

    textChanged = (value) => {
        let text = CalculatorHelper.removeLastSymbols(value);
        text = CalculatorHelper.calculate(text);
        return text;
    }

    getAmountMoney = () => {
        const { value } = this.state;
        const result = CalculatorHelper.calculate(value);
        return result === 0 ? '' : result;
    }

    getText = (text = '', isDefault) => {
        const {
            maxLength, currencyUnit = 'đ', keyboardType
        } = this.props;
        let valueFormatted = text;
        if (text?.length > 0 && keyboardType === KeyboardType.calculator) {
            text = ValueUtil.removeSymbols(text);
            if (!text.endsWith(currencyUnit) && text?.length >= 1 && !isDefault && this.cacheValue?.length > 0) {
                if (text.includes(currencyUnit)) {
                    if (text.substr(text?.length - 1, 1) !== currencyUnit) {
                        text = text.replace(`${currencyUnit}`, '');
                    }
                } else {
                    text = text.substr(0, text?.length - currencyUnit?.length);
                }
            }
            const positiveNumberInput = NumberUtils.formatMoneyToNumber(text, currencyUnit);
            valueFormatted = NumberUtils.formatNumberToMoney(positiveNumberInput, currencyUnit);
            // TODO: Fixed format currency on android
            if (valueFormatted?.length > maxLength + currencyUnit?.length && Platform.OS === 'android' && !isDefault) {
                const newText = this.getText(valueFormatted.slice(0, maxLength + currencyUnit?.length - 1));
                valueFormatted = newText;
            }
            if ((positiveNumberInput === 0 || positiveNumberInput === '') && !isDefault) valueFormatted = '';
            this.cacheValue = valueFormatted;
        }
        return valueFormatted;
    }

    onChangeTextCalculator = (text, callback) => {
        // this.setState({
        //     value: this.getText(text),
        // }, () => this.onChangeText(callback));
        const formatedText = this.formatText(text);
        if (formatedText.length < text.length) {
            this.setState({
                value: text,
            }, () => {
                this.setState({
                    value: formatedText
                }, () => this.onChangeText(callback));
            });
        } else {
            this.setState({
                value: formatedText,
            }, () => this.onChangeText(callback));
        }
    }

    requestFocus = () => {
        if (this.mounting) {
            clearTimeout(this.timeout);
            this.timeout = setTimeout(
                () => {
                    this.textInput?.requestFocus?.();
                },
                Platform.OS === 'android' ? 750 : 500
            );
        } else {
            this.textInput?.requestFocus?.();
        }
    };

    onFocus = () => {
        DeviceEventEmitter.emit(Keys.CALCULATOR_TEXT_INPUT_FOCUSED);
        this.setState({ focused: true }, () => {
            const { onFocus } = this.props;
            if (onFocus && typeof onFocus === 'function') onFocus();
        });
    }

    onBlur = () => {
        DeviceEventEmitter.emit(Keys.CALCULATOR_TEXT_INPUT_UNFOCUSED);
        setTimeout(() => {
            this.setState({ focused: false }, () => {
                const { onBlur } = this.props;
                if (onBlur && typeof onBlur === 'function') onBlur();
            });
        }, 100);
    }

    onRightIconPress = () => {
        const { onRightIconPress, clearOnRightPress } = this.props;
        if (onRightIconPress && typeof onRightIconPress === 'function') onRightIconPress();
        if (clearOnRightPress) this.onChangeTextCalculator('');
    }

    underlineColor = (focused) => {
        if (focused) return Colors.warm_purple;
        return Colors.hint;
    }

    getSelectionInput = () => {
        if (Platform.OS === 'ios') return {};
        const { keyboardType, currencyUnit, maxLength = undefined } = this.props;
        const { value } = this.state;
        const defaultSelection = value?.length - currencyUnit?.length > 0 ? value?.length - currencyUnit?.length : 0;
        const maxSelection = maxLength ? maxLength + currencyUnit?.length : 0;
        const selectionPosition = (maxSelection && defaultSelection > maxSelection) ? maxSelection : defaultSelection;
        return keyboardType === KeyboardType.calculator
            ? {
                selection: {
                    start: selectionPosition,
                    end: selectionPosition,
                }
            }
            : {};
    }

    getMaxLength = () => {
        const { maxLength = undefined, keyboardType, currencyUnit } = this.props;
        return maxLength ? { maxLength: keyboardType === KeyboardType.calculator ? maxLength + currencyUnit?.length || 0 : maxLength } : {};
    }

    render() {
        const {
            style, rightIcon, textStyle, errorMessage, onRightIconPress, currencyUnit, textFloating, currencyStyle,
            clearOnRightPress, rightIconStyle, errorMessageStyle, textFloatingStyle, keyboardType, floatingValue, floatingStyle,
            placeholder
        } = this.props;
        const { focused, value } = this.state;
        const underlineColor = this.underlineColor(focused);

        const animatedRightIcon = this.animatedStuffs.interpolate({
            inputRange: [0, 1],
            outputRange: [0, get(rightIconStyle, 'width', 16) + 8]
        });

        const animatedTextFloating = this.animatedStuffs.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 1]
        });

        const TextInputComponent = keyboardType === KeyboardType.calculator ? CalculatorTextInputBase : TextInput;
        const useKeyboardType = keyboardType === KeyboardType.calculator ? 'default' : keyboardType;
        const customCurrencyStyle = {
            fontSize: get(textStyle, 'size', 20),
            color: get(textStyle, 'color', Colors.brown_grey)
        };

        // const selectionCurrent = this.getSelectionInput();

        // const lengthText = this.getMaxLength();

        return (
            <View style={[styles.container, ValueUtil.mergeStyle(style)]}>
                <Animated.Text
                    style={[
                        styles.textFloating, textFloatingStyle,
                        { color: underlineColor, opacity: animatedTextFloating }
                    ]}
                >
                    {textFloating}
                </Animated.Text>
                <View style={[styles.textInputContainer]}>
                    <TextInputComponent
                        allowFontScaling={false}
                        autoCapitalize="none"
                        {...this.props}
                        // {...selectionCurrent}
                        // {...lengthText}
                        keyboardType={useKeyboardType}
                        value={value}
                        onChangeText={this.onChangeTextCalculator}
                        onFocus={this.onFocus}
                        onBlur={this.onBlur}
                        style={[styles.textInput, textStyle]}
                        ref={(ref) => this.textInput = ref}
                        placeholderTextColor={Colors.brown_grey}
                        autoCorrect={false}
                        underlineColorAndroid="transparent"
                        accessibilityLabel={`${placeholder || ''}/TextInput`}
                    />
                    <View style={styles.textInputContainerCurrency}>
                        {currencyUnit ? <Text.Title style={[styles.currencyUnit, customCurrencyStyle, currencyStyle]}>{currencyUnit}</Text.Title> : <View />}
                        {rightIcon ? (
                            <TouchableOpacity
                                hitSlop={hitSlop}
                                onPress={this.onRightIconPress}
                                activeOpacity={(onRightIconPress || clearOnRightPress) ? 0.5 : 1}
                            >
                                <Animated.View
                                    style={[
                                        styles.rightIconAnimatedContainer,
                                        { width: animatedRightIcon }]}
                                >
                                    <Image source={rightIcon} style={[styles.rightIcon, rightIconStyle]} />
                                </Animated.View>
                            </TouchableOpacity>
                        ) : <View />}
                    </View>
                </View>
                <Text.Title
                    style={[
                        styles.errorMessage,
                        errorMessageStyle,
                    ]}
                >
                    {errorMessage || ' '}

                </Text.Title>

                {floatingValue
                    ? (

                        <Gradient colors={[Colors.white, Colors.white]} style={styles.floatingView}>
                            <Text.SubTitle numberOfLines={1} style={[styles.floatingStyle, ValueUtil.mergeStyle(floatingStyle)]}>
                                {floatingValue}
                            </Text.SubTitle>
                        </Gradient>
                    ) : <View />}
            </View>
        );
    }
}

CalculatorTextInput.propTypes = {
    clearOnRightPress: PropTypes.bool,
    currencyUnit: PropTypes.any,
    errorMessage: PropTypes.string,
    errorMessageStyle: PropTypes.object,
    onBlur: PropTypes.func,
    onPressKeyboard: PropTypes.func,
    onChangeText: PropTypes.func,
    onFocus: PropTypes.func,
    onRightIconPress: PropTypes.func,
    rightIcon: PropTypes.oneOfType([PropTypes.object, PropTypes.number, PropTypes.string]),
    rightIconStyle: PropTypes.object,
    style: PropTypes.object,
    textFloating: PropTypes.any,
    textFloatingStyle: PropTypes.any,
    textStyle: PropTypes.object,
    value: PropTypes.string,
    keyboardType: PropTypes.string,
    lineStyle: PropTypes.object,
    currencyStyle: PropTypes.object
};

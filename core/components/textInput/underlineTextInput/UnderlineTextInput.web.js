/* eslint-disable react/jsx-props-no-spreading */
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import {
    View, StyleSheet, TextInput,
    TouchableOpacity, Platform, Image
} from 'react-native';
import Text from '../../typography';
import Colors from '../../../colors';
import { Icons } from '../../../icons';
import NumberUtils from '../../../utils/NumberUtils';
import ValueUtils from '../../../utils/ValueUtil';
import DatetimeUtils from '../../../utils/DatetimeUtil';

const validatedIcon = Icons.ic_check_24;
const validatedFailedIcon = Icons.ic_warning_24;

const styles = StyleSheet.create({
    container: {

    },
    lengthCounter: {
        // fontSize: 12,
        color: Colors.primary,
        marginBottom: 4
    },
    underline: {
        height: 1.5,
        backgroundColor: Colors.hint,
        marginTop: Platform.OS === 'ios' ? 10 : 0
    },
    underlineFocus: {

    },
    errorMessage: {
        marginTop: 2,
        color: Colors.danger,
        // fontSize: 13
    },
    textInput: {
        fontSize: 14,
        color: 'black',
        flex: 1
    },
    textInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        flexGrow: 1
    },
    rightIcon: {
        width: 16,
        height: 16,
        marginHorizontal: 5,
    }
});

const hitSlop = {
    top: 5, left: 5, bottom: 5, right: 5
};

export default class UnderlineTextInput extends Component {
    constructor(props) {
        super(props);
        const value = props.value || props.defaultValue || '';
        let valueCurrencyFormatted = value;
        if (props.inputType === 'money' && value.length > 0) {
            valueCurrencyFormatted = NumberUtils.formatNumberToMoney(value);
        }
        this.state = {
            value: valueCurrencyFormatted,
            focused: false,
            validated: true
        };
    }

    componentDidMount() {
        const { value } = this.state;
        const { regex } = this.props;
        /**
         * fire on first time
         */
        if (regex) this.validateText(value);
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        const { inputType, formatDate } = nextProps;
        if (nextProps.value !== undefined && nextProps.value !== prevState.value) {
            let valueFormatted = nextProps.value;
            if (inputType === 'money' && nextProps.value.toString().length > 0) {
                valueFormatted = NumberUtils.formatNumberToMoney(NumberUtils.formatMoneyToNumber(nextProps.value));
            } else if (inputType === 'date') {
                valueFormatted = DatetimeUtils.stringToDate(nextProps.value, formatDate);
            } else if (inputType === 'bankCard') {
                valueFormatted = NumberUtils.formatBankCardNumber(nextProps.value);
            }
            return {
                value: valueFormatted
            };
        }
        return null;
    }

    componentDidUpdate(nextProps, nextState) {
        const { regex } = nextProps;
        const { value } = nextState;
        if (regex) this.validateText(value);
    }

    /**
     * if cannot click on first click
     * add keyboardShouldPersistTaps="handled" to scrollView of container
     */
    clearText = () => {
        if (this.textInput) {
            this.textInput.setNativeProps({ text: '' });
            this.onChangeText('');
        }
    }

    setText = (text) => {
        this.onChangeText(text);
    }

    getText = (text) => {
        const { inputType, formatDate } = this.props;
        let valueFormatted = text;
        if (inputType === 'money' && text.toString().length > 0) {
            valueFormatted = NumberUtils.formatNumberToMoney(NumberUtils.formatMoneyToNumber(text));
        } else if (inputType === 'date') {
            valueFormatted = DatetimeUtils.stringToDate(text, formatDate);
        } else if (inputType === 'bankCard') {
            valueFormatted = NumberUtils.formatBankCardNumber(text);
        }
        return valueFormatted;
    }

    onChangeText = (value = '') => {
        const { inputType, regex, matchRegex } = this.props;

        /**
         * value match regex will apply change, else value not change
         */
        if (matchRegex && regex) {
            const test = new RegExp(regex);
            const result = test.test(value);
            if (!result) return;
        }

        const valueFormatted = this.getText(value);

        this.setState({ value: valueFormatted }, () => {
            const { onChangeText } = this.props;
            if (onChangeText && typeof onChangeText === 'function') onChangeText(inputType === 'money' ? NumberUtils.formatMoneyToNumber(value) : value);
            /**
             * validate if reg is provided
             */
            if (value.toString().length === 0) this.setState({ validated: true });
            else if (regex) this.validateText(value);
        });
    }

    /**
     * validate text input
     */
    validateText = (text) => {
        const { regex, onValidate } = this.props;
        if (regex && text.length > 0) {
            const { validated } = this.state;
            try {
                const test = new RegExp(regex);
                const result = test.test(text);
                if (result !== validated) {
                    this.setState({ validated: result }, () => {
                        /**
                         * call one times if validate state change
                         */
                        if (onValidate && typeof onValidate === 'function') {
                            onValidate(result);
                        }
                    });
                }
            } catch {
                console.log('Something is incorrect, please check REG operator');
            }
        }
    }

    onFocus = () => {
        this.setState({ focused: true }, () => {
            const { onFocus } = this.props;
            if (onFocus && typeof onFocus === 'function') onFocus();
        });
    }

    focus = () => {
        if (this.textInput) {
            this.textInput.focus();
        }
    }

    onBlur = () => {
        this.setState({ focused: false }, () => {
            const { onBlur } = this.props;
            if (onBlur && typeof onBlur === 'function') onBlur();
        });
    }

    onRightIconPress = () => {
        const { onRightIconPress, clearOnRightPress } = this.props;
        if (typeof onRightIconPress === 'function') onRightIconPress();
        if (clearOnRightPress) this.onChangeText('');
    }

    underlineColor = (error, focused) => {
        if (error) return Colors.red_pink;
        if (focused) return Colors.warm_purple;
        return Colors.hint;
    }

    render() {
        const {
            style, rightIcon, textStyle, regex, errorMessage, onRightIconPress, floatingValue, rightComponent,
            clearOnRightPress, maxLength, maxLengthText, rightIconStyle, errorMessageStyle, lengthCounterStyle, floatingStyle,
            underlineStyle, alwaysShowRightIcon, forceDisplayError
        } = this.props;
        const { focused, value, validated } = this.state;
        const isError = (!validated && regex);
        const underlineColor = this.underlineColor(isError, focused);
        const rightIconSource = ValueUtils.getImageSource(rightIcon);
        const hasIcon = rightIconSource && (typeof rightIconSource === 'number' || rightIconSource.uri);
        const showRightIcon = (focused || alwaysShowRightIcon) && value.length > 0;
        const rightIconView = <Image source={clearOnRightPress ? Icons.ic_close_24 : rightIconSource} style={[styles.rightIcon, rightIconStyle]} />;
        return (
            <View style={style}>
                {floatingValue || (maxLength && maxLengthText)
                    ? (
                        <Text.SubTitle style={[styles.lengthCounter, lengthCounterStyle, floatingStyle, { color: underlineColor }]}>
                            {(value.length > 0 ? floatingValue : '') || (value.length ? `${maxLengthText} (${value.length}/${maxLength})` : ' ')}
                        </Text.SubTitle>
                    ) : <View />}
                <View style={styles.textInputContainer}>
                    <TextInput
                        allowFontScaling={false}
                        autoCapitalize="none"
                        {...this.props}
                        value={value}
                        onChangeText={this.onChangeText}
                        onFocus={this.onFocus}
                        onBlur={this.onBlur}
                        style={[styles.textInput, textStyle]}
                        ref={(ref) => this.textInput = ref}
                        placeholderTextColor={Colors.brown_grey}
                        autoCorrect={false}
                        underlineColorAndroid="transparent"
                    />
                    {regex && value.length > 0 ? (
                        <Image
                            source={validated ? validatedIcon : validatedFailedIcon}
                            style={[styles.rightIcon, rightIconStyle]}
                        />
                    ) : <View />}
                    {hasIcon && showRightIcon ? (
                        <View>
                            {typeof onRightIconPress === 'function' || clearOnRightPress ? (
                                <TouchableOpacity
                                    hitSlop={hitSlop}
                                    onPress={this.onRightIconPress}
                                    disabled={!(typeof onRightIconPress === 'function' || clearOnRightPress)}
                                >
                                    {rightIconView}
                                </TouchableOpacity>
                            ) : rightIconView}
                        </View>
                    ) : <View />}
                    {rightComponent || <View />}
                </View>
                <View style={[styles.underline, { backgroundColor: underlineColor }, underlineStyle]} />
                {(isError || !regex || forceDisplayError) && typeof errorMessage === 'string' ? <Text.Title style={[styles.errorMessage, errorMessageStyle]}>{errorMessage}</Text.Title> : <View />}
            </View>
        );
    }
}

UnderlineTextInput.propTypes = {
    clearOnRightPress: PropTypes.bool,
    errorMessage: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
    errorMessageStyle: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
    lengthCounterStyle: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
    floatingStyle: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
    maxLength: PropTypes.number,
    maxLengthText: PropTypes.string,
    onBlur: PropTypes.func,
    onChangeText: PropTypes.func,
    onFocus: PropTypes.func,
    onRightIconPress: PropTypes.func,
    onValidate: PropTypes.func,
    regex: PropTypes.oneOfType([PropTypes.instanceOf(RegExp), PropTypes.string]),
    rightIcon: PropTypes.oneOfType([PropTypes.shape({ uri: PropTypes.string }), PropTypes.number, PropTypes.string, PropTypes.func]),
    rightIconStyle: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
    style: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
    underlineStyle: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
    textStyle: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
    value: PropTypes.string,
    floatingValue: PropTypes.string,
    rightComponent: PropTypes.any,
    inputType: PropTypes.oneOf(['money', 'date', 'normal', 'bankCard']),
    formatDate: PropTypes.oneOf(['dd/mm/yyyy', 'dd-mm-yyyy', 'yyyy-mm-dd', 'yyyy/mm/dd']),
    matchRegex: PropTypes.bool,
    alwaysShowRightIcon: PropTypes.bool,
    forceDisplayError: PropTypes.bool
};

UnderlineTextInput.defaultProps = {
    errorMessage: false,
    matchRegex: false,
    inputType: 'normal',
    formatDate: 'dd/mm/yyyy',
    alwaysShowRightIcon: false
};

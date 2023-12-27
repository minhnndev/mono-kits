/* eslint-disable react/no-did-update-set-state */
/* eslint-disable no-param-reassign */
/* eslint-disable indent */
/* eslint-disable react/jsx-props-no-spreading */
// eslint-disable-next-line max-classes-per-file
import React from 'react';
import {
    View, StyleSheet, TextInput, TouchableOpacity, Platform, Image
} from 'react-native';
import { get, isEmpty } from 'lodash';
import PropTypes from 'prop-types';
import Text from '../typography';
import Colors from '../../colors';
import { Icons } from '../../icons';
import NumberUtils from '../../utils/NumberUtils';
import ValueUtil from '../../utils/ValueUtil';
import DatetimeUtils from '../../utils/DatetimeUtil';
import { RFValueHorizontal } from '../typography/reponsiveSize';
import SwitchLanguage from '../language/SwitchLanguage';

const validatedIcon = Icons.ic_check_24;
const validatedFailedIcon = Icons.ic_warning;
const ic_clear = Icons.ic_close_circle_full;

const hitSlop = {
    top: 10, left: 5, bottom: 10, right: 5
};

const PASSWORD_MAX_LENGTH_DEFAULT = 6;

const convertStyle = {
    center: 'center',
    left: 'flex-start',
    right: 'flex-end'
};

const styles = StyleSheet.create({
    content: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    inputDisable: {
        flex: 1,
        minHeight: 30,
        justifyContent: 'center',
        paddingTop: 5
    },
    floatingIcon: {
        width: 16, height: 16, resizeMode: 'contain', marginLeft: 4
    },
    floatingView: {
        position: 'absolute',
        top: -10,
        backgroundColor: Colors.white,
        paddingHorizontal: 8,
        left: 8,
        flexDirection: 'row'
    },
    container: {
        // flexDirection: 'row',
        paddingHorizontal: 16,
        minHeight: 42,
        borderColor: Colors.black_04,
        borderWidth: 1,
        borderRadius: 8,
        // alignItems: 'center',
        // justifyContent: 'space-between',
        marginTop: 8,
    },
    iconDefault: {
        width: 24,
        height: 24,
        resizeMode: 'contain',
        marginVertical: 4,
        marginLeft: 5,
    },
    iconClose: {
        width: 24,
        height: 24,
        tintColor: Colors.light_black
    },
    textInput: {
        flex: 1,
        fontSize: RFValueHorizontal(15),
        color: '#222222',
        minHeight: 30,
        textAlignVertical: 'center',
        padding: 0
    },
    rightIcons: {
        marginLeft: 8,
        flexDirection: 'row',
        alignItems: 'center'
    },
    errorMessageView: {
        marginVertical: 6,
    },
    errorMessage: {
        color: Colors.red_04,
        // fontSize: 12
    },
    floatingStyle: {
        // fontSize: 12,
        color: Colors.black_12,
        // lineHeight: 16
        // paddingVertical: 8,
    },
    cardTypeIcon: {
        width: 38,
        height: 30,
        borderWidth: 1,
        borderColor: Colors.border_color_gray,
        borderRadius: 3
    },
    cardTypeBackground: {

    },
    leftIconStyle: {
        marginRight: 10
    },
    currency: {
        marginLeft: 5
    },
    passwordView: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        top: 0,
        left: 2,
        right: 20,
        bottom: 0,
        backgroundColor: 'transparent',
    },
    textDot: {
        marginHorizontal: 2,
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginHorizontal: 4
    },
    emptyDot: {
        backgroundColor: Colors.black_09,
    },
    filledDot: {
        backgroundColor: Colors.black_17,
    },
});

const getStyle = (type) => {
    const objStyle = {
        small: {
            input: {
                minHeight: 35
            },
            text: {
                fontSize: RFValueHorizontal(14),
                color: Colors.black_17
            },
        },
        medium: {
            input: {
                minHeight: 50
            },
            text: {
                fontSize: RFValueHorizontal(16),
                color: Colors.black_17
            },
        },
        large: {
            input: {
                minHeight: 60,
            },
            text: {
                fontSize: RFValueHorizontal(20),
                fontWeight: 'bold',
                color: Colors.black_17
            },
        }
    };
    return objStyle[type] || objStyle.medium;
};

export default class Input extends React.PureComponent {
    constructor(props) {
        super(props);
        const { value, bankCardType } = this.getText(props.value || props.defaultValue || '', true);
        this.state = {
            validated: true,
            value,
            focused: false,
            bankCardType,
            validatedOnBlur: true,
            errorMessageState: ''
        };
        this.backup = '';
        this.valueMoneyCache = '';
        this.cacheValue = value;
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
        if (nextProps.value !== undefined && nextProps.value !== prevState.value) {
            const {
                inputType, formatDate, removeAccent, positiveNumber, regexData, maxLength, currencyUnit, isFormatBankCard,
                bankCardArray = []
            } = nextProps;
            let valueFormatted = removeAccent ? ValueUtil.removeAlias(get(nextProps, 'value', '')) : get(nextProps, 'value', '');
            let bankCardType = {};
            if (isFormatBankCard && (inputType === 'bankCard' || (bankCardArray.indexOf(valueFormatted?.substr(0, 4)) >= 0))) {
                valueFormatted = NumberUtils.formatBankCardNumber(valueFormatted, maxLength);
                bankCardType = NumberUtils.checkCardType(valueFormatted, regexData);
            } else if (inputType === 'money' && valueFormatted?.length > 0) {
                valueFormatted = ValueUtil.removeSymbols(valueFormatted);
                const positiveNumberInput = positiveNumber ? Math.abs(NumberUtils.formatMoneyToNumber(valueFormatted, currencyUnit))
                    : NumberUtils.formatMoneyToNumber(valueFormatted, currencyUnit);
                valueFormatted = NumberUtils.formatNumberToMoney(positiveNumberInput, currencyUnit);
            } else if (inputType === 'date' && valueFormatted?.length > 0) {
                valueFormatted = DatetimeUtils.stringToDate(valueFormatted, formatDate, this.backup);
                this.backup = valueFormatted;
            }
            return { value: valueFormatted, bankCardType };
        }
        return null;
    }

    /**
     * if cannot click on first click
     * add keyboardShouldPersistTaps="handled" to scrollView of container
     */
    clearText = () => {
        const { onClearPress } = this.props;
        const clear = () => {
            if (this.textInput) {
                this.textInput.setNativeProps({ text: '' });
                this.cacheValue = '';
                this.onChangeText('');
            }
        };
        if (onClearPress && typeof onClearPress === 'function') {
            const clearResult = onClearPress?.();
            if (clearResult) {
                clear();
            }
        } else {
            clear();
        }
    }

    onIconPress = () => {
        const { onIconPress } = this.props;
        if (onIconPress && typeof onIconPress === 'function') onIconPress();
    }

    onLeftIconPress = () => {
        const { onLeftIconPress } = this.props;
        if (onLeftIconPress && typeof onLeftIconPress === 'function') onLeftIconPress();
    }

    renderLetters = () => {
        const { maxLength = PASSWORD_MAX_LENGTH_DEFAULT, textDotStyle } = this.props;
        const { value } = this.state;
        const textUnderlines = [];
        for (let i = 0; i < maxLength; i += 1) {
            textUnderlines.push(
                i < value.length
                    ? <Text key={`k_${i}`} style={[styles.textDot, textDotStyle]}>{value[i]}</Text>
                    : (
                        <View
                            key={`k_${i}`}
                            style={[styles.dot, i < value.length ? [styles.filledDot, { backgroundColor: 'transparent' }] : styles.emptyDot]}
                        />
                    )
            );
        }
        return textUnderlines;
    }

    renderDots = () => {
        const { maxLength = PASSWORD_MAX_LENGTH_DEFAULT } = this.props;
        const { value } = this.state;
        const textUnderlines = [];
        for (let i = 0; i < maxLength; i += 1) {
            textUnderlines.push(
                i < value.length
                    ? (
                        <View
                            key={`k_${i}`}
                            style={[styles.dot, styles.filledDot]}
                        />
                    )
                    : (
                        <View
                            key={`k_${i}`}
                            style={[styles.dot, i < value.length ? styles.filledDot : styles.emptyDot]}
                        />
                    )
            );
        }
        return textUnderlines;
    }

    setText = (text, isDefault = true) => {
        if (typeof text === 'string') {
            this.onChangeText(text, isDefault);
        } else if (typeof text === 'number') {
            this.onChangeText(text.toString(), isDefault);
        } else {
            console.warn('text value should be string or number', typeof text);
        }
    }

    getText = (text = '', isDefault) => {
        const {
            inputType, formatDate, removeAccent, positiveNumber, regexData, maxLength, currencyUnit, isFormatBankCard, bankCardArray = []
        } = this.props;
        let valueFormatted = removeAccent ? ValueUtil.removeAlias(text) : text;
        let bankCardType = {};
        if ((inputType === 'percent' || inputType === 'money') && text?.length > 0) {
            text = inputType === 'percent' ? text : ValueUtil.removeSymbols(text);
            if (!text.endsWith(currencyUnit) && text?.length >= 1 && !isDefault && this.cacheValue?.length > 0) {
                if (text.includes(currencyUnit)) {
                    if (text.substr(text?.length - 1, 1) !== currencyUnit) {
                        text = text.replace(`${currencyUnit}`, '');
                    }
                } else {
                    text = text.substr(0, text?.length - currencyUnit?.length);
                }
            }
            const positiveNumberInput = positiveNumber ? Math.abs(NumberUtils.formatMoneyToNumber(text, currencyUnit)) : NumberUtils.formatMoneyToNumber(text, currencyUnit);
            valueFormatted = inputType === 'percent' ? NumberUtils.formatNumberToPercent(positiveNumberInput, currencyUnit) : NumberUtils.formatNumberToMoney(positiveNumberInput, currencyUnit);
            // TODO: Fixed format currency on android
            if (valueFormatted?.length > maxLength + currencyUnit?.length && Platform.OS === 'android' && !isDefault) {
                const { value: newText } = this.getText(valueFormatted.slice(0, maxLength + currencyUnit?.length - 1));
                valueFormatted = newText;
            }
            if ((positiveNumberInput === 0 || positiveNumberInput === '') && !isDefault) valueFormatted = '';
            this.cacheValue = valueFormatted;
        } else if (isFormatBankCard && text?.length > 0
            && (inputType === 'bankCard' || bankCardArray.indexOf(text?.substr(0, 4)) >= 0)) {
            valueFormatted = NumberUtils.formatBankCardNumber(text, maxLength);
            bankCardType = NumberUtils.checkCardType(valueFormatted, regexData);
        } else if (inputType === 'date' && text?.length > 0) {
            valueFormatted = DatetimeUtils.stringToDate(text, formatDate, this.backup);
            this.backup = valueFormatted;
        }
        return { value: valueFormatted, bankCardType };
    }

    onChangeText = (text, isDefault = false) => {
        const {
            onChangeText, regex, matchRegex, regexCheckTimeout, inputType, currencyUnit, maxLength = undefined
        } = this.props;
        if (maxLength && text?.length > (inputType === 'money' ? maxLength + currencyUnit?.length : maxLength)) return;
        /**
         * value match regex will apply change, else value not change
         */
        if (matchRegex && regex) {
            const test = new RegExp(regex);
            const result = test.test(text);
            if (!result) return;
        }

        const { value, bankCardType } = this.getText(text, isDefault);

        this.setState({ value, bankCardType }, () => {
            if (onChangeText && typeof onChangeText === 'function') {
                if (inputType === 'money' || inputType === 'percent') {
                    onChangeText(NumberUtils.formatMoneyToNumber(value, currencyUnit).toString());
                } else {
                    onChangeText(value);
                }
            }
            /**
             * validate if reg is provided
             */
            if (text?.length === 0) this.setState({ validated: true });
            else if (regex) {
                if (this.regexTimeout) clearTimeout(this.regexTimeout);
                this.regexTimeout = setTimeout(() => {
                    this.validateText(value);
                    this.regexTimeout = null;
                }, regexCheckTimeout);
            }
        });
    }

    setErrorMessage = (message) => {
        this.setState({ errorMessageState: message });
    }

    /**
     * validate text input
     */
    validateText = (text) => {
        const { regex, onValidate } = this.props;
        if (regex && text?.length > 0) {
            try {
                const test = new RegExp(regex);
                const result = test.test(text);
                this.setState({ validated: result }, () => {
                    /**
                     * call one times if validate state change
                     */
                    if (onValidate && typeof onValidate === 'function') {
                        onValidate(result);
                    }
                });
            } catch {
                console.log('Something is incorrect, please check REG operator');
            }
        }
    }

    // setSelectionInput = (selection = {}) => this.textInput && this.textInput.setNativeProps({ selection });

    onBlur = () => {
        this.setState({ focused: false }, () => {
            const { onBlur, regexOnBlur, onValidateOnBlur } = this.props;
            if (regexOnBlur) {
                const test = new RegExp(regexOnBlur);
                const { value } = this.state;
                const result = test.test(value);
                this.setState({ validatedOnBlur: result }, () => {
                    if (typeof onValidateOnBlur === 'function') onValidateOnBlur(result);
                });
            }
            if (onBlur && typeof onBlur === 'function') onBlur();
        });
    }

    onFocus = (e) => {
        // const { value, focused } = this.state;
        // if (!focused) {
        //     this.setState({ selection: Platform.OS === 'android' ? value.length > 0 ? { start: value.length, end: value.length } : {} : {} }, () => {
        //         if (Platform.OS === 'android') {
        //             setTimeout(() => {
        //                 this.setState({ selection: {} });
        //             }, 500);
        //         }
        //     });
        // }
        this.setState({ focused: true, validatedOnBlur: true }, () => {
            const { onFocus } = this.props;
            if (onFocus && typeof onFocus === 'function') onFocus(e);
        });
    }

    focus = () => {
        if (this.textInput) {
            this.textInput.focus();
        }
    }

    blur = () => {
        if (this.textInput) {
            this.textInput.blur();
        }
    }

    getSelectionInput = () => {
        if (Platform.OS === 'ios') return {};
        const { inputType, currencyUnit, maxLength = undefined } = this.props;
        const { value } = this.state;
        const defaultSelection = value?.length - currencyUnit?.length > 0 ? value?.length - currencyUnit?.length : 0;
        const maxSelection = maxLength ? maxLength + currencyUnit?.length : 0;
        const selectionPosition = (maxSelection && defaultSelection > maxSelection) ? maxSelection : defaultSelection;
        return inputType === 'money'
            ? {
                selection: {
                    start: selectionPosition,
                    end: selectionPosition,
                }
            }
            : {};
    }

    getMaxLength = () => {
        const { maxLength = undefined, inputType, currencyUnit } = this.props;
        return maxLength ? { maxLength: inputType === 'money' ? maxLength + currencyUnit?.length || 0 : maxLength } : {};
    }

    renderInput = (isInput = true) => {
        const {
            icon, cancellable, iconStyle, regex, textStyle, style, floatingValue, floatingStyle, onLeftIconPress,
            onIconPress, focusBackgroundColor, onPress, focusBorderColor, errorMessage = null, useErrorMessageInRegex,
            rightComponent, hideErrorMessageIcon, showCardType, focusStyle, regexOnBlur, errorMessageOnBlur, leftIcon, floatingIconStyle,
            leftIconStyle, hideMessageError, showCheckIcon, floatingIcon, type, disabled, placeholder, onPressFloating, multiline, footerComponent, contentContainerStyle,
            secureTextEntry, initWithDots, floatingNumberOfLines, isShowCancel
        } = this.props;
        const {
            validated, value, focused, bankCardType, validatedOnBlur, errorMessageState
        } = this.state;
        const hasRightView = (regex && value?.length > 0) || errorMessage || (cancellable && value && value?.length > 0) || icon;
        const textFlex = get(textStyle, 'flex', null);
        const simpleFocusStyle = {
            backgroundColor: focusBackgroundColor,
            borderColor: focusBorderColor,
        };

        let errorMessageDisplay = '';

        if (((useErrorMessageInRegex && !validated) || !useErrorMessageInRegex) && errorMessage) {
            errorMessageDisplay = errorMessage;
        }

        if (!focused && regexOnBlur && !validatedOnBlur) {
            errorMessageDisplay = errorMessageOnBlur;
        }

        if (errorMessageState) {
            errorMessageDisplay = errorMessageState;
        }

        const selectionCurrent = this.getSelectionInput();

        const lengthText = this.getMaxLength();

        const textAlign = get(textStyle, 'textAlign', 'left');

        return (
            <View accessibilityLabel={`${floatingValue || ''}/Input/${isInput ? 'Typing' : 'Click'}`} style={textFlex ? { flex: textFlex } : {}}>

                <View
                    style={[
                        styles.container,
                        style,
                        (!validated && regex) || (errorMessage && !useErrorMessageInRegex) || (!focused && regexOnBlur && !validatedOnBlur) ? { borderColor: Colors.red_04 } : {},
                        !errorMessage && validated && focused ? simpleFocusStyle : {},
                        focused ? focusStyle : {},
                        disabled ? { backgroundColor: Colors.black_02, borderColor: Colors.black_03 } : {},
                        { minWidth: 80 + (cancellable ? 20 : 0) + (leftIcon ? 20 : 0) + (icon ? 20 : 0) }
                    ]}
                >
                    <View style={[styles.content, contentContainerStyle]}>
                        {leftIcon
                            ? (
                                <TouchableOpacity
                                    accessibilityLabel={`${floatingValue || ''}/Input/'Click'/Left}`}
                                    onPress={this.onLeftIconPress}
                                    activeOpacity={onLeftIconPress ? 0.5 : 1}
                                    disabled={typeof onLeftIconPress !== 'function'}
                                    hitSlop={hitSlop}
                                >
                                    <Image
                                        source={leftIcon}
                                        style={[styles.iconDefault, styles.leftIconStyle, ValueUtil.mergeStyle(leftIconStyle)]}
                                    />
                                </TouchableOpacity>
                            )
                            : null}
                        {initWithDots && !secureTextEntry ? (
                            <TouchableOpacity
                                style={[styles.passwordView, { justifyContent: convertStyle[textAlign] || 'flex-start' }]}
                                activeOpacity={1}
                                onPress={this.focus}
                            >
                                {this.renderLetters()}
                            </TouchableOpacity>
                        ) : null}
                        {initWithDots && secureTextEntry ? (
                            <TouchableOpacity
                                style={[styles.passwordView, { justifyContent: convertStyle[textAlign] || 'flex-start' }]}
                                activeOpacity={1}
                                onPress={this.focus}
                            >
                                {this.renderDots()}
                            </TouchableOpacity>
                        ) : null}
                        {isInput && !disabled
                            ? (
                                <TextInput
                                    allowFontScaling={false}
                                    autoCapitalize="none"
                                    placeholderTextColor={Colors.black_09}
                                    editable={!onPress || !disabled}
                                    {...this.props}
                                    {...selectionCurrent}
                                    {...lengthText}
                                    value={value}
                                    autoCorrect={false}
                                    pointerEvents={onPress || disabled ? 'none' : 'auto'}
                                    onFocus={this.onFocus}
                                    onBlur={this.onBlur}
                                    textBreakStrategy="highQuality"
                                    style={[styles.textInput, getStyle(type).input, getStyle(type).text, ValueUtil.mergeStyle(textStyle),
                                    initWithDots && { color: 'transparent', letterSpacing: !secureTextEntry ? 4.4 : -99 },
                                    textFlex ? { flex: textFlex } : { minWidth: 20 }, disabled && { color: Colors.black_09 }]}
                                    onChangeText={this.onChangeText}
                                    ref={(ref) => this.textInput = ref}
                                    numberOfLines={1}
                                    secureTextEntry={secureTextEntry && !initWithDots}
                                    caretHidden={secureTextEntry && value.length > 0}
                                    underlineColorAndroid="transparent"
                                    accessibilityLabel={`${floatingValue || ''}/TextInput`}
                                // onSelectionChange={(event) => console.log(event.nativeEvent.selection)}
                                />
                            ) : (
                                <View style={[
                                    styles.inputDisable, getStyle(type).input,
                                    textFlex ? { flex: textFlex } : { minWidth: 20 },
                                    multiline ? { justifyContent: 'flex-start' } : {}]}
                                >
                                    <Text
                                        numberOfLines={multiline ? 10 : 1}
                                        style={[getStyle(type).text, isEmpty(value) && { color: Colors.black_09 }, disabled && { color: Colors.black_09 }, ValueUtil.mergeStyle(textStyle)]}
                                    >
                                        {value || placeholder}
                                    </Text>
                                </View>
                            )}
                        <View style={hasRightView ? styles.rightIcons : {}}>
                            {bankCardType?.cardUrl && showCardType ? (
                                <Image style={styles.cardTypeIcon} source={{ uri: bankCardType?.cardUrl }} />
                            ) : <View />}
                            {(regex || (regexOnBlur && !focused)) && value?.length > 0 && showCheckIcon
                                ? (
                                    <Image
                                        source={(validated && validatedOnBlur) ? validatedIcon : validatedFailedIcon}
                                        style={[styles.iconDefault]}
                                    />
                                ) : (
                                    <View>
                                        {errorMessageDisplay && !useErrorMessageInRegex && !hideErrorMessageIcon ? (
                                            <Image
                                                source={validatedFailedIcon}
                                                tintColor={Colors.red_05}
                                                style={[styles.iconDefault]}
                                            />
                                        ) : null}
                                    </View>
                                )}
                            {/* {currencyUnit ? (
                            <Text.Title style={[styles.currency, mergeStyle(currencyStyle)]}>
                                {currencyUnit}
                            </Text.Title>
                        ) : <View />} */}
                            {(cancellable && value && value?.length > 0 && focused) || (value && value?.length > 0 && isShowCancel)
                                ? (
                                    <TouchableOpacity
                                        accessibilityLabel={`${floatingValue || ''}/Input/'Click'/Clear}`}
                                        onPress={this.clearText}
                                        activeOpacity={0.5}
                                        hitSlop={hitSlop}
                                    >
                                        <Image
                                            source={ic_clear}
                                            tintColor={Colors.black_17}
                                            style={[styles.iconDefault, styles.iconClose, (icon || rightComponent) && { marginRight: 7 },
                                            (errorMessageDisplay && !useErrorMessageInRegex && !hideErrorMessageIcon) && { marginLeft: 12 }]}
                                        />
                                    </TouchableOpacity>
                                )
                                : null}
                            {icon
                                ? (
                                    <TouchableOpacity
                                        accessibilityLabel={`${floatingValue || ''}/Input/'Click'/Right}`}
                                        onPress={this.onIconPress}
                                        activeOpacity={onIconPress ? 0.5 : 1}
                                        disabled={typeof onIconPress !== 'function'}
                                        hitSlop={hitSlop}
                                    >
                                        <Image
                                            source={icon}
                                            style={[styles.iconDefault, ValueUtil.mergeStyle(iconStyle)]}
                                        />
                                    </TouchableOpacity>
                                )
                                : null}
                        </View>
                        {rightComponent || <View />}
                    </View>
                    {footerComponent || <View />}
                    {floatingValue
                        ? (
                            <View style={[styles.floatingView, {backgroundColor: disabled ? Colors.black_02 : Colors.white}]}>
                                <TouchableOpacity disabled={!onPressFloating} onPress={onPressFloating} style={{ flexDirection: 'row' }}>
                                    <Text.SubTitle numberOfLines={floatingNumberOfLines} style={[styles.floatingStyle, ValueUtil.mergeStyle(floatingStyle)]}>
                                        {floatingValue}
                                    </Text.SubTitle>
                                    {
                                        floatingIcon && (
                                            <Image
                                                source={floatingIcon}
                                                style={[styles.floatingIcon, ValueUtil.mergeStyle(floatingIconStyle)]}
                                            />
                                        )
                                    }
                                </TouchableOpacity>
                            </View>
                        ) : <View />}
                </View>
                {typeof errorMessageDisplay === 'string' && !hideMessageError ? (
                    <View style={styles.errorMessageView}>
                        <Text.SubTitle style={styles.errorMessage}>{errorMessageDisplay || ' '}</Text.SubTitle>
                    </View>
                ) : <View />}

            </View>
        );
    }

    render() {
        const { onPress, textStyle } = this.props;
        const textFlex = get(textStyle, 'flex', null);
        if (onPress && typeof onPress === 'function') {
            return (
                <TouchableOpacity style={textFlex ? { flex: textFlex } : {}} activeOpacity={0.5} onPress={onPress}>
                    {this.renderInput(false)}
                </TouchableOpacity>
            );
        }
        return this.renderInput();
    }
}

Input.propTypes = {
    floatingValue: PropTypes.string,
    floatingIcon: PropTypes.any,
    onPressFloating: PropTypes.func,
    cancellable: PropTypes.bool,
    iconStyle: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
    textStyle: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
    focusStyle: PropTypes.object,
    icon: PropTypes.oneOfType([PropTypes.number, PropTypes.object, PropTypes.string]),
    onChangeText: PropTypes.func,
    onValidate: PropTypes.func,
    regex: PropTypes.oneOfType([PropTypes.instanceOf(RegExp), PropTypes.string]),
    style: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
    focusBackgroundColor: PropTypes.string,
    focusBorderColor: PropTypes.string,
    onPress: PropTypes.func,
    errorMessage: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
    inputType: PropTypes.oneOf(['money', 'normal', 'bankCard', 'date', 'percent']),
    formatDate: PropTypes.oneOf(['dd/mm/yyyy', 'dd-mm-yyyy', 'yyyy-mm-dd', 'yyyy/mm/dd']),
    rightComponent: PropTypes.any,
    hideErrorMessageIcon: PropTypes.bool,
    showCardType: PropTypes.bool,
    matchRegex: PropTypes.bool,
    removeAccent: PropTypes.bool,
    disabled: PropTypes.bool,
    useErrorMessageInRegex: PropTypes.bool,
    regexOnBlur: PropTypes.oneOfType([PropTypes.instanceOf(RegExp), PropTypes.string]),
    errorMessageOnBlur: PropTypes.string,
    regexCheckTimeout: PropTypes.number,
    onIconPress: PropTypes.func,
    onLeftIconPress: PropTypes.func,
    leftIconStyle: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
    floatingIconStyle: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
    leftIcon: PropTypes.oneOfType([PropTypes.number, PropTypes.object]),
    hideMessageError: PropTypes.bool,
    positiveNumber: PropTypes.bool,
    onValidateOnBlur: PropTypes.func,
    showCheckIcon: PropTypes.bool,
    currencyUnit: PropTypes.string,
    currencyStyle: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
    regexData: PropTypes.arrayOf(PropTypes.shape({
        cardType: PropTypes.string,
        cardUrl: PropTypes.string,
        regex: PropTypes.any
    })),
    type: PropTypes.oneOf(['medium', 'large', 'small']),
    isFormatBankCard: PropTypes.bool,
    bankCardArray: PropTypes.arrayOf(PropTypes.string),
    contentContainerStyle: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
    secureTextEntry: PropTypes.bool,
    initWithDots: PropTypes.bool,
    floatingNumberOfLines: PropTypes.number,
    textDotStyle: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
    secureTextHide: PropTypes.bool,
    isShowCancel: PropTypes.bool

};

Input.defaultProps = {
    focusBackgroundColor: 'transparent',
    type: 'medium',
    focusBorderColor: Colors.pink_03,
    currencyUnit: SwitchLanguage.currencyUnit,
    errorMessage: false,
    inputType: 'normal',
    formatDate: 'dd/mm/yyyy',
    hideErrorMessageIcon: false,
    showCardType: false,
    matchRegex: false,
    removeAccent: false,
    focusStyle: {},
    useErrorMessageInRegex: false,
    regexCheckTimeout: 150,
    hideMessageError: false,
    positiveNumber: false,
    showCheckIcon: false,
    errorMessageOnBlur: '',
    disabled: false,
    isFormatBankCard: false,
    bankCardArray: ['9704'],
    secureTextEntry: false,
    initWithDots: false,
    textDotStyle: {},
    secureTextHide: false,
    isShowCancel: false
};

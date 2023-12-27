import React, { Component } from 'react';
import { View, StyleSheet, TextInput, Keyboard } from 'react-native';
import PropTypes from 'prop-types';
import { Text, Colors, Image, TouchableOpacity } from '@momo-kits/core';

const minus =
    'https://img.mservice.io/momo_app_v2/new_version/img/appx_icon/24_navigation_minus_circle.png';
const plus =
    'https://img.mservice.io/momo_app_v2/new_version/img/appx_icon/24_navigation_plus_circle.png';

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
    },
    icon: {
        height: 24,
        width: 24,
        resizeMode: 'contain',
        tintColor: Colors.pink_03,
    },
    text: {
        color: Colors.black_17,
    },
    numberBox: {
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 6,
        backgroundColor: Colors.white,
    },
    button: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.white,
        borderColor: 'transparent',
    },
    borderBox: {
        borderColor: Colors.black_04,
        borderWidth: 1,
        borderRadius: 6,
    },
    disabledIcon: {
        tintColor: Colors.black_09,
    },
    disabledBox: {
        borderColor: Colors.black_03,
        backgroundColor: Colors.black_03,
    },
});

const getStyle = (type) => {
    const objStyle = {
        large: {
            size: {
                ...styles.borderBox,
                width: 32, // height: 26
            },
            icon: {
                width: 24,
                height: 24,
                resizeMode: 'contain',
            },
            text: 'Title',
        },
        medium: {
            size: {
                ...styles.borderBox,
                width: 28, // height: 24
            },
            icon: {
                width: 24,
                height: 24,
                resizeMode: 'contain',
            },
            text: 'SubTitle',
        },
        small: {
            size: {
                ...styles.borderBox,
                width: 20, // height: 16
            },
            icon: {
                width: 16,
                height: 16,
                resizeMode: 'contain',
            },
            text: 'Caption',
        },
    };
    return objStyle[type] || objStyle.medium;
};

const getSize = (type) => {
    const objStyle = {
        large: {
            size: {
                width: 32,
                height: 24, // height: 26
            },
        },
        medium: {
            size: {
                width: 28,
                height: 24, // height: 24
            },
        },
        small: {
            size: {
                width: 20,
                height: 16, // height: 16
            },
        },
    };
    return objStyle[type] || objStyle.medium;
};

export default class Quantity extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value: props.defaultValue || props.min,
            ownUpdate: false,
        };
    }

    componentDidMount() {
        Keyboard.addListener(
            'keyboardDidHide',
            this.checkData(
                this.state.value,
                'increase',
                this.props.min,
                this.props.max,
            ),
        );
    }

    componentWillUnmount() {
        Keyboard.removeAllListeners('keyboardDidHide');
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        const { value = undefined } = this?.props || {};
        if (prevState.ownUpdate) {
            return {
                ownUpdate: false,
            };
        }
        if (nextProps.value !== value && nextProps.value !== prevState.value) {
            return { value: nextProps.value };
        }
        return null;
    }

    onChangeValue = (value, type) => {
        const { onChange } = this.props;
        return (
            onChange && typeof onChange === 'function' && onChange(value, type)
        );
    };

    getValue = (key, step) => {
        const { isIncreaseValue, isDecreaseValue } = this.props;
        const value = {
            increase: isIncreaseValue ? parseInt(step) : 0,
            decrease: isDecreaseValue ? parseInt(step) : 0,
        };
        return value[key];
    };

    setValue = (newValue = 0, type) => {
        this.setState(
            {
                value: newValue,
                ownUpdate: true,
            },
            () => {
                this.onChangeValue(newValue, type);
            },
        );
    };

    checkData = (value, type, min, max) => () => {
        if (value < min) {
            this.setState({ value: min, ownUpdate: true }, () => {
                this.onChangeValue(value, type);
            });
        } else if (value > max) {
            this.setState({ value: max, ownUpdate: true }, () => {
                this.onChangeValue(value, type);
            });
        }

        console.log(value, min, max);
    };

    onPress =
        (isIncrease = true, step) =>
        () => {
            const { isChangeValue, onConditionCheck } = this.props;
            const { value } = this.state;
            const type = isIncrease ? 'increase' : 'decrease';
            if (isChangeValue && value !== '') {
                const newValue = isIncrease
                    ? parseInt(value) + this.getValue('increase', step)
                    : parseInt(value) - this.getValue('decrease', step);
                if (typeof onConditionCheck === 'function') {
                    const passCondition = onConditionCheck(newValue, type);
                    if (passCondition) {
                        this.setValue(newValue, type);
                    }
                } else {
                    this.setValue(newValue, type);
                }
            } else {
                this.onChangeValue(value, type);
            }
        };

    render() {
        const { value } = this.state;
        const {
            style,
            valueStyle,
            size,
            tintColor,
            isIncreaseValue,
            isSingle,
            iconStyle,
            isInput,
            disabled,
            step,
        } = this.props;
        const { min } = this.props || 1;
        const { max } = this.props || 999;
        if (isSingle && value === 0) {
            return (
                <View style={[styles.container, style]}>
                    <IconButton
                        tintColor={tintColor}
                        size={size}
                        disabled={value >= max || !isIncreaseValue}
                        onPress={this.onPress(true, step)}
                        icon={plus}
                    />
                </View>
            );
        }
        const TextComp = Text[getStyle(size).text];

        return (
            <View style={[styles.container, style]}>
                <IconButton
                    style={iconStyle}
                    tintColor={tintColor}
                    size={size}
                    disabled={value === min || disabled}
                    onPress={this.onPress(false, step)}
                    icon={minus}
                />
                <View
                    style={[styles.numberBox, getStyle(size).size, valueStyle]}>
                    {isInput ? (
                        <TextInput
                            style={[
                                {
                                    textAlignVertical: 'center',
                                    padding: 0,
                                },
                                getSize(size).size,
                            ]}
                            underlineColorAndroid="transparent"
                            value={value.toString()}
                            textAlign="center"
                            maxLength={3}
                            keyboardType="number-pad"
                            editable={!disabled}
                            onChangeText={(text) => {
                                if (text[0] !== '0') {
                                    this.setValue(text);
                                }
                            }}
                            onEndEditing={this.checkData(
                                value,
                                'increase',
                                min,
                                max,
                            )}
                        />
                    ) : (
                        <TextComp weight="bold" style={styles.text}>
                            {value}
                        </TextComp>
                    )}
                </View>
                <IconButton
                    tintColor={tintColor}
                    style={iconStyle}
                    size={size}
                    disabled={value >= max || !isIncreaseValue || disabled}
                    onPress={this.onPress(true, step)}
                    icon={plus}
                />
            </View>
        );
    }
}

const IconButton = ({ disabled, onPress, icon, size, tintColor, style }) => (
    <TouchableOpacity
        style={[getStyle(size).size, styles.button, style]} // disabled && styles.disabledBox
        disabled={disabled}
        onPress={onPress}>
        <Image
            source={icon}
            style={[
                getStyle(size).icon,
                { tintColor },
                disabled && styles.disabledIcon,
            ]}
        />
    </TouchableOpacity>
);

Quantity.propTypes = {
    size: PropTypes.oneOf(['large', 'medium', 'small']),
    style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
    valueStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
    min: PropTypes.number,
    max: PropTypes.number,
    value: PropTypes.number,
    defaultValue: PropTypes.number,
    onChange: PropTypes.func,
    isChangeValue: PropTypes.bool,
    isIncreaseValue: PropTypes.bool,
    isDecreaseValue: PropTypes.bool,
    isSingle: PropTypes.bool,
    disabled: PropTypes.bool,
    tintColor: PropTypes.string,
    iconStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
    isInput: PropTypes.bool,
    step: PropTypes.number,
};

Quantity.defaultProps = {
    min: 1,
    max: 100,
    isChangeValue: true,
    isIncreaseValue: true,
    isDecreaseValue: true,
    isSingle: false,
    size: 'medium',
    tintColor: Colors.pink_05_b,
    isInput: false,
    disabled: false,
    step: 1,
};

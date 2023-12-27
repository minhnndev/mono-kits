/* eslint-disable indent */
import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { StyleSheet, View, Image } from 'react-native';
import ValueUtil from '../../core/utils/ValueUtil';
import Colors from '../../core/colors';
import Text from '../../core/components/typography';
import TouchableOpacity from '../../core/components/touchableOpacity/TouchableOpacity';

const CHECKBOX_SIZE_DEFAULT = 16;
const IC_CHECKED_DEFAULT =
    'https://img.mservice.io/momo_app_v2/new_version/img/appx_icon/24_notifications_check.png';

const LabelPosition = {
    left: 'left',
    right: 'right',
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    fillParent: {
        flex: 1,
    },
    checkbox: {
        width: CHECKBOX_SIZE_DEFAULT,
        height: CHECKBOX_SIZE_DEFAULT,
        tintColor: 'white',
    },
    marginLeft: {
        marginLeft: 5,
    },
    marginRight: {
        marginRight: 5,
    },
    title: {
        // fontSize: 15
    },
    disableLabel: {
        color: Colors.disabled,
    },
    border: {
        width: 20,
        height: 20,
        borderRadius: 4,
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: Colors.black_17,
        borderWidth: 1.5,
    },
    checkedBorder: {
        backgroundColor: Colors.pink_05,
        borderColor: 'transparent',
    },
    unCheckBorder: {
        backgroundColor: Colors.black_01,
    },
    disableBorder: {
        backgroundColor: Colors.pink_09,
        borderWidth: 0,
    },
    disableCheckedBorder: {
        backgroundColor: 'transparent',
        borderColor: Colors.black_04,
    },
    disableCheck: {
        tintColor: Colors.black_01,
    },
    defaultRadioButton: {
        backgroundColor: Colors.black_01,
        borderColor: Colors.black_04,
        borderWidth: 1,
    },
    radioButtonSize: {
        width: 20,
        height: 20,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    centerDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: Colors.black_01,
    },
    selectedButton: {
        backgroundColor: Colors.green_05,
    },
    image: {
        height: 42,
        width: 42,
        borderRadius: 4,
        resizeMode: 'contain',
        marginLeft: 15,
    },
});

export default class Checkbox extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value:
                ValueUtil.getBool(props?.defaultValue) ||
                ValueUtil.getBool(props?.value),
            title: props?.title || {},
            ownUpdate: false,
        };
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (prevState.ownUpdate) {
            return {
                ownUpdate: false,
            };
        }
        if (
            typeof nextProps.value === 'boolean' &&
            nextProps.value !== prevState.value
        ) {
            return { value: nextProps.value };
        }

        if (nextProps.resetValue && nextProps?.title !== prevState?.title) {
            return { value: false, title: null };
        }
        return null;
    }

    getValue = () => {
        const { value } = this.state;
        return ValueUtil.getBool(value);
    };

    setValue = (value) => {
        const { disabled, canCheckChange = true } = this.props;
        if (disabled || !canCheckChange) {
            return;
        }
        this.setState(
            (prevState) => ({
                value: value || !prevState.value,
                ownUpdate: true,
            }),
            () => {
                const { value: stateValue } = this.state;
                this.callback(value || stateValue);
            },
        );
    };

    callback = (value) => {
        const { onChange } = this.props;
        if (onChange && typeof onChange === 'function') {
            onChange(value);
        }
    };

    changeValue = () => {
        this.setValue();
    };

    render() {
        const { style, canCheckChange } = this.props;
        const view = (
            <View style={[styles.container, style]}>
                {this.renderLabel(LabelPosition.left)}
                {this.renderCheckbox()}
                {this.renderImage()}
                {this.renderLabel(LabelPosition.right)}
            </View>
        );
        if (canCheckChange) {
            return (
                <TouchableOpacity
                    delay={50}
                    activeOpacity={0.85}
                    onPress={this.changeValue}>
                    {view}
                </TouchableOpacity>
            );
        }
        return view;
    }

    renderCheckbox = () => {
        const isChecked = this.getValue();
        const { checkIcon, disabled, checkType, checkedColor } = this.props;
        const { value } = this.state;
        let borderStyle = styles.unCheckBorder;
        let checkStyle = styles.checkbox;
        if (isChecked)
            borderStyle = {
                borderColor: 'transparent',
                backgroundColor: checkedColor || Colors.pink_05,
            };
        if (disabled) {
            borderStyle = isChecked
                ? styles.disableBorder
                : styles.disableCheckedBorder;
            checkStyle = styles.disableCheck;
        }
        const checkIconSource = checkIcon || IC_CHECKED_DEFAULT;

        if (checkType === 'radio') {
            return (
                <View
                    style={[
                        styles.radioButtonSize,
                        styles.defaultRadioButton,
                        value ? styles.selectedButton : {},
                    ]}>
                    <View style={[styles.centerDot]} />
                </View>
            );
        }

        return (
            <View style={[styles.border, borderStyle]}>
                {value ? (
                    <Image
                        style={[styles.checkbox, checkStyle]}
                        source={checkIconSource}
                    />
                ) : (
                    <View />
                )}
            </View>
        );
    };

    renderLabel = (direction) => {
        const {
            title,
            disabled,
            position,
            disableTitleStyle,
            numberOfLines,
            titleStyle,
        } = this.props;

        if (!title) {
            return null;
        }

        if (
            (direction !== LabelPosition.left && !position) ||
            (position && position !== direction)
        ) {
            return null;
        }

        return (
            <Text.Title
                style={[
                    direction === LabelPosition.right
                        ? styles.marginLeft
                        : styles.marginRight,
                    styles.title,
                    titleStyle,
                    disabled ? disableTitleStyle || styles.disableLabel : null,
                ]}
                numberOfLines={numberOfLines}>
                {title}
            </Text.Title>
        );
    };

    renderImage = () => {
        const { imageUrl, imageStyle } = this.props;
        if (!imageUrl) {
            return null;
        }
        return (
            <Image
                style={[styles.image, imageStyle]}
                source={ValueUtil.getImageSource(imageUrl)}
            />
        );
    };
}

Checkbox.propTypes = {
    title: PropTypes.string,
    position: PropTypes.oneOf(['left', 'right']),
    disableTitleStyle: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
    numberOfLines: PropTypes.number,
    titleStyle: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
    disabled: PropTypes.bool,
    value: PropTypes.bool,
    style: PropTypes.any,
    checkedColor: PropTypes.string,
    onChange: PropTypes.func,
    defaultValue: PropTypes.bool,
    canCheckChange: PropTypes.bool,
    checkIcon: PropTypes.oneOfType([
        PropTypes.shape({ uri: PropTypes.string }),
        PropTypes.string,
        PropTypes.number,
    ]),
    checkType: PropTypes.string,
    imageUrl: PropTypes.string,
    imageStyle: PropTypes.any,
    checkOnPressLabel: PropTypes.bool,
    checkOnPressImage: PropTypes.bool,
};

Checkbox.defaultProps = {
    title: '',
    position: 'left',
    disableTitleStyle: {},
    numberOfLines: 1,
    titleStyle: {},
    disabled: false,
    defaultValue: false,
    canCheckChange: true,
    checkType: 'checkbox',
    checkedColor: Colors.pink_05,
    checkOnPressLabel: false,
    checkOnPressImage: false,
};

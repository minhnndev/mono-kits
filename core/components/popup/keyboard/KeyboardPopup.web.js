import PropTypes from 'prop-types';
import React, { Component } from 'react';
import {
    View, StyleSheet, TouchableOpacity
} from 'react-native';
import RoundTextInput from '../../textInput/roundTextInput/RoundTextInput';
import { Icons } from '../../../icons';
import Colors from '../../../colors';
import NumberKeyboard from './NumberKeyboard';
import BottomPopupHeader from '../header/BottomPopupHeader';
import { ifIphoneX } from '../../../utils/ScreenUtils';
import Text from '../../typography';

const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.custom_keyboard_background_color,
        paddingBottom: ifIphoneX(36, 0)
    },
    inputViewContainer: {
        backgroundColor: Colors.very_light_blue_three,
        alignItems: 'center',
        paddingBottom: 12
    },
    bottomMessage: {
        color: Colors.custom_keyboard_forget_password,
    },
    input: { textAlign: 'center' },
    inputView: {
        width: '60%',
        borderWidth: 1,
        borderColor: Colors.custom_keyboard_top_border_color,
        marginVertical: 13,
        height: 60,
        borderRadius: 30,
    },
    centerMessage: {
        color: Colors.custom_keyboard_center_message,
        textAlign: 'center',
        paddingHorizontal: 40
    },
    centerMessageView: {
        minHeight: 65
    }
});
export default class KeyboardPopup extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value: '',
            centerMessage: props.centerMessage || ''
        };
    }

    componentDidMount() {
        if (this.inputRef) {
            this.inputRef.focus();
        }
    }

    setCenterMessage = (centerMessage) => {
        this.setState({ centerMessage });
    }

    onBottomMessagePress = () => {
        const { onBottomMessagePress } = this.props;
        if (onBottomMessagePress && typeof onBottomMessagePress === 'function') onBottomMessagePress();
    }

    onClose = () => {
        const { navigator, onClose } = this.props;
        if (navigator) navigator.dismiss();
        if (onClose && typeof onClose === 'function') onClose();
    }

    onKeyboardPress = (number) => {
        const { value } = this.state;
        const { maxLength } = this.props;
        const newValue = `${value}${number}`;
        if (newValue.length <= maxLength) {
            this.setText(newValue);
        }
    }

    setText = (value) => {
        const stateChange = { value };
        const { secureTextEntry } = this.props;
        const { centerMessage } = this.state;
        if (centerMessage && secureTextEntry) {
            stateChange.centerMessage = ' ';
        }
        this.setState(stateChange, () => {
            if (this.inputRef) {
                this.inputRef.setText(value);
                const { onChangeValue, maxLength } = this.props;
                if (onChangeValue && typeof onChangeValue === 'function' && value.length === maxLength) {
                    onChangeValue(value, (error) => {
                        if (!error) this.onClose();
                        else {
                            this.setCenterMessage(error);
                        }
                    });
                }
            }
        });
    }

    render() {
        const { value, centerMessage } = this.state;
        const {
            maxLength, title, bottomMessage, secureTextEntry, separateTextUnderline, centerMessageStyle, bottomMessageStyle
        } = this.props;
        return (
            <View style={styles.container}>
                <BottomPopupHeader title={title} onClose={this.onClose} />
                <View style={styles.inputViewContainer}>
                    <RoundTextInput
                        ref={(ref) => this.inputRef = ref}
                        style={styles.inputView}
                        maxLength={maxLength}
                        textStyle={styles.input}
                        clearOnRightPress
                        value={value}
                        editable={false}
                        secureTextEntry={secureTextEntry}
                        separateTextUnderline={separateTextUnderline}
                        rightIcon={value.length === 0 ? null : Icons.ic_close_24}
                        onRightIconPress={() => {
                            this.setState({ value: '' });
                        }}
                    />
                    <View style={styles.centerMessageView}>
                        <Text style={[styles.centerMessage, centerMessageStyle]}>{centerMessage || ' '}</Text>
                    </View>
                    <TouchableOpacity onPress={this.onBottomMessagePress} activeOpacity={0.5}>
                        <Text style={[styles.bottomMessage, bottomMessageStyle]}>{bottomMessage}</Text>
                    </TouchableOpacity>
                </View>
                <NumberKeyboard
                    onBackSpace={() => {
                        if (value.length > 0) {
                            const newValue = value.substring(0, value.length - 1);
                            this.setText(newValue);
                        }
                    }}
                    onPress={this.onKeyboardPress}
                />
            </View>
        );
    }
}

KeyboardPopup.propTypes = {
    bottomMessage: PropTypes.string,
    bottomMessageStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
    centerMessage: PropTypes.string,
    centerMessageStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
    maxLength: PropTypes.number,
    onBottomMessagePress: PropTypes.func,
    onChangeValue: PropTypes.func,
    onClose: PropTypes.func,
    secureTextEntry: PropTypes.bool,
    separateTextUnderline: PropTypes.bool,
    title: PropTypes.string
};

KeyboardPopup.defaultProps = {
    maxLength: 6,
    secureTextEntry: false,
    separateTextUnderline: false
};

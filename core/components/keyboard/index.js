/* eslint-disable react/jsx-no-bind */
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import {
    DeviceEventEmitter,
    Dimensions,
    Keyboard,
    NativeModules,
    StyleSheet,
    View,
    Platform,
} from 'react-native';
import { Keys } from './Keys';
import Row from './components/Row';
import KeyButton from './components/KeyButton';
import { ColorCore } from '../../colors/colorCore';
import { RFValueHorizontal as ScaleSize } from '../typography/reponsiveSize';

const SEPERATOR_WIDTH = 3;
const NUMBER_COLUMN = 4;
const { width, height } = Dimensions.get('window');
const BUTTON_WIDTH =
    ((width > 0 ? width : 375) - (NUMBER_COLUMN + 1) * SEPERATOR_WIDTH) /
    NUMBER_COLUMN;

const isIphoneX = () =>
    Platform.OS === 'ios' &&
    !Platform.isPad &&
    !Platform.isTVOS &&
    (height === 812 ||
        width === 812 ||
        height === 896 ||
        width === 896 ||
        width === 844 ||
        height === 844);

const styles = StyleSheet.create({
    eqBtnWrapper: {
        backgroundColor: '#ad076b',
    },
    specialBtnWrapper: {
        backgroundColor: '#FFF',
    },
    normalBtnWrapper: {
        backgroundColor: ColorCore.black_01,
    },
    container: { flex: 1, backgroundColor: ColorCore.black_02 },
    keyboardView: {
        flexDirection: 'row',
        flex: 1,
        paddingTop: 2,
        paddingBottom: isIphoneX() ? 36 : 5,
        paddingHorizontal: 1.5,
    },
    textNormal: {
        color: ColorCore.black_17,
        fontSize: ScaleSize(24),
        fontWeight: '500',
    },
    textPink: {
        color: ColorCore.black_01,
        fontSize: ScaleSize(24),
        fontWeight: 'bold',
    },
    textEqual: {
        color: ColorCore.black_01,
        fontSize: ScaleSize(24),
        fontWeight: '600',
    },
});

const { CalculatorKeyboardModule } = NativeModules;

const REMOVE_ICON =
    'https://cdn.mservice.com.vn/app/icon/kits/chat_back_space.png';

const CALCULATOR_BUTTONS = [
    [
        {
            text: 'AC',
            icon: null,
            backgroundColor: ColorCore.pink_08,
            textWeight: 'bold',
            textStyle: {
                color: ColorCore.black_01,
                fontSize: ScaleSize(20),
                fontWeight: 'bold',
            },
        },
        {
            text: '÷',
            size: { width: 18, height: 18 },
            backgroundColor: ColorCore.pink_08,
            textStyle: styles.textPink,
        },
        {
            text: '×',
            size: { width: 14, height: 14 },
            backgroundColor: ColorCore.pink_08,
            textStyle: styles.textPink,
        },
    ],
    [
        { text: '7', icon: null, textStyle: styles.textNormal },
        { text: '8', icon: null, textStyle: styles.textNormal },
        { text: '9', icon: null, textStyle: styles.textNormal },
    ],
    [
        { text: '4', icon: null, textStyle: styles.textNormal },
        { text: '5', icon: null, textStyle: styles.textNormal },
        { text: '6', icon: null, textStyle: styles.textNormal },
    ],
    [
        { text: '1', icon: null, textStyle: styles.textNormal },
        { text: '2', icon: null, textStyle: styles.textNormal },
        { text: '3', icon: null, textStyle: styles.textNormal },
    ],
];

export default class KeyboardCalculator extends Component {
    constructor(props) {
        super(props);
        this.isOnkeyboardIn = true;
    }

    componentDidMount() {
        this.keyboardDidShowListener = Keyboard.addListener(
            'keyboardDidShow',
            this._keyboardDidShow,
        );
        this.keyboardDidHideListener = Keyboard.addListener(
            'keyboardDidHide',
            this._keyboardDidHide,
        );
    }

    componentWillUnmount() {
        this.keyboardDidShowListener.remove();
        this.keyboardDidHideListener.remove();
    }

    _keyboardDidHide = () => {};

    _keyboardDidShow = () => {};

    // onPress = (txt) => {
    //     if (txt === '+' || txt === '-' || txt === '×' || txt === '÷' || txt === 'REMOVE' || txt === 'AC' || txt === '=') DeviceEventEmitter.emit(Keys.CALULATOR_PUSH_KEY, txt);
    //     if (txt === 'REMOVE') {
    //         CalculatorKeyboardModule.backSpace();
    //     } else if (txt === 'AC') {
    //         CalculatorKeyboardModule.doDelete();
    //     } else if (txt === 'CLOSE') {
    //         DeviceEventEmitter.emit(Keys.CALCULATOR_DISMISS);
    //     } else if (txt === '=') {
    //         DeviceEventEmitter.emit(Keys.CALCULATOR_CALCULATE);
    //     } else {
    //         CalculatorKeyboardModule.insertText(txt);
    //     }
    // }

    onLongPressKeyboardBtn = (keyType) => {
        if (keyType === 'REMOVE') {
            this.autoBackSpace(keyType);
        } else {
            const { onPress } = this.props;
            if (typeof onPress === 'function') {
                onPress(keyType);
            }
        }
    };

    autoBackSpace = (keyType) => {
        if (this.isOnkeyboardIn) {
            this.onPressIn(keyType);
            setTimeout(() => {
                this.autoBackSpace(keyType);
            }, 200);
        }
    };

    onPressIn = (txt) => {
        this.isOnkeyboardIn = true;

        if (
            txt === '+' ||
            txt === '-' ||
            txt === '×' ||
            txt === '÷' ||
            txt === 'REMOVE' ||
            txt === 'AC' ||
            txt === '='
        )
            DeviceEventEmitter.emit(Keys.CALULATOR_PUSH_KEY, txt);
        if (txt === 'REMOVE') {
            CalculatorKeyboardModule.backSpace();
        } else if (txt === 'AC') {
            CalculatorKeyboardModule.doDelete();
        } else if (txt === 'CLOSE') {
            DeviceEventEmitter.emit(Keys.CALCULATOR_DISMISS);
        } else if (txt === '=') {
            DeviceEventEmitter.emit(Keys.CALCULATOR_CALCULATE);
        } else {
            CalculatorKeyboardModule.insertText(txt);
        }
    };

    onPressOut = () => {
        this.isOnkeyboardIn = false;
    };

    renderBtn = (params) => (
        <KeyButton
            key={params.text}
            onPressIn={this.onPressIn}
            onPressOut={this.onPressOut}
            onLongPress={this.onLongPressKeyboardBtn}
            // onPress={this.onPress}
            width={BUTTON_WIDTH}
            {...params}
        />
    );

    renderContent = () => (
        <View style={styles.keyboardView}>
            <View style={{ width: BUTTON_WIDTH * 3 + 2 * SEPERATOR_WIDTH }}>
                <Row>{CALCULATOR_BUTTONS[0].map(this.renderBtn)}</Row>
                <Row>{CALCULATOR_BUTTONS[1].map(this.renderBtn)}</Row>
                <Row>{CALCULATOR_BUTTONS[2].map(this.renderBtn)}</Row>
                <Row>{CALCULATOR_BUTTONS[3].map(this.renderBtn)}</Row>
                <Row>
                    {this.renderBtn({
                        width: BUTTON_WIDTH * 2 + 3,
                        text: '000',
                        textStyle: styles.textNormal,
                    })}
                    {this.renderBtn({
                        width: BUTTON_WIDTH,
                        text: '0',
                        textStyle: styles.textNormal,
                    })}
                </Row>
            </View>
            <View style={{ width: BUTTON_WIDTH, marginLeft: 3 }}>
                <View style={{ flex: 0.6 }}>
                    <Row>
                        {this.renderBtn({
                            width: BUTTON_WIDTH,
                            text: 'REMOVE',
                            backgroundColor: ColorCore.pink_08,
                            icon: REMOVE_ICON,
                            size: {
                                width: 24,
                                height: 24,
                                tintColor: ColorCore.black_01,
                            },
                        })}
                    </Row>
                    <Row>
                        {this.renderBtn({
                            width: BUTTON_WIDTH,
                            text: '-',
                            backgroundColor: ColorCore.pink_08,
                            textStyle: styles.textPink,
                        })}
                    </Row>
                    <Row>
                        {this.renderBtn({
                            width: BUTTON_WIDTH,
                            text: '+',
                            backgroundColor: ColorCore.pink_08,
                            textStyle: styles.textPink,
                        })}
                    </Row>
                </View>
                <View style={{ flex: 0.4 }}>
                    <Row>
                        {this.renderBtn({
                            width: BUTTON_WIDTH,
                            text: '=',
                            backgroundColor: ColorCore.pink_05_b,
                            textStyle: styles.textEqual,
                        })}
                    </Row>
                </View>
            </View>
        </View>
    );

    render() {
        return <View style={styles.container}>{this.renderContent()}</View>;
    }
}

KeyboardCalculator.propTypes = {
    onPress: PropTypes.func,
};

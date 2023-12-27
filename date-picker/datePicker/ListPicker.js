import React, { Component } from 'react';
import {
    Dimensions, StyleSheet, View
} from 'react-native';
import {
    Button, IconSource, TouchableOpacity, Text, Colors, Image, DeviceUtils, SwitchLanguage
} from '@momo-kits/core';
import WheelPicker from './WheelPicker';

const { isIphoneX } = DeviceUtils;

const widthScreen = Dimensions.get('window').width;

export default class ListPicker extends Component {
    constructor(props) {
        super(props);
        this.data = 0;
    }

    hide = () => {
        const { onClose, requestClose } = this.props;
        if (requestClose && typeof requestClose === 'function') {
            requestClose(() => {
                if (onClose && typeof onClose === 'function') {
                    onClose();
                }
            });
        }
    }

    onBeginDrag = () => {
        if (this.refs.picker) {
            this.refs.picker.setScrollEnabled(false);
        }
    }

    onEndDrag = () => {
        if (this.refs.picker) {
            this.refs.picker.setScrollEnabled(true);
        }
    }

    onChangeValue = (value) => {
        const { callback } = this.props;
        if (typeof callback === 'function') {
            callback(value);
        }
    }

    onPressClear = () => {
        this.hide();
    }

    onPressChoose = () => {
        this.onChangeValue(this.data);
        this.hide();
    }

    renderRight = () => (
        <TouchableOpacity
            onPress={this.onPressChoose}
        >
            <Text.Title style={{ fontWeight: 'bold', color: Colors.pink_05 }}>{SwitchLanguage.save}</Text.Title>
        </TouchableOpacity>
    );

    renderLeftIcon = () => (
        <TouchableOpacity onPress={() => this.hide()}>
            <Image
                source={IconSource.ic_close_x_24}
                style={{ width: 25, height: 25, tintColor: Colors.black_17 }}
            />
        </TouchableOpacity>
    );

    renderHeader() {
        const { title = '' } = this.props;
        return (
            <View style={styles.header}>
                {this.renderLeftIcon()}
                <Text style={styles.title}>
                    {title}
                </Text>
                {this.props.typeStyle === 'aboveAction' ? this.renderRight() : <View style={{ width: 25 }} />}
            </View>
        );
    }

    renderContent() {
        const { arrData = [], stylePicker, initValue } = this.props;
        return (
            <View style={styles.contentStyle}>
                <WheelPicker
                    stylePicker={stylePicker}
                    bottomOffset={1}
                    value={initValue}
                    key="picker"
                    ref="picker"
                    arrayValue={arrData}
                    onBeginDrag={this.onBeginDrag}
                    onEndDrag={this.onEndDrag}
                    onValueChange={(value) => {
                        this.data = value;
                    }}
                />

            </View>
        );
    }

    render() {
        return (
            <View style={styles.view}>
                {this.renderHeader()}
                {this.renderContent()}
                {
                    this.props.typeStyle === 'aboveAction'
                        ? null
                        : (
                            <View style={styles.btnView}>
                                <Button
                                    style={{ flex: 1 }}
                                    title={SwitchLanguage.cancel}
                                    buttonStyle={{ backgroundColor: Colors.second_text_color }}
                                    onPress={this.onPressClear}
                                />
                                <Button
                                    style={{ flex: 1, marginLeft: 15 }}
                                    title={SwitchLanguage.choose}
                                    type="primary"
                                    onPress={this.onPressChoose}
                                />
                            </View>
                        )
                }
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        width: widthScreen,
        alignItems: 'center',
        justifyContent: 'center'
    },
    contentStyle: {
        height: 230,
    },
    column: {
        borderWidth: 2,
        borderColor: 'red',
    },
    header: {
        flexDirection: 'row',
        height: 50,
        width: widthScreen,
        paddingHorizontal: 16,
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderColor: '#DADADA',
    },
    view: {
        backgroundColor: 'white',
        paddingBottom: 10 + (isIphoneX() ? 10 : 0)
    },
    title: {
        fontWeight: 'bold',
        color: Colors.black_17,
        flex: 1,
        fontSize: 16,
        textAlign: 'center'
    },
    titleCancel: {
        fontSize: 17,
        color: '#4A90E2'
    },
    titleConfirm: {
        fontSize: 17,
        color: '#4A90E2',
        textAlign: 'right'
    },
    btnView: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginHorizontal: 15,
        height: 60,
        alignItems: 'center'
    }
});

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import {
    View, StyleSheet, TouchableOpacity
} from 'react-native';
import { get } from 'lodash';
import {
    Text, NumberUtils, Colors, SwitchLanguage, Image, IconSource
} from '@momo-kits/core';

const styles = StyleSheet.create({
    container: {
        height: 48,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 12
    },
    descriptionView: {

    },
    icon: {
        width: 20,
        height: 20,
        tintColor: Colors.light_blue_grey_four
    },
    balanceAmountDescription: {

    },
    rightView: {
        position: 'absolute',
        right: 10,
        top: 6,
        bottom: 6,
        alignItems: 'flex-end',
    }
});

export default class Balance extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isShow: props.isShow,
            value: props.value || 0
        };
    }

    onPress = () => {
        const { isShow } = this.state;
        this.setState({ isShow: !isShow }, () => {
            const { onPress } = this.props;
            if (onPress && typeof onPress === 'function') onPress(!isShow);
        });
    }

    setBalance = (value) => {
        this.setState({ value });
    }

    render() {
        const { value, isShow } = this.state;
        const { style } = this.props;
        const vertical = get(style, 'paddingVertical', 6);
        const horizontal = get(style, 'paddingHorizontal', 12);
        return (
            <View style={[styles.container, style]}>
                <View style={[
                    styles.rightView,
                    { top: vertical, bottom: vertical },
                    { right: horizontal },
                    { justifyContent: isShow ? 'center' : 'flex-start' }
                ]}
                >
                    {isShow
                        ? (
                            <Text.H2>
                                {NumberUtils.formatNumberToMoney(value, SwitchLanguage.currencyUnit)}
                            </Text.H2>
                        )
                        : <Text.H3>******</Text.H3>}
                </View>
                <TouchableOpacity
                    activeOpacity={0.5}
                    onPress={this.onPress}
                >
                    <View style={styles.descriptionView}>
                        <Image style={styles.icon} source={IconSource.ic_eye_24} />
                        <Text.Title color={Colors.bluey_grey_70}>{SwitchLanguage.balance}</Text.Title>
                    </View>
                </TouchableOpacity>
                <View style={{ flex: 1 }} />
            </View>
        );
    }
}

Balance.propTypes = {
    isShow: PropTypes.bool,
    style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
    value: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
};

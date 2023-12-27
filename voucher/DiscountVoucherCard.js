import PropTypes from 'prop-types';
import React, { Component } from 'react';
import {
    View, StyleSheet, TouchableOpacity, Platform
} from 'react-native';

import {
    Text, IconSource, Colors, Image, SwitchLanguage, DatetimeUtil as Datetime
} from '@momo-kits/core';

const CARD_HEIGHT = 135;
const VERTICAL_OFFSET = Platform.OS === 'android' ? 25 : 30;

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    momoLogo: {
        width: 32,
        height: 32
    },
    logoView: {
        width: CARD_HEIGHT - VERTICAL_OFFSET / 2,
        justifyContent: 'center',
        alignItems: 'center',
        height: CARD_HEIGHT - VERTICAL_OFFSET
    },
    imageBackground: {
        height: CARD_HEIGHT,
        width: '100%',
        position: 'absolute'
    },
    title: {
        textAlign: 'center',
        color: Colors.faded_orange
    },
    contentView: {
        left: -20,
        paddingRight: 30,
        flex: 1,
        alignItems: 'center',
        paddingVertical: Platform.OS === 'android' ? 25 : 30,
        justifyContent: 'space-between'
    },
    date: {
        textAlign: 'center',
        color: Colors.second_text_color,
        marginBottom: Platform.OS === 'android' ? 0 : 10
    },
    selectIcon: {
        tintColor: Colors.dark_sky_blue,
        width: 20,
        height: 20
    },
    selectIconView: {
        width: 24,
        height: 24,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: Colors.dark_sky_blue,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        right: 20,
        top: 12
    }
});

export default class DiscountVoucherCard extends Component {
    onPress = () => {
        const { onPress, item } = this.props;
        if (onPress && typeof onPress === 'function') onPress(item);
    }

    render() {
        const { item, style } = this.props;
        if (!item) return <View />;
        const {
            name, selected, endDate, icon, body
        } = item;
        return (
            <TouchableOpacity activeOpacity={0.5} onPress={this.onPress}>
                <View style={[styles.container, style]}>
                    <Image resizeMode="contain" source={IconSource.ic_discount_voucher} style={styles.imageBackground} />
                    <View style={styles.logoView}>
                        <Image resizeMode="contain" source={{ uri: icon }} style={styles.momoLogo} />
                    </View>
                    <View style={styles.contentView}>
                        <Text.Title numberOfLines={3} style={styles.title}>{name}</Text.Title>
                        {body ? <Text.Title style={styles.date}>{body}</Text.Title> : (
                            <Text.Title style={styles.date}>
                                {`${SwitchLanguage.expDate}: ${Datetime.formatMillisecondToDate(endDate)}`}
                            </Text.Title>
                        )}
                    </View>
                    <View style={styles.selectIconView}>
                        {selected ? <Image source={IconSource.ic_check_24} style={styles.selectIcon} /> : <View />}
                    </View>
                </View>
            </TouchableOpacity>
        );
    }
}

DiscountVoucherCard.propTypes = {
    item: PropTypes.shape({
        uri: PropTypes.string,
        name: PropTypes.string,
        endDate: PropTypes.number,
        selected: PropTypes.bool
    }).isRequired,
    onPress: PropTypes.func,
    style: PropTypes.oneOfType([PropTypes.array, PropTypes.object])
};

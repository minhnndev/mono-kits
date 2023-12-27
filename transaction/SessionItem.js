import React, { Component } from 'react';
import {
    View,
    TouchableOpacity,
    StyleSheet,
    Image
} from 'react-native';
import {
    Text, Colors, ValueUtil, IconSource
} from '@momo-kits/core';
import { TRANSACTION_STATUS } from './TransactionHistoryHelper';

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 0,
    },
    ddmm: {
        color: Colors.black_12
    },
    icon: {
        marginRight: 10,
        height: 40,
        width: 40,
        borderWidth: 1,
        borderColor: '#D5D4D8',
        borderRadius: 40 / 2,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative'
    },
    statusText: {
        flex: 1,
        // fontSize: 12,
        color: '#222222'
    },
    contentWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        paddingBottom: 2.5,
        justifyContent: 'space-between'
    },
    transactionValue: {
        alignSelf: 'flex-end',
        fontSize: 14,
        fontWeight: 'bold',
        color: Colors.black_17
    },
    voucherIcon: {
        width: 16,
        height: 16,
        marginRight: 4
    },
    voucherValue: {
        textDecorationLine: 'line-through',
        alignSelf: 'flex-end',
        // fontSize: 12,
        color: '#8d919d'
    },
    description: {
        color: Colors.black_17,
        fontWeight: 'bold'
    },
    body: {
        justifyContent: 'space-between', paddingTop: 2.5,
    },
    flex: {
        flex: 1
    },
    content: {
        paddingVertical: 8,
        paddingRight: 15
    },
    success: {
        color: Colors.success,
    },
    fail: {
        color: Colors.error
    },
    processing: {
        color: Colors.orange_05
    },
    iconRound: {
        width: 24,
        height: 24,
        resizeMode: 'contain'
    },
    contentView: {
        borderWidth: 0,
        flex: 1,
        justifyContent: 'space-between'
    },
    container: {
        paddingLeft: 15,
    }
});

export default class SessionItem extends Component {
    mapResultTextStyle = (resultStatus) => {
        if (resultStatus === TRANSACTION_STATUS.SUCCESS) {
            return styles.success;
        } if (resultStatus === TRANSACTION_STATUS.FAIL) {
            return styles.fail;
        } if (resultStatus === TRANSACTION_STATUS.PROCESSING) {
            return styles.processing;
        }
    }

    render() {
        const {
            description,
            time,
            statusText,
            icon,
            isApplyVoucher,
            voucherValue,
            transactionValue,
            onPress,
            resultStatus
        } = this.props;
        const iconSource = ValueUtil.getImageSource(icon);
        const resultTextStyle = this.mapResultTextStyle(resultStatus);
        return (
            <TouchableOpacity
                onPress={onPress}
                style={styles.container}
            >
                <View style={[styles.row, styles.content]}>
                    <View style={[styles.icon]}>
                        <Image source={iconSource} style={styles.iconRound} />
                    </View>
                    <View style={styles.contentView}>
                        <Text.Title style={styles.description}>{description}</Text.Title>
                        <View style={[styles.row, styles.body]}>
                            <View style={styles.flex}>
                                <View style={styles.contentWrapper}>
                                    <Text.SubTitle style={[styles.ddmm]}>{time}</Text.SubTitle>
                                    {isApplyVoucher
                                        ? (
                                            <Text.SubTitle style={styles.voucherValue}>
                                                {voucherValue}
                                            </Text.SubTitle>
                                        ) : <View />}
                                </View>

                                <View style={styles.contentWrapper}>
                                    <Text.SubTitle style={[styles.statusText, resultTextStyle]}>{statusText}</Text.SubTitle>
                                    {isApplyVoucher
                                        ? (
                                            <Image
                                                source={IconSource.ic_momo_gift}
                                                style={[styles.voucherIcon]}
                                            />
                                        ) : <View />}
                                    <Text.SubTitle style={styles.transactionValue}>{transactionValue}</Text.SubTitle>
                                </View>
                            </View>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        );
    }
}

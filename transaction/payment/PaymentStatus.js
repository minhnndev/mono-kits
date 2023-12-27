import React from 'react';
import {
    View,
    StyleSheet,
    Dimensions
} from 'react-native';
import {
    Spacing,
    Colors,
    ScaleSize,
    Text,
    Image,
    Radius,
} from '@momo-kits/core';
import LottieView from '@momo-kits/lottie';
import Skeleton from '@momo-kits/skeleton';

import CommonUtils from '../utils/CommonUtils';
import TransactionStatus from '../utils/TransactionStatus';
import I18n from '../utils/I18n';
import ImageAssets from '../utils/ImageAssets';
import anim_pending from '../assets/anim_pending.json';

const { FAIL, SUCCESS, PROCESSING } = TransactionStatus;
const FONT_WEIGHT_BOLD = CommonUtils.getFontWeightMedium();
const ICON_SIZE = 48;

const { width } = Dimensions.get('window');

const PaymentStatus = (props) => {
    const {
        data,
        isShowWalletBalance,
        fixMargin,
        billIndex = '',
        isLoading,
        isMultiBill
    } = props;
    const {
        postBalance, resultStatus, showTotalOriginalAmount, totalOriginalAmount, totalAmount
    } = data || {};

    if (isLoading) {
        return (
            <View style={styles.container}>
                <View style={[styles.content, { marginBottom: fixMargin ? Spacing.M : Spacing.ZERO }]}>
                    <Skeleton.Media size={ICON_SIZE} style={styles.iconStatus} />
                    <View style={stylesLoading.contentStatus}>
                        <Skeleton.Line style={stylesLoading.status} />
                        <Skeleton.Line style={stylesLoading.totalAmount} />
                    </View>
                </View>
            </View>
        );
    }

    const getStatusText = () => {
        let result = I18n.status_pending;
        if (resultStatus === SUCCESS) {
            result = I18n.status_success;
        }
        if (resultStatus === FAIL) {
            result = I18n.status_fail;
        }

        return result;
    };

    const getIconByStatus = () => {
        const icon = { uri: ImageAssets.ic_payment_result_pending };
        if (resultStatus === SUCCESS) {
            icon.uri = ImageAssets.ic_success;
        }
        if (resultStatus === FAIL) {
            icon.uri = ImageAssets.ic_fail;
        }
        return icon;
    };

    const getWalletBallance = () => CommonUtils.formatNumberToMoney(postBalance);

    const renderTotalValue = () => {
        if (!showTotalOriginalAmount) {
            return null;
        }
        return (
            <Text.Title style={styles.originalAmount}>{CommonUtils.formatNumberToMoney(totalOriginalAmount)}</Text.Title>
        );
    };

    const renderWalletBalance = () => !!isShowWalletBalance && (
        <View style={styles.contenWallet}>
            <Text.Title style={styles.titleWallet}>
                {I18n.walletBalance}
            </Text.Title>
            <Text.H4 style={styles.wallet}>
                {getWalletBallance()}
            </Text.H4>
        </View>
    );

    const renderBillIndex = () => !!billIndex && (
        <Text.Caption style={styles.caption}>
            {I18n.transaction.concat(' ', billIndex)}
        </Text.Caption>
    );

    const renderStatusIcon = () => {
        if (resultStatus === PROCESSING && isMultiBill) {
            return (
                <LottieView
                    source={anim_pending}
                    autoPlay
                    autoSize
                    loop
                    style={styles.iconStatus}
                />
            );
        }

        return <Image style={styles.iconStatus} source={getIconByStatus()} />;
    };

    return (
        <View style={styles.container}>
            <View style={[styles.content, { marginBottom: fixMargin ? Spacing.M : Spacing.ZERO }]}>
                {renderStatusIcon()}
                <View style={styles.flex}>
                    <View style={styles.contentStatus}>
                        <Text.Title style={styles.status}>
                            {getStatusText()}
                        </Text.Title>
                        {renderBillIndex()}
                    </View>
                    <View style={styles.contentAmount}>
                        <Text.Title style={styles.totalAmount}>
                            {CommonUtils.formatNumberToMoney(totalAmount)}
                        </Text.Title>
                        {renderTotalValue()}
                    </View>
                </View>
            </View>
            {renderWalletBalance()}
        </View>
    );
};

const styles = StyleSheet.create({
    flex: {
        flex: 1,
    },
    content: {
        flexDirection: 'row',
    },
    contentStatus: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    contentAmount: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'flex-end',
    },
    container: {
        padding: Spacing.M,
        paddingBottom: Spacing.ZERO,
    },
    contenWallet: {
        paddingVertical: Spacing.S,
        paddingHorizontal: Spacing.M,
        borderRadius: Radius.M,
        backgroundColor: Colors.solid_black_bl_2,
        flexDirection: 'row',
    },
    titleWallet: {
        fontSize: ScaleSize(14),
        lineHeight: ScaleSize(20),
        color: Colors.black_12,
        flex: 1
    },
    wallet: {
        fontSize: ScaleSize(14),
        lineHeight: ScaleSize(20),
        color: Colors.black_17,
        textAlign: 'right',
        fontWeight: FONT_WEIGHT_BOLD,
        flex: 1
    },
    totalAmount: {
        fontSize: ScaleSize(16),
        lineHeight: ScaleSize(22),
        color: Colors.black_17,
        fontWeight: FONT_WEIGHT_BOLD,
        marginRight: Spacing.M,
        marginBottom: Spacing.XXS
    },
    originalAmount: {
        fontSize: ScaleSize(14),
        lineHeight: ScaleSize(20),
        color: Colors.black_12,
        textDecorationLine: 'line-through',
        textDecorationStyle: 'solid',
    },
    status: {
        fontSize: ScaleSize(14),
        lineHeight: ScaleSize(20),
        color: Colors.black_17,
        fontWeight: FONT_WEIGHT_BOLD,
    },
    iconStatus: {
        height: ICON_SIZE,
        width: ICON_SIZE,
        marginRight: Spacing.M,
    },
    caption: {
        fontSize: ScaleSize(10),
        lineHeight: ScaleSize(14),
        borderRadius: 9,
        color: Colors.black_17,
        backgroundColor: Colors.black_03,
        paddingHorizontal: Spacing.S,
        paddingVertical: Spacing.XXS,
        overflow: 'hidden'
    }
});

const stylesLoading = StyleSheet.create({
    contentStatus: {
        flex: 1,
        justifyContent: 'space-evenly'
    },
    status: {
        width: width / 3,
        height: ScaleSize(10),
        marginBottom: Spacing.ZERO,
    },
    totalAmount: {
        width: width * 2 / 3,
        height: ScaleSize(12),
        marginBottom: Spacing.ZERO,
    }
});

export default React.memo(PaymentStatus);

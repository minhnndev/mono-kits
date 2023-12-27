import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Spacing, Colors, ScaleSize } from '@momo-kits/core';
import { MessageInformation } from '@momo-kits/message';
import Skeleton from '@momo-kits/skeleton';

import ImageAssets from '../utils/ImageAssets';
import TransactionStatus from '../utils/TransactionStatus';

const PaymentMessage = (props) => {
    const { data = {}, style = {}, isLoading } = props || {};

    const { message = '', status } = data || {};

    if (isLoading) {
        return (
            <View style={styles.container}>
                <Skeleton.Line
                    style={styles.loading}
                />
            </View>
        );
    }

    const getIconSource = () => {
        if (status === TransactionStatus.SUCCESS) {
            return ImageAssets.ic_tranhis_status_result_payment_success;
        }
        return ImageAssets.ic_tranhis_status_result_payment_fail;
    };

    const getIconStyles = () => {
        const _styles = {
            tintColor: Colors.sepia_05,
        };
        if (status === TransactionStatus.SUCCESS) {
            _styles.tintColor = Colors.blue_04;
        }
        return _styles;
    };

    const getContainerStyles = () => {
        const _styles = {
            backgroundColor: Colors.orange_10,
        };
        if (status === TransactionStatus.SUCCESS) {
            _styles.backgroundColor = Colors.indigo_10;
        }
        return _styles;
    };

    if (!message) {
        return null;
    }

    const styleIcon = getIconStyles();

    return (
        <MessageInformation
            style={[styles.container, style, getContainerStyles()]}
            hideCloseIcon
            numberOfLineWhenShorten={3}
            expandable={false}
            message={message}
            icon={getIconSource()}
            tintColor={styleIcon.tintColor}
            iconSize="small"
            resizeMode="contain"
        />
    );
};

const styles = StyleSheet.create({
    container: {
        margin: Spacing.M,
        marginVertical: Spacing.ZERO
    },
    title: {
        fontSize: ScaleSize(12),
        lineHeight: ScaleSize(16),
    },
    loading: {
        height: 56, width: '100%'
    }
});

export default React.memo(PaymentMessage);

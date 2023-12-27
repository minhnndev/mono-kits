import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, Spacing } from '@momo-kits/core';
import Skeleton from '@momo-kits/skeleton';

const PaymentCTA = (props) => {
    const { btnLeft, btnRight, isLoading } = props || {};

    if (isLoading) {
        return (
            <View style={styles.containerLoading}>
                <Skeleton.Line style={styles.btnLoadingLeft} />
                <Skeleton.Line style={styles.btnLoadingRight} />
            </View>
        );
    }

    const renderBtn = (btnProps) => {
        if (!btnProps) {
            return null;
        }

        const text = btnProps?.text || '';
        const type = btnProps?.type || 'secondary';
        const onPress = typeof btnProps?.onPress === 'function'
            ? btnProps?.onPress
            : () => { };

        const renderMargin = () => btnProps?.hasMargin && <View style={{ width: Spacing.M }} />;

        return (
            <>
                <View style={styles.content}>
                    <Button
                        size="medium"
                        title={text}
                        type={type}
                        onPress={onPress}
                    />
                </View>
                {renderMargin()}
            </>
        );
    };

    if (!btnLeft && !btnLeft) return <View style={styles.containerEmpty} />;

    return (
        <View style={styles.container}>
            {renderBtn(btnLeft)}
            {renderBtn(btnRight)}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: Spacing.M,
        paddingTop: Spacing.ZERO,
        flexDirection: 'row',
    },
    containerEmpty: {
        height: Spacing.M
    },
    content: {
        flex: 1,
    },
    containerLoading: {
        padding: Spacing.M,
        paddingTop: Spacing.ZERO,
        flexDirection: 'row',

        justifyContent: 'space-between'
    },
    btnLoadingLeft: {
        height: 36,
        flex: 1,
        marginRight: Spacing.M,
        marginBottom: Spacing.ZERO
    },
    btnLoadingRight: {
        height: 36,
        flex: 1,
        marginLeft: Spacing.M,
        marginBottom: Spacing.ZERO
    }

});

export default React.memo(PaymentCTA);

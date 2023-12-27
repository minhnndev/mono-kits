import { Image, ScaleSize, Spacing, Text } from '@momo-kits/core';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import ImageAssets from './ImageAssets';
import ExpenseI18n from './ExpenseI18n';

const EmptyChart = (props, ref) => {
    const { onLayout } = props || {};
    return (
        <View onLayout={onLayout} ref={ref} style={styles.container}>
            <Image
                source={{ uri: ImageAssets.empty_chart }}
                style={styles.icon}
            />
            <Text.Title style={styles.title}>
                {ExpenseI18n.noDataTitle}
            </Text.Title>
            <Text.Title style={styles.description}>
                {ExpenseI18n.noDataDescription}
            </Text.Title>
        </View>
    );
};

export default React.memo(React.forwardRef(EmptyChart));

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        // justifyContent: 'center',
        marginBottom: Spacing.XS,
        paddingBottom: ScaleSize(17),
    },
    icon: {
        width: ScaleSize(80),
        height: ScaleSize(80),
        marginTop: Spacing.L,
    },
    title: {
        fontWeight: 'bold',
        marginTop: Spacing.M,
    },
    description: {
        marginTop: Spacing.XXS,
    },
});

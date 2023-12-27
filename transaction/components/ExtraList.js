import React from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';
import { Colors, Spacing, ScaleSize } from '@momo-kits/core';
import Skeleton from '@momo-kits/skeleton';

import CommonUtils from '../utils/CommonUtils';
import TwoTextRow from './TwoTextRow';

const { width } = Dimensions.get('window');

const ExtraList = (props) => {
    const {
        data,
        isLoading,
        style = {}
    } = props || {};

    if (isLoading) {
        return (
            <View style={[styles.container, style]}>
                <View style={styles.contentLoading}>
                    <Skeleton.Line style={styles.lineLong} />
                    <Skeleton.Line style={styles.lineLong} />

                </View>
                <View style={styles.contentLoading}>
                    <Skeleton.Line style={styles.lineLong} />
                    <Skeleton.Line style={styles.lineShort} />
                </View>
            </View>
        );
    }

    if (!CommonUtils.isArrayNotEmpty(data)) return null;

    const getValueStyle = (item) => {
        const _valueStyle = CommonUtils.isObject(item?.valueStyle)
            ? item?.valueStyle
            : {};

        if (typeof item?.onPress === 'function') {
            return { ...styles.link, ..._valueStyle };
        }

        return _valueStyle;
    };

    const getIconStyle = (icon, onPress) => {
        const _iconStyle = CommonUtils.isObject(icon?.style)
            ? icon?.style
            : {};

        if (typeof onPress === 'function') {
            return { ...styles.link, ..._iconStyle };
        }

        return _iconStyle;
    };

    const renderItemExtra = (item, index, arr) => {
        const key = `${index}`;
        const title = item?.title || '';
        const value = item?.value || '';
        const divider = index !== arr?.length - 1;
        const onPress = typeof item?.onPress === 'function' ? item?.onPress : () => { };
        const icon = item?.icon?.source || '';
        const onPressLeft = typeof item?.onPressLeft === 'function' ? item?.onPressLeft : () => { };
        const iconLeft = item?.iconLeft?.source || '';

        return (
            <TwoTextRow
                key={key}
                title={title}
                value={value}
                divider={divider}
                boldValue
                selectableValue
                onPress={onPress}
                onPressLeft={onPressLeft}
                valueStyle={getValueStyle(item)}
                iconRight={icon}
                iconLeft={iconLeft}
                iconStyle={getIconStyle(item?.icon, onPress)}
                iconLeftStyle={getIconStyle(item?.iconLeft, onPressLeft)}
            />
        );
    };

    return (
        <View style={[styles.container, style]}>
            {data?.map(renderItemExtra)}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: Spacing.M
    },
    link: {
        color: Colors.pink_05_b,
    },
    contentLoading: {
        paddingTop: Spacing.M, flexDirection: 'row', justifyContent: 'space-between'
    },
    lineLong: {
        height: ScaleSize(12), width: width / 3
    },
    lineShort: {
        height: ScaleSize(12), width: width / 4
    }
});

export default React.memo(ExtraList);

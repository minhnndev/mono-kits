import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Radius, Spacing, Colors } from '@momo-kits/core';

import PaymentBreakline from './PaymentBreakline';
import TwoTextRow from '../components/TwoTextRow';
import I18n from '../utils/I18n';
import ImageAssets from '../utils/ImageAssets';
import TYPE from '../utils/BreakLineType';
import ExtraList from '../components/ExtraList';

const PaymentFooter = (props) => {
    const {
        backgroundColor, itemWidth, postBalance = '', isLoading
    } = props || {};
    const [isShowWallet, setIsShowWallet] = React.useState(true);

    if (isLoading) {
        return (
            <View style={[styles.container, { width: itemWidth }]}>
                <PaymentBreakline
                    backgroundColor={backgroundColor}
                    type={TYPE.CIRCLE_TOP}
                    itemWidth={itemWidth}
                />
                <ExtraList isLoading style={styles.content} />
            </View>
        );
    }

    return (
        <View style={[styles.container, { width: itemWidth }]}>
            <PaymentBreakline
                backgroundColor={backgroundColor}
                type={TYPE.CIRCLE_TOP}
                itemWidth={itemWidth}
            />
            <View style={styles.content}>
                <TwoTextRow
                    title={I18n.sourceName}
                    value={I18n.momoWallet}
                    boldValue
                    divider
                />
                <TwoTextRow
                    title={I18n.walletBalance}
                    value={isShowWallet ? '************' : postBalance}
                    iconLeft={isShowWallet ? ImageAssets.ic_eye_v2_off : ImageAssets.ic_eye_v2_on}
                    onPressLeft={() => setIsShowWallet((val) => !val)}
                    iconLeftStyle={styles.icon}
                    boldValue
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.white,
        borderRadius: Radius.M,
        marginTop: Spacing.XXS,
    },
    content: { paddingHorizontal: Spacing.M, paddingVertical: Spacing.XS },
    icon: {
        marginLeft: Spacing.XS, alignSelf: 'center', tintColor: Colors.black_12
    }
});

export default React.memo(PaymentFooter);

import React from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import { Spacing } from '@momo-kits/core';
import PaymentFooter from './PaymentFooter';
import PaymentListItem from './PaymentListItem';
import CommonUtils from '../utils/CommonUtils';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const MARGIN_HORIZONTAL_GUIDE = Spacing.L;
const ITEM_WIDTH = SCREEN_WIDTH - MARGIN_HORIZONTAL_GUIDE * 2;

const PaymentWidgetList = (props) => {
    const {
        data = [],
        renderMainContent,
        renderCollapsedContent,
        renderExtraList,
        renderMessage,
        renderCTA,
        onPressDetail,
        backgroundColor,
        isMultiBill
    } = props || {};

    const isLoading = !CommonUtils.isArrayNotEmpty(data);

    const getBillIndex = (index) => {
        if (data?.length > 1) return (index + 1);
        return 0;
    };

    const renderItem = (item, index) => (
        <View key={index?.toString()} style={{ paddingBottom: index !== data?.length - 1 ? Spacing.XXS : Spacing.ZERO }}>
            <PaymentListItem
                initialExpanded={!index}
                itemWidth={ITEM_WIDTH}
                data={item}
                renderMainContent={renderMainContent}
                renderCollapsedContent={renderCollapsedContent}
                renderExtraList={renderExtraList}
                renderMessage={renderMessage}
                renderCTA={renderCTA}
                onPressDetail={onPressDetail}
                backgroundColor={backgroundColor}
                hideBreaklineTop={!index}
                billIndex={getBillIndex(index)}
                isLoading={isLoading}
                isMultiBill={isMultiBill}
            />
        </View>

    );

    const getPostBalance = () => CommonUtils.formatNumberToMoney(data?.[0]?.postBalance);

    const renderData = () => (!isLoading ? data?.map(renderItem) : renderItem());

    return (
        <View style={styles.container}>
            {renderData()}
            <PaymentFooter
                backgroundColor={backgroundColor}
                itemWidth={ITEM_WIDTH}
                postBalance={getPostBalance()}
                isLoading={isLoading}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { marginVertical: MARGIN_HORIZONTAL_GUIDE, alignItems: 'center' },
});

export default React.memo(PaymentWidgetList);

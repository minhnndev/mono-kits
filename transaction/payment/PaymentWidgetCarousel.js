import { Spacing, Colors } from '@momo-kits/core';
import React, { useState } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import { Carousel, Pagination } from '@momo-kits/carousel';
import PaymentCarouselItem from './PaymentCarouselItem';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const MARGIN_HORIZONTAL_GUIDE = Spacing.L;
const ITEM_WIDTH_CONTAINER = SCREEN_WIDTH - Spacing.M - Spacing.S;
const ITEM_WIDTH = SCREEN_WIDTH - MARGIN_HORIZONTAL_GUIDE * 2;
const DOT_COLOR = 'rgba(0, 0, 0, 0.25)';
const INACTIVE_DOT_OPACITY = 0.7;
const INACTIVE_DOT_SCALE = 1;

const PaymentWidgetCarousel = (props) => {
    const {
        data = [],
        onChange,
        renderMainContent,
        renderExtraList,
        renderMessage,
        renderCTA,
        onPressDetail,
        backgroundColor,
    } = props || {};

    const [billIndex, setBillIndex] = useState(0);
    const [expandedBill, setExpandBill] = useState(false);
    const isMutliBill = data?.length > 1;

    const _onChange = () => {
        setExpandBill((val) => !val);
        if (typeof onChange === 'function') onChange?.();
    };

    const renderItem = ({ item }) => (
        <View style={styles.containerItem}>
            <PaymentCarouselItem
                itemWidth={ITEM_WIDTH}
                data={item}
                expanded={expandedBill}
                onChange={_onChange}
                renderMainContent={renderMainContent}
                renderExtraList={renderExtraList}
                renderMessage={renderMessage}
                renderCTA={renderCTA}
                onPressDetail={onPressDetail}
                backgroundColor={backgroundColor}
            />
        </View>
    );

    const onSnapToItem = (index) => setBillIndex(index);

    const renderPagination = () => {
        if (!isMutliBill) {
            return null;
        }

        return (
            <Pagination
                activeDotIndex={billIndex}
                dotsLength={data?.length || 0}
                containerStyle={styles.containerPagination}
                inactiveDotStyle={styles.dotStyle}
                inactiveDotScale={INACTIVE_DOT_SCALE}
                inactiveDotOpacity={INACTIVE_DOT_OPACITY}
                dotContainerStyle={styles.dotContainerStyle}
                dotStyle={styles.dotStyle}
            />
        );
    };

    return (
        <View style={styles.container}>
            {renderPagination()}
            <Carousel
                data={data}
                renderItem={renderItem}
                itemWidth={ITEM_WIDTH_CONTAINER}
                sliderWidth={SCREEN_WIDTH}
                decelerationRate={0.9}
                removeClippedSubviews={false}
                inactiveSlideScale={1}
                inactiveSlideOpacity={1}
                onSnapToItem={onSnapToItem}
                scrollEnabled={isMutliBill}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { marginVertical: MARGIN_HORIZONTAL_GUIDE },
    containerPagination: { marginBottom: Spacing.M },
    containerItem: { paddingLeft: Spacing.M / 2 },
    inactiveDotStyle: {
        paddingHorizontal: Spacing.ZERO,
        paddingVertical: Spacing.ZERO,
        height: Spacing.XS,
        backgroundColor: DOT_COLOR,
    },
    dotStyle: {
        height: Spacing.XS,
        width: Spacing.L,
        backgroundColor: Colors.white,
    },
    dotContainerStyle: { marginHorizontal: Spacing.XS },
});

export default React.memo(PaymentWidgetCarousel);

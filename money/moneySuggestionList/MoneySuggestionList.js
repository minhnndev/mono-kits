/* eslint-disable react/no-unused-prop-types */
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { get } from 'lodash';
import {
    View, StyleSheet, TouchableOpacity, FlatList, Dimensions
} from 'react-native';
import {
    Text, NumberUtils, Colors, Button, Spacing
} from '@momo-kits/core';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const PADDING_HORIZONTAL = Spacing.M;
const SEPARATE_ITEM = Spacing.XS;

const DEFAULT_AMOUNT = [1000, 3000, 6000];

const LIST_MAX_WIDTH = SCREEN_WIDTH - 70;
const ITEM_WIDTH_1 = (LIST_MAX_WIDTH - PADDING_HORIZONTAL * 2 - SEPARATE_ITEM * 2) / 3;
const ITEM_WIDTH_2 = (SCREEN_WIDTH - PADDING_HORIZONTAL * 2 - SEPARATE_ITEM * 2) / 3;
const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    amountBlock: {
        backgroundColor: Colors.black_03,
        flex: 1,
        paddingVertical: 4,
        borderRadius: 8,
        minHeight: 30,
        alignItems: 'center',
        justifyContent: 'center'
    },
    amount: {
        textAlign: 'center',
        color: Colors.black_17
    },
    separateItem: {
        width: SEPARATE_ITEM
    },
    listContainerStyle: {
        paddingHorizontal: PADDING_HORIZONTAL,
        height: 30,
    }
});

export default class MoneySuggestionList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isShow: props.isShow || false
        };
        this.moneySuggestionData = [];
    }

    show = () => this.setState({ isShow: true });

    hide = () => this.setState({ isShow: false });

    onPress = (calculatedAmount) => {
        const { onPress } = this.props;
        if (onPress && typeof onPress === 'function') onPress(calculatedAmount);
    }

    renderAmountBlock = ({ item, index }) => {
        const {
            onPress, max, calculating, rightButton, itemTextStyle, itemContainerStyle,
            hitSlop = {
                top: 5, left: 5, right: 5, bottom: 5
            },
        } = this.props;
        const firstItemCalculating = calculating && index === 0;
        const amountRender = firstItemCalculating ? item.amount : item.calculatedAmount;
        const amountFormatted = NumberUtils.formatNumberToMoney(amountRender);
        if (item.calculatedAmount > max) return <View />;
        let width = ITEM_WIDTH_2;
        if (rightButton) { width = ITEM_WIDTH_1; }
        return (
            <TouchableOpacity
                hitSlop={hitSlop}
                onPress={() => this.onPress(firstItemCalculating ? item.amount : item.calculatedAmount)}
                activeOpacity={onPress ? 0.5 : 1}
            >
                <View style={[styles.amountBlock, { width }, itemContainerStyle]}>
                    <Text weight='bold' style={[styles.amount, itemTextStyle]}>
                        {firstItemCalculating ? `= ${amountFormatted}` : amountFormatted}
                    </Text>
                </View>
            </TouchableOpacity>
        );
    }

    initAmountData = (amount) => {
        const data = [];
        const {
            min, max, calculating
        } = this.props;
        const defaultData = get(this.props, 'defaultData', DEFAULT_AMOUNT);

        if (amount !== '' && amount !== 0) {
            let power = 0;
            const lessThanMin = amount < min;
            if (lessThanMin && calculating) power = 1;
            else if (lessThanMin && !calculating) power = 2;
            else if (!lessThanMin && calculating) power = -1;
            else power = 0;
            const lessThanMinCount = lessThanMin ? 1 : 0;
            for (let i = 1; i <= 3 + lessThanMinCount; i += 1) {
                const calculatedAmount = amount * (10 ** (power + i));
                if (min <= calculatedAmount && calculatedAmount <= max) {
                    data.push({
                        amount,
                        calculatedAmount
                    });
                }
            }
        }
        if (amount === 0) {
            this.moneySuggestionData = [];
        } else {
            this.moneySuggestionData = data.splice(0, 3);
        }

        return this.moneySuggestionData.length > 0 ? this.moneySuggestionData : (defaultData.map((calculatedAmount) => ({ calculatedAmount, amount: calculatedAmount })));
    }

    renderSeparateItem = () => <View style={styles.separateItem} />;

    render() {
        const { isShow } = this.state;
        if (!isShow) return <View />;
        const {
            amount, style, rightButton, onButtonPress, listContainerStyle
        } = this.props;
        const amountData = this.initAmountData(amount);
        return (
            <View style={[styles.container, style]}>
                <View style={[
                    { width: rightButton ? LIST_MAX_WIDTH : SCREEN_WIDTH },
                    styles.listContainerStyle, listContainerStyle
                ]}
                >
                    <FlatList
                        keyboardShouldPersistTaps="handled"
                        keyExtractor={(i, index) => index.toString()}
                        ItemSeparatorComponent={this.renderSeparateItem}
                        data={amountData}
                        renderItem={this.renderAmountBlock}
                        horizontal
                        scrollEnabled={false}
                        showsHorizontalScrollIndicator={false}
                    />
                </View>
                {rightButton ? <Button onPress={onButtonPress} size="small" title={rightButton} /> : <View />}
            </View>
        );
    }
}

MoneySuggestionList.propTypes = {
    amount: PropTypes.number,
    onPress: PropTypes.func,
    style: PropTypes.object,
    min: PropTypes.number,
    max: PropTypes.number,
    calculating: PropTypes.bool,
    defaultData: PropTypes.arrayOf(PropTypes.number),
    rightButton: PropTypes.string,
    onButtonPress: PropTypes.func,
    itemTextStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.any]),
    itemContainerStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.any]),
    listContainerStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.any])
};

MoneySuggestionList.defaultProps = {
    min: 1000,
    max: 20000000,
    defaultData: undefined
};

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import {
    FlatList, View, StyleSheet, TouchableOpacity
} from 'react-native';
import {
    LocalizedStrings, SwitchLanguage, Text, Colors, DatetimeUtil, NumberUtils, Spacing
} from '@momo-kits/core';
import SessionItem from './SessionItem';
import TransactionHistoryHelper from './TransactionHistoryHelper';

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        paddingHorizontal: 15,
        justifyContent: 'space-between',
        paddingVertical: 10,
        backgroundColor: 'white',
    },
    headerTitle: {
        color: Colors.black_14
    },
    headerViewAll: {
        color: Colors.blue_04
    },
    list: {
        backgroundColor: 'white'
    },
    session: {
        backgroundColor: Colors.black_05,
        paddingVertical: Spacing.XS,
        justifyContent: 'space-between',
        flexDirection: 'row',
        paddingHorizontal: Spacing.M
    },
    sessionMonth: {
        color: Colors.black_17,
    }
});

const SUCCESS = 1;
const TRANSFER_GIFT = 39; // gửi curVoucher
// eslint-disable-next-line no-template-curly-in-string
const KEY_SERVICE_NAME = '${serviceName}';

export default class TransactionHistoryList extends Component {
    constructor(props) {
        super(props);
        this.monthMap = {};
        this.totalByMonth = {};
    }

    onPress = (item, index) => {
        const { onItemPress } = this.props;
        if (onItemPress && typeof onItemPress === 'function') {
            onItemPress(item, index);
        }
    }

    renderItem = ({ item, index }) => {
        const {
            lastUpdate,
            status,
            icon,
            useVoucher,
            amount,
            originalAmount,
            io,
            tranType,
            error,
            serviceName,
            customName,
            tranData = '[]'
        } = item;
        const { amountTitle } = this.props;
        let tranDataArray = [];
        try {
            tranDataArray = JSON.parse(tranData);
        } catch (e) {
            //
        }
        const tranName = tranDataArray.find((tran) => tran.transactionName);
        const tranDesc = tranDataArray.find((tran) => tran.transactionDesc);
        let name = customName || SwitchLanguage.Payment.replace(KEY_SERVICE_NAME, serviceName);
        if (tranDesc) {
            name = LocalizedStrings.getLocalize(tranDesc.transactionDesc);
        } else if (tranName) {
            const localizedName = LocalizedStrings.getLocalize(tranName.transactionName);
            name = SwitchLanguage.Payment.replace(KEY_SERVICE_NAME, localizedName);
        }
        const dateObject = DatetimeUtil.getDate(lastUpdate);
        const {
            hour, minute, day, month
        } = dateObject;
        const time = `${day}/${month} - ${hour}:${minute}`;
        const isApplyVoucher = useVoucher !== 0;
        let realValue = NumberUtils.formatNumberToMoney(amount, SwitchLanguage.currencyUnit);
        let voucherValue = NumberUtils.formatNumberToMoney(originalAmount, SwitchLanguage.currencyUnit);
        const resultStatus = TransactionHistoryHelper.getResultTransaction(error, tranType, status);
        const statusText = TransactionHistoryHelper.getStatusText(resultStatus);

        if (resultStatus === SUCCESS) {
            if (io === -1) {
                realValue = `-${realValue}`;
            } else {
                realValue = `+${realValue}`;
            }
        }
        if (tranType === TRANSFER_GIFT) {
            voucherValue = '';
        }
        const onPress = () => this.onPress(item, index);

        const tranView = (
            <SessionItem
                description={name}
                time={time}
                icon={icon}
                resultStatus={resultStatus}
                statusText={statusText}
                isApplyVoucher={isApplyVoucher}
                voucherValue={voucherValue}
                transactionValue={realValue}
                onPress={onPress}
            />
        );

        const amountByMonth = [];
        if (amountTitle) {
            amountByMonth.push(amountTitle);
        }
        amountByMonth.push(NumberUtils.formatNumberToMoney(this.totalByMonth[item.key], SwitchLanguage.currencyUnit));

        if (item.header) {
            return (
                <View style={styles.session}>
                    <Text.H4 style={styles.sessionMonth} weight="medium">
                        {`${SwitchLanguage.Month} ${item.title}`}
                    </Text.H4>
                    <Text>
                        {amountByMonth.join(' ')}
                    </Text>
                </View>
            );
        }
        return tranView;
    }

    getFlatListRef = () => this.transactionList

    viewAll = () => {
        const { onViewAllPress } = this.props;
        if (onViewAllPress && typeof onViewAllPress === 'function') onViewAllPress();
    }

    renderItemSeperator = () => <View style={{ height: 1, backgroundColor: '#ebebeb' }} />

    processData = (data = []) => {
        const dataWithHeader = [];
        this.monthMap = {};
        this.totalByMonth = {};
        data.forEach((item) => {
            const {
                error, tranType, status, lastUpdate, amount, io
            } = item;
            const dateObject = DatetimeUtil.getDate(lastUpdate);
            const resultStatus = TransactionHistoryHelper.getResultTransaction(error, tranType, status);

            const { month, year } = dateObject;
            const key = `x${year}_${month}`;
            if (this.monthMap[key] === undefined) {
                dataWithHeader.push({
                    ID: `${item.ID}_header`,
                    key,
                    header: true,
                    title: `${month}/${year}`
                });
                this.monthMap[key] = true;
            }
            if (this.totalByMonth[key] === undefined) {
                this.totalByMonth[key] = 0;
            }
            if (resultStatus === SUCCESS && io === -1) {
                this.totalByMonth[key] += amount;
            }

            dataWithHeader.push({ header: false, ...item });
        });
        return dataWithHeader;
    }

    render() {
        const {
            data, style, viewAllTitle, headerTitle, hideHeader = false, hideMonthHeader = true
        } = this.props;
        const customViewAllTitle = viewAllTitle || SwitchLanguage?.viewAllTitle;
        const customHeaderTitle = headerTitle || SwitchLanguage?.headerTitle?.toUpperCase();
        const dataWithHeader = !hideMonthHeader ? this.processData(data) : data;
        return (
            <View>
                {!hideHeader ? (
                    <View style={styles.header}>
                        <Text.H4 weight="medium" style={styles.headerTitle}>{customHeaderTitle}</Text.H4>
                        <TouchableOpacity activeOpacity={0.5} onPress={this.viewAll}>
                            <Text.Title style={styles.headerViewAll}>{customViewAllTitle}</Text.Title>
                        </TouchableOpacity>
                    </View>
                ) : <View />}
                <FlatList
                    ref={(list) => this.transactionList = list}
                    style={[styles.list, style]}
                    data={dataWithHeader}
                    keyExtractor={(item) => item.ID}
                    renderItem={this.renderItem}
                    ItemSeparatorComponent={this.renderItemSeperator}
                />
            </View>
        );
    }
}

TransactionHistoryList.propTypes = {
    data: PropTypes.arrayOf(PropTypes.shape({
        lastUpdate: PropTypes.number,
        status: PropTypes.number,
        newDesc: PropTypes.string,
        desc: PropTypes.string,
        icon: PropTypes.oneOfType([PropTypes.object, PropTypes.number, PropTypes.string]),
        useVoucher: PropTypes.oneOf([0, 1]),
        amount: PropTypes.number,
        originalAmount: PropTypes.number,
        io: PropTypes.number,
        tranType: PropTypes.number,
        error: PropTypes.oneOf([0, 1, PropTypes.number, undefined]),
    })),
    onItemPress: PropTypes.func,
    style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
};

import React, { useMemo } from 'react';
import { StyleSheet, View, Keyboard } from 'react-native';
import { Colors, Radius, Spacing } from '@momo-kits/core';
import lodash from 'lodash';

import CommonUtils from '../utils/CommonUtils';
import I18n from '../utils/I18n';
import ImageAssets from '../utils/ImageAssets';

import PaymentMessage from './PaymentMessage';
import PaymentCTA from './PaymentCTA';
import PaymentBreakline from './PaymentBreakline';
import PaymentExpand from './PaymentExpand';
import PaymentStatus from './PaymentStatus';

const EXTRA_LIST_DEFAULT = [
    {
        key: 'PaymentTime',
        title: I18n.paymentTime,
    },
    {
        key: 'TransactionCode',
        title: I18n.transactionCode,
        icon: {
            source: ImageAssets.ic_arrow_right_small,
        },
    },
    {
        key: 'DefaultService',
        title: I18n.defaultService,
    },
];

const NUMBER_TIMESTAMP = 1600000000000;

const PaymentCarouselItem = (props) => {
    const {
        itemWidth,
        data,
        expanded,
        backgroundColor,
        onChange,
        renderMainContent,
        renderExtraList,
        renderMessage,
        renderCTA,
        onPressDetail
    } = props || {};

    const {
        tranId,
        lastUpdate,
        transactionTime,
        name,
        serviceName,
        targetName,
        newDesc,
        desc,
        resultStatus
    } = data || {};
    const isVirtualTID = tranId > NUMBER_TIMESTAMP;
    const btnProps = typeof renderCTA === 'function' ? renderCTA(data) : {};

    const _renderMainContent = () => {
        if (typeof renderMainContent === 'function') {
            return (
                <View style={styles.containerComp}>
                    {renderMainContent(data)}
                </View>
            );
        }
        return null;
    };

    const _getMessage = () => {
        const message = typeof renderMessage === 'function' ? renderMessage(data) : '';
        return ({
            message: message === false ? '' : message || desc,
            status: resultStatus,
        });
    };

    const getTransactionTime = () => {
        const _transactionTime = lastUpdate || transactionTime || undefined;
        return _transactionTime;
    };

    const openTransactionDetail = () => {
        Keyboard.dismiss();
        if (!isVirtualTID) typeof onPressDetail === 'function' && onPressDetail(data);
    };

    const _getExtraList = () => {
        const _transactionTime = getTransactionTime();
        const _extraList = lodash.cloneDeep(EXTRA_LIST_DEFAULT);
        const extraList = typeof renderExtraList === 'function' ? renderExtraList(data) : [];
        const extraListCustom = CommonUtils.isArrayNotEmpty(extraList)
            ? extraList
            : [];

        for (let index = 0; index < extraListCustom.length; ++index) {
            const item = extraListCustom[index];

            if (item?.key) {
                const _index = _extraList.findIndex((j) => j?.key === item.key);

                if (_index > -1) {
                    _extraList[_index] = lodash.merge(_extraList[_index], item);
                }
            } else _extraList.push(item);
        }

        _extraList[0].value = CommonUtils.formatTimeByGTM7(_transactionTime);
        _extraList[1].value = tranId;
        _extraList[1].onPress = openTransactionDetail;
        _extraList[2].value = _extraList[2]?.value || name || serviceName || targetName || newDesc || '';

        if (!tranId || isVirtualTID) {
            _extraList[1].onPress = null;
            delete _extraList[1].icon;
        }

        return _extraList;
    };

    const getBtnProps = (obj = {}) => {
        const text = typeof obj?.text === 'string' ? obj?.text : '';
        const onPress = typeof obj?.onPress === 'function' ? obj?.onPress : () => { };

        if (!text) {
            return null;
        }

        return { text, onPress };
    };

    const getBtnLeft = () => {
        if (!CommonUtils.isObject(btnProps)) {
            return null;
        }
        const _btn = getBtnProps(btnProps?.left);
        if (!CommonUtils.isObject(_btn)) {
            return null;
        }
        _btn.type = 'secondary';
        _btn.hasMargin = true;
        return _btn;
    };

    const getBtnRight = () => {
        if (!CommonUtils.isObject(btnProps)) {
            return null;
        }
        const _btn = getBtnProps(btnProps?.right);
        if (!CommonUtils.isObject(_btn)) {
            return null;
        }
        _btn.type = 'primary';
        return _btn;
    };

    const extraListData = useMemo(() => _getExtraList(), [tranId, resultStatus]);
    const btnLeftData = useMemo(() => getBtnLeft(), [tranId, resultStatus]);
    const btnRightData = useMemo(() => getBtnRight(), [tranId, resultStatus]);
    const messageData = useMemo(() => _getMessage(), [tranId, resultStatus]);

    return (
        <View style={[styles.container, { width: itemWidth }]}>
            <PaymentStatus data={data} onPressDetail={openTransactionDetail} isShowWalletBalance fixMargin />
            <PaymentBreakline backgroundColor={backgroundColor} itemWidth={itemWidth} />
            <PaymentMessage data={messageData} />
            {_renderMainContent()}
            <PaymentExpand
                data={extraListData}
                expanded={expanded}
                onChange={onChange}
            />
            <PaymentCTA btnLeft={btnLeftData} btnRight={btnRightData} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { borderRadius: Radius.M, backgroundColor: Colors.white },
    containerComp: { paddingHorizontal: Spacing.M },
});

export default PaymentCarouselItem;

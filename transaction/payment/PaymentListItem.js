import React, { useMemo, useState } from 'react';
import { StyleSheet, View, Keyboard } from 'react-native';
import {
    Colors, Radius, Spacing,
} from '@momo-kits/core';
import lodash from 'lodash';

import Skeleton from '@momo-kits/skeleton';
import PaymentMessage from './PaymentMessage';
import PaymentCTA from './PaymentCTA';
import PaymentBreakline from './PaymentBreakline';
import PaymentExpand from './PaymentExpand';
import PaymentStatus from './PaymentStatus';
import ExtraList from '../components/ExtraList';
import CommonUtils from '../utils/CommonUtils';
import ImageAssets from '../utils/ImageAssets';
import I18n from '../utils/I18n';
import TYPE from '../utils/BreakLineType';

const NUMBER_TIMESTAMP = 1600000000000;

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
            style: { tintColor: Colors.pink_05_b }
        },

    }
];

const PaymentListItem = (props) => {
    const {
        initialExpanded = false,
        itemWidth,
        data,
        backgroundColor,
        renderMainContent,
        renderMessage,
        renderCTA,
        onPressDetail,
        hideBreaklineTop,
        billIndex,
        isLoading,
        isMultiBill
    } = props || {};

    const {
        tranId,
        desc,
        resultStatus,
        lastUpdate,
        transactionTime,
    } = data || {};

    const index = billIndex ? billIndex - 1 : 0;

    const isVirtualTID = tranId > NUMBER_TIMESTAMP;
    const btnProps = typeof renderCTA === 'function' ? renderCTA(data, index) : {};
    const [expanded, setExpanded] = useState(initialExpanded);

    const onChange = () => {
        setExpanded((val) => !val);
    };

    const renderComponent = () => {
        if (isLoading) {
            return (
                <View style={styles.containerComp}>
                    <Skeleton.Line style={styles.skeletonLoading01} />
                    <Skeleton.Line style={styles.skeletonLoading02} />
                </View>
            );
        }

        if (typeof renderMainContent === 'function') {
            return (
                <View style={styles.containerComp}>
                    {renderMainContent(data, index)}
                </View>
            );
        }
        return null;
    };

    const renderList = () => {
        const extraList = _getExtraList();
        if (!CommonUtils.isArrayNotEmpty(extraList)) {
            return null;
        }
        return (
            <ExtraList
                isLoading={isLoading}
                style={styles.contentExtraList}
                data={extraList}
            />
        );
    };

    const rendeBreaklineTop = () => !hideBreaklineTop && (
        <PaymentBreakline
            backgroundColor={backgroundColor}
            type={TYPE.CIRCLE_TOP}
            itemWidth={itemWidth}
        />
    );

    const renderCollapsedContent = () => (
        <>
            {renderList()}
            <PaymentMessage
                data={messageData}
                style={styles.message}
                isLoading={isLoading}
            />
            <PaymentBreakline
                backgroundColor={backgroundColor}
                type={isLoading ? TYPE.NO_DIVIDER : TYPE.DEFAULT}
            />
            {renderComponent()}
        </>
    );

    const _getMessage = () => {
        const message = typeof renderMessage === 'function' ? renderMessage(data, index) : desc;
        return ({
            message,
            status: resultStatus,
        });
    };

    const openTransactionDetail = () => {
        Keyboard.dismiss();
        if (!isVirtualTID) typeof onPressDetail === 'function' && onPressDetail(data, index);
    };

    const getTransactionTime = () => {
        const _transactionTime = lastUpdate || transactionTime || undefined;
        return _transactionTime;
    };

    const _getExtraList = () => {
        const _transactionTime = getTransactionTime();
        const _extraList = lodash.cloneDeep(EXTRA_LIST_DEFAULT);

        _extraList[0].value = CommonUtils.formatTimeByGTM7(_transactionTime);
        _extraList[1].value = tranId;
        _extraList[1].onPress = openTransactionDetail;
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

    const btnLeftData = useMemo(() => getBtnLeft(), [tranId, resultStatus]);
    const btnRightData = useMemo(() => getBtnRight(), [tranId, resultStatus]);
    const messageData = useMemo(() => _getMessage(), [tranId, resultStatus]);

    return (
        <View style={[styles.container, { width: itemWidth }]}>
            {rendeBreaklineTop()}
            <PaymentStatus
                fixMargin
                data={data}
                onPressDetail={openTransactionDetail}
                billIndex={billIndex}
                isLoading={isLoading}
                isMultiBill={isMultiBill}
            />
            <PaymentExpand
                data={data}
                renderCollapsedContent={renderCollapsedContent}
                expanded={expanded}
                onChange={onChange}
                isLoading={isLoading}
            />
            <PaymentCTA
                btnLeft={btnLeftData}
                btnRight={btnRightData}
                isLoading={isLoading}
            />
            <PaymentBreakline
                backgroundColor={backgroundColor}
                type={TYPE.CIRCLE_BOTTOM}
                itemWidth={itemWidth}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { borderRadius: Radius.M, backgroundColor: Colors.white, overflow: 'hidden' },
    containerComp: { paddingHorizontal: Spacing.M, paddingTop: Spacing.M },
    message: { marginBottom: Spacing.XS },
    contentExtraList: { paddingHorizontal: Spacing.M, paddingBottom: Spacing.S },
    link: {
        color: Colors.pink_05_b,
    },
    skeletonLoading01: {
        height: 35, width: '100%'
    },
    skeletonLoading02: {
        height: 170, width: '100%'
    }
});

export default React.memo(PaymentListItem);

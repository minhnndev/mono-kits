import React, { Component } from 'react';
import {
    View,
    FlatList
} from 'react-native';

import PropTypes from 'prop-types';
import SwipeAction from './SwipeAction';

class SwipeActionList extends Component {
    constructor(props) {
        super(props);
        this._rows = {};
        this.openCellId = null;
    }

    setScrollEnabled(enable) {
        this._listView?.setNativeProps?.({ scrollEnabled: enable });
    }

    closeOpeningRow() {
        // if the openCellId is stale due to deleting a row this could be undefined
        if (this._rows[this.openCellId]) {
            this._rows[this.openCellId].closeRow();
        }
    }

    isRowOpen() {
        return this.openCellId != null;
    }

    onOpen(id, rowData) {
        const { onOpen } = this.props;
        if (this.openCellId && this.openCellId !== id) {
            this.closeOpeningRow();
        }
        this.openCellId = id;
        if (onOpen) onOpen(rowData);
    }

    onScroll(e) {
        const { closeOnScroll, onScroll } = this.props;
        if (this.openCellId) {
            if (closeOnScroll) {
                this.closeOpeningRow();
                this.openCellId = null;
            }
        }
        if (onScroll) onScroll(e);
    }

    renderRow = ({ item, index }) => {
        const {
            renderItem,
            renderItemNonSwipe,
            separator,
            leftAction,
            rightAction,
            renderLeftAction,
            renderRightAction,
            disableRightAction,
            disableLeftAction,
            closeOnPress,
            actionTextStyle,
            actionIconStyle,
            onPress,
            onClose,
            actionBackground,
            swipeGestureBegan,
            swipeGestureEnd,
        } = this.props;
        return (
            <View>
                <SwipeAction
                    ref={(row) => this._rows[`${item}${index}`] = row}
                    disableRightAction={disableRightAction}
                    disableLeftAction={disableLeftAction}
                    leftAction={leftAction}
                    rightAction={rightAction}
                    onPress={() => onPress && onPress(item)}
                    onOpen={() => this.onOpen(`${item}${index}`, item)}
                    onClose={onClose}
                    setScrollEnabled={(enable) => this.setScrollEnabled(enable)}
                    closeOnPress={closeOnPress}
                    actionTextStyle={actionTextStyle}
                    actionIconStyle={actionIconStyle}
                    actionBackground={actionBackground}
                    rowIndex={index}
                    renderLeftAction={renderLeftAction}
                    renderRightAction={renderRightAction}
                    swipeGestureBegan={swipeGestureBegan}
                    swipeGestureEnd={swipeGestureEnd}
                >
                    {renderItem?.(item, index)}
                </SwipeAction>
                {renderItemNonSwipe?.(item, index)}
                {separator}
            </View>
        );
    };

    render() {
        const { data } = this.props;
        return (
            <FlatList
                {...this.props}
                removeClippedSubviews={false}
                ref={(c) => this._listView = c}
                onScroll={(e) => this.onScroll(e)}
                data={data}
                keyExtractor={(item, index) => index.toString()}
                renderItem={this.renderRow}
            />
        );
    }
}

SwipeActionList.propTypes = {
    data: PropTypes.array.isRequired,
    renderItem: PropTypes.oneOfType([PropTypes.func, PropTypes.node, PropTypes.element]).isRequired,
    renderItemNonSwipe: PropTypes.oneOfType([PropTypes.func, PropTypes.node, PropTypes.element]),
    separator: PropTypes.oneOfType([PropTypes.func, PropTypes.node, PropTypes.element]),
    leftAction: PropTypes.oneOfType([PropTypes.array, PropTypes.func, PropTypes.element]),
    rightAction: PropTypes.oneOfType([PropTypes.array, PropTypes.func, PropTypes.element]),
    actionTextStyle: PropTypes.object,
    actionIconStyle: PropTypes.object,
    closeOnScroll: PropTypes.bool,
    closeOnPress: PropTypes.bool,
    disableRightAction: PropTypes.bool,
    disableLeftAction: PropTypes.bool,
    onOpen: PropTypes.func,
    onClose: PropTypes.func,
    onPress: PropTypes.func,
    actionBackground: PropTypes.string,
    swipeGestureBegan: PropTypes.func,
    swipeGestureEnd: PropTypes.func,
};

SwipeActionList.defaultProps = {
    closeOnScroll: true,
    closeOnPress: true,
    disableRightAction: true,
    disableLeftAction: true
};

export default SwipeActionList;

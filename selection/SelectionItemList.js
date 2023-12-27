/* eslint-disable react/jsx-props-no-spreading */
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { get } from 'lodash';
import { View, FlatList, StyleSheet } from 'react-native';
import { Text, Colors } from '@momo-kits/core';
import SelectionItem from './SelectionItem';

const styles = StyleSheet.create({
    headerItemContainerStyle: {
        backgroundColor: 'white',
    },
    headerItemStyle: {
        paddingVertical: 12,
        paddingHorizontal: 6,
    },
    selectedItemStyle: {
        backgroundColor: Colors.ice_blue,
    },
    separateLineStyle: {
        height: 0.5,
        backgroundColor: Colors.light_periwinkle_three,
    },
    list: { backgroundColor: 'white' },
});

export default class SelectionItemList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            stickyHeaderIndices: [],
            selectedIds: [],
        };
        this.selectedItem = props.selectedItem;
        this.init = false;
    }

    componentDidMount() {
        const { stickyHeader, ListHeaderComponent } = this.props;
        const data = get(this.props, 'data', []);

        /**
         * init for case data is available when component construct
         */
        let headerView = null;
        if (typeof ListHeaderComponent === 'function')
            headerView = ListHeaderComponent();
        else if (ListHeaderComponent) headerView = ListHeaderComponent;
        if (!this.init && data.length > 0) {
            const headers = [];
            if (stickyHeader) {
                data.forEach((item, index) => {
                    if (item.isHeader)
                        headers.push(headerView ? index + 1 : index);
                });
            }
            const selectedIds = this.getSelectedIds(data);
            this.setState({ selectedIds, stickyHeaderIndices: headers });
            this.init = true;
        }
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        const { ListHeaderComponent } = this.props;
        const oldData = get(this.props, 'data', []);
        const newData = get(nextProps, 'data', []);
        if (
            this.init &&
            newData.length > 0 &&
            oldData.length !== newData.length
        ) {
            const selectedIds = this.getSelectedIds(newData);
            this.setState({ selectedIds });
        }
        /**
         * init for case data fetched from api, which isn't available when construct
         */
        let headerView = <View />;
        if (typeof ListHeaderComponent === 'function')
            headerView = ListHeaderComponent();
        else if (ListHeaderComponent) headerView = ListHeaderComponent;
        if (!this.init && newData.length > 0) {
            const headers = [];
            if (nextProps.stickyHeader) {
                newData.forEach((item, index) => {
                    if (item.isHeader)
                        headers.push(headerView ? index + 1 : index);
                });
            }
            const selectedIds = this.getSelectedIds(newData);
            this.setState({ selectedIds, stickyHeaderIndices: headers });
            this.init = true;
        }
    }

    getSelectedIds = (data) => {
        let selectedIds = null;
        const { selectedItem, compareKey } = this.props;
        const dataLength = get(data, 'length', 0);
        const selectedIdArray = [];
        const condition =
            compareKey &&
            typeof compareKey === 'string' &&
            selectedItem &&
            dataLength > 0;

        if (condition) {
            data.forEach((item) => {
                if (selectedItem && Array.isArray(selectedItem)) {
                    selectedItem.forEach((sItem) => {
                        if (item[compareKey] === sItem[compareKey]) {
                            selectedIdArray.push(item[compareKey]);
                        }
                    });
                } else if (
                    selectedItem &&
                    Object.keys(selectedItem).length > 0
                ) {
                    if (
                        item[compareKey] === selectedItem[compareKey] &&
                        !selectedIds
                    ) {
                        selectedIds = item[compareKey];
                    }
                }
            });
        }
        if (selectedIds !== null) {
            return selectedIds;
        }
        return selectedIdArray;
    };

    setItemSelectedIds = (item, callback) => {
        const { multiple, compareKey, uncheckable } = this.props;
        const { selectedIds } = this.state;
        if (multiple) {
            const selectedIdsCopy = JSON.parse(JSON.stringify(selectedIds));
            if (selectedIds && Array.isArray(selectedIds)) {
                let found = false;
                selectedIds.forEach((id, i) => {
                    if (id === item[compareKey]) {
                        selectedIdsCopy.splice(i, 1);
                        found = true;
                    }
                });
                if (!found) {
                    selectedIdsCopy.push(item[compareKey]);
                }
                this.setState({ selectedIds: selectedIdsCopy }, callback);
            }
        } else if (selectedIds === item[compareKey] && uncheckable) {
            this.setState({ selectedIds: null }, callback);
        } else {
            this.setState({ selectedIds: item[compareKey] }, callback);
        }
    };

    onItemPress = (item, index) => {
        this.setItemSelectedIds(item, () => {
            const { onItemPress, multiple, compareKey } = this.props;
            const { selectedIds } = this.state;
            let currentCheckedItem = false;
            if (Array.isArray(selectedIds) && multiple) {
                currentCheckedItem =
                    selectedIds.filter((id) => item[compareKey] === id).length >
                    0;
            } else {
                currentCheckedItem = selectedIds === item[compareKey];
            }
            if (onItemPress && typeof onItemPress === 'function')
                onItemPress(currentCheckedItem ? item : {}, index, selectedIds);
        });
    };

    clearItemSelected = () => {
        this.setState({ selectedIds: null });
    };

    getSeparateLine = (index) => {
        const { data } = this.props;
        const item = get(data, `[${index + 1}]`, { isHeader: false });
        if (item.isHeader) return {};
        return {};
    };

    renderItem = ({ item, index }) => {
        const {
            itemProps,
            renderHeaderItem,
            selectionIcon,
            selectedItemStyle,
            renderKey,
            compareKey,
            selectedItemTitleStyle,
            bodyKey,
            leftIconKey,
            detailKey,
            rightTitleKey,
            onItemProps = () => {},
        } = this.props;
        const { selectedIds } = this.state;

        if (item.isHeader) {
            if (typeof renderHeaderItem === 'function')
                return renderHeaderItem(item);
            return this.defaultHeaderItem(item);
        }

        const itemStyle = get(itemProps, 'style', {});

        /**
         * get custom render name, default render name
         */
        /**
         * get custom render name, default render name
         */
        const title = item[renderKey] || item.title;

        let body = item.description || item.body;
        if (bodyKey) {
            body = item[bodyKey];
        }

        let leftIcon = item.uri || itemProps?.leftIcon;
        if (leftIconKey) {
            leftIcon = item[leftIconKey];
        }

        let { detail } = item;
        if (detailKey) {
            detail = item[detailKey];
        }

        let { rightTitle } = item;
        if (rightTitleKey) {
            rightTitle = item[rightTitleKey];
        }

        let selected = false;

        if (selectedIds && Array.isArray(selectedIds)) {
            selected =
                selectedIds.filter((id) => id === item[compareKey]).length > 0;
        } else {
            selected = selectedIds === item[compareKey];
        }

        const customItemProps = () => onItemProps(item, selected);
        const renderItemProps = () => {
            if (typeof itemProps === 'object') return itemProps;
            if (typeof itemProps === 'function')
                return itemProps(item, selected);
        };
        return (
            <SelectionItem
                {...renderItemProps()}
                isListItem
                key={(item.id || index).toString()}
                title={title}
                leftIcon={leftIcon}
                body={body}
                detail={detail}
                rightTitle={rightTitle}
                rightIcon={selected ? selectionIcon : itemProps?.rightIcon}
                style={[
                    itemStyle,
                    selected
                        ? selectedItemStyle || styles.selectedItemStyle
                        : {},
                    this.getSeparateLine(index),
                ]}
                titleStyle={[
                    selected ? selectedItemTitleStyle : itemProps?.titleStyle,
                ]}
                onPress={() => this.onItemPress(item, index)}
                {...customItemProps()}
            />
        );
    };

    defaultHeaderItem = (item) => {
        const { headerItemContainerStyle, headerItemStyle } = this.props;
        return (
            <View
                style={[
                    styles.headerItemContainerStyle,
                    headerItemContainerStyle,
                ]}>
                <Text.Title style={[styles.headerItemStyle, headerItemStyle]}>
                    {item.name}
                </Text.Title>
            </View>
        );
    };

    renderItemSeparation = ({ leadingItem }) => {
        const { separateLine, separateLineStyle } = this.props;
        if (leadingItem.isHeader) return null;
        if (!separateLine) return <View />;
        return <View style={[styles.separateLineStyle, separateLineStyle]} />;
    };

    render() {
        const { selectedIds, stickyHeaderIndices, contentContainerStyle } =
            this.state;
        const { listRef, stickyHeader, compareKey, renderKey } = this.props;

        if (
            (stickyHeader && stickyHeaderIndices.length === 0) ||
            !compareKey ||
            !renderKey
        )
            return <View />;

        const stickyProps = stickyHeader ? { stickyHeaderIndices } : {};

        return (
            <FlatList
                {...this.props}
                {...stickyProps}
                ref={listRef}
                keyExtractor={(item, index) => index.toString()}
                renderItem={this.renderItem}
                extraData={selectedIds}
                ItemSeparatorComponent={this.renderItemSeparation}
                contentContainerStyle={[styles.list, contentContainerStyle]}
            />
        );
    }
}

SelectionItemList.propTypes = {
    data: PropTypes.arrayOf(
        PropTypes.shape({
            isHeader: PropTypes.bool,
            name: PropTypes.string,
        }),
    ),
    headerItemContainerStyle: PropTypes.oneOfType([
        PropTypes.object,
        PropTypes.array,
    ]),
    selectedItemTitleStyle: PropTypes.oneOfType([
        PropTypes.object,
        PropTypes.array,
    ]),
    headerItemStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
    itemProps: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
    onItemPress: PropTypes.func,
    renderHeaderItem: PropTypes.any,
    selectedItemStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
    selectionIcon: PropTypes.oneOfType([
        PropTypes.object,
        PropTypes.number,
        PropTypes.string,
    ]),
    separateLine: PropTypes.bool,
    separateLineStyle: PropTypes.object,
    stickyHeader: PropTypes.bool,
    selectedIds: PropTypes.oneOfType([PropTypes.array, PropTypes.number]),
    renderKey: PropTypes.string,
    compareKey: PropTypes.string,
    bodyKey: PropTypes.string,
    leftIconKey: PropTypes.string,
    detailKey: PropTypes.string,
    listRef: PropTypes.any,
    rightTitleKey: PropTypes.string,
    selectedItem: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
    uncheckable: PropTypes.bool,
    multiple: PropTypes.bool,
    onItemProps: PropTypes.func,
};

SelectionItemList.defaultProps = {
    selectionIcon: null,
    uncheckable: false,
    itemProps: {},
};

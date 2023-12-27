/* eslint-disable react/jsx-props-no-spreading */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
    SectionList, FlatList, StyleSheet, View
} from 'react-native';
import { get } from 'lodash';
import { Text } from '@momo-kits/core';
import CardPicker from './DataPickerCard';

const DEFAULT_NUMBER_COLUMNS = 3;
const DEFAULT_MIN_OPTIONS = 0;
const DEFAULT_MAX_OPTIONS = 1;
const DEFAULT_SPACE_BETWEEN_ITEMS = 6;
const DEFAULT_MARGIN_GROUP = 12;

const styles = StyleSheet.create({
    container: {
        flexGrow: 0,
    },
    flexRow: {
        flex: 1
    },
    marginLeftItem: {
        marginStart: DEFAULT_SPACE_BETWEEN_ITEMS
    },
    marginTopItem: {
        marginTop: DEFAULT_SPACE_BETWEEN_ITEMS
    },
    groupItem: {
        marginTop: DEFAULT_MARGIN_GROUP,
        marginBottom: DEFAULT_MARGIN_GROUP,
    },
});

export default class DataPicker extends Component {
    constructor(props) {
        super(props);
        this.dataSelectedDefault = props.dataSelectedDefault;
        this.state = {
            dataSourceFormated: [],
        };
    }

    componentDidMount() {
        const { data, } = this.props;
        const dataSourceFormated = this.formatDataSource(data);
        this.setState({ dataSourceFormated });
    }

    shouldComponentUpdate(nextProps) {
        const { enableScrollToIndex } = this.props;
        if (JSON.stringify(nextProps) !== JSON.stringify(this.props)) {
            const { data: newDataSource, dataSelectedDefault: newDataSelectedDefault } = nextProps;
            const { data: oldDataSource, dataSelectedDefault: oldDataSelectedDefault } = this.props;
            if (JSON.stringify(newDataSource) !== JSON.stringify(oldDataSource)
                || JSON.stringify(newDataSelectedDefault) !== JSON.stringify(oldDataSelectedDefault)) {
                this.dataSelectedDefault = newDataSelectedDefault;
                const dataSourceFormated = this.formatDataSource(newDataSource);
                this.setState({
                    dataSourceFormated
                });
                if (enableScrollToIndex && !this.isScrolled) {
                    this.refFlat?.scrollToIndex?.({ animated: true, index: this.index || 0, viewPosition: 0.5 });
                }
                this.isScrolled = false;
                return true;
            }
            return false;
        }

        return true;
    }

    render() {
        const { dataSourceFormated } = this.state;
        let data = dataSourceFormated;
        if (!Array.isArray(data) || data.length <= 0) {
            const { dataLoading } = this.props;
            data = this.formatDataLoading(dataLoading);
        }
        const { style } = this.props;
        return (
            <SectionList
                {...this.props}
                style={[styles.container, style]}
                sections={data}
                keyExtractor={this.genKeyExtractor}
                renderItem={this.renderFlatList}
                renderSectionHeader={this.renderHeader}
            />
        );
    }

    genKeyExtractor = (item, index) => item + index

    renderFlatList = ({ item, section }) => {
        const numColumns = section.numColumns || DEFAULT_NUMBER_COLUMNS;
        const { groupStyle, isHorizontal } = this.props;
        if (isHorizontal) {
            return (
                <FlatList
                    horizontal
                    style={[styles.groupItem, groupStyle]}
                    data={item}
                    showsVerticalScrollIndicator={false}
                    showsHorizontalScrollIndicator={false}
                    renderItem={({ item: childItem }) => this.renderItem(childItem, section, numColumns)}
                    keyExtractor={this.genKeyExtractor}
                    ref={(ref) => this.refFlat = ref}
                />
            );
        }
        return (
            <FlatList
                style={[styles.groupItem, groupStyle]}
                numColumns={numColumns}
                data={this.fillDataItemsFullRow(item, numColumns)}
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
                scrollEnabled={false}
                renderItem={({ item: childItem }) => this.renderItem(childItem, section, numColumns)}
                keyExtractor={this.genKeyExtractor}
            />
        );
    }

    /**
     * func fill empty item to row end of array -> hide card -> all card in that don't scale up.
     */
    fillDataItemsFullRow = (items, numColumns) => {
        if (Array.isArray(items) && items.length > 0) {
            const mod = items.length % numColumns;
            if (mod !== 0) {
                for (let i = 0; i < numColumns - mod; i += 1) {
                    items.push({ dataPickerEmptyItem: true });
                }
            }
        }
        return items;
    }

    renderItem = (childItem, section, numColumns) => {
        const {
            renderItemContent, cardStyle, labelKey, labelStyle, iconStyle, isHorizontal
        } = this.props;
        let label = null;
        if (childItem) {
            label = childItem[labelKey] || childItem.title || null;
        }
        let marginLeftStyle = null;
        let marginTopStyle = null;
        if (isHorizontal) {
            marginLeftStyle = childItem.index > 0 ? styles.marginLeftItem : null;
        } else {
            marginLeftStyle = childItem.index % numColumns !== 0 ? styles.marginLeftItem : null;
            marginTopStyle = childItem.index >= numColumns ? styles.marginTopItem : null;
        }
        return (
            <CardPicker
                style={[styles.flexRow,
                    marginLeftStyle,
                    marginTopStyle,
                    cardStyle]}
                loading={childItem.isLoading}
                selected={childItem.isSelected}
                hide={!childItem || childItem.dataPickerEmptyItem}
                disable={childItem.disable}
                label={label}
                labelStyle={labelStyle}
                icon={childItem.icon}
                iconSelected={childItem.iconSelected}
                iconStyle={iconStyle}
                renderContent={(renderItemContent && typeof renderItemContent === 'function')
                    ? () => renderItemContent(section, section.index, childItem, childItem.index)
                    : null}
                onPress={() => this.onPressItem(childItem, section)}
            />
        );
    }

    renderHeader = ({ section }) => {
        const { renderHeader: renderHeaderFunc, sectionLabelKey, sectionLabelStyle } = this.props;
        let label = null;
        if (section) {
            label = section[sectionLabelKey] || section.title || null;
        }
        return (
            <View>
                {renderHeaderFunc && typeof renderHeaderFunc === 'function'
                    ? renderHeaderFunc(section, section.index)
                    : label ? (
                        <Text.Title style={sectionLabelStyle}>{label}</Text.Title>
                    ) : null}
            </View>
        );
    }

    formatDataLoading = (dataLoading) => {
        if (Array.isArray(dataLoading) && dataLoading.length > 0) {
            return dataLoading.map((item, index) => {
                const { count } = item || {};
                return {
                    ...item,
                    index,
                    data: [this.formatDataLoadingItem(count)]
                };
            });
        }
        return [];
    }

    formatDataLoadingItem = (count) => {
        if (count > 0) {
            return [...Array(count).keys()].map((index) => ({
                index,
                isLoading: true
            }));
        }
        return [];
    }

    formatDataSource = (data) => {
        if (Array.isArray(data) && data.length > 0) {
            return data.map((item, index) => {
                const formatDataItem = this.formatDataItem(item);
                return {
                    ...item,
                    index,
                    data: [formatDataItem.data],
                    selectedAmount: formatDataItem.selectedAmount
                };
            });
        }
        return [];
    }

    formatDataItem = (section) => {
        const { data } = section || {};
        const { keyCompareItem } = this.props;
        let selectedAmount = 0;

        let arraySelectedDefault = [];
        this.index = 0;
        if (Array.isArray(this.dataSelectedDefault)) {
            this.dataSelectedDefault.forEach((item) => {
                if (item && Array.isArray(item.data)) {
                    arraySelectedDefault = arraySelectedDefault.concat(item.data);
                }
            });
        }
        if (Array.isArray(data) && data.length > 0) {
            let newData = data.map((item, index) => {
                let { isSelected = false } = item;
                if (isSelected) {
                    selectedAmount += 1;
                }

                if (Array.isArray(arraySelectedDefault)) {
                    const itemSelectedDefault = arraySelectedDefault.find((it) => it[keyCompareItem] && item[keyCompareItem] && it[keyCompareItem] === item[keyCompareItem]);
                    if (itemSelectedDefault) {
                        this.index = index;
                        isSelected = true;
                        selectedAmount += 1;
                    }
                }

                return {
                    ...item,
                    index,
                    isSelected
                };
            });
            newData = this.reCheckItemIsAll(newData, selectedAmount);
            return {
                data: newData,
                selectedAmount
            };
        }
        return {
            data: [],
            selectedAmount
        };
    }

    reCheckItemIsAll = (data, selectedAmount) => {
        let newData = [...data];
        if (selectedAmount >= 0) {
            newData = newData.map((item) => {
                let { isSelected } = item;
                if (selectedAmount === 0) {
                    if (item.isAll && !isSelected) {
                        isSelected = true;
                    }
                } else if (item.isAll && isSelected) {
                    isSelected = false;
                }
                return {
                    ...item,
                    isSelected
                };
            });
        }
        return newData;
    }

    onPressItem = (itemSelect, sectionSelected) => {
        const { onWillUpdateItem, allSectionIsOnceSelect } = this.props;
        const { min_options = DEFAULT_MIN_OPTIONS, max_options = DEFAULT_MAX_OPTIONS } = sectionSelected;
        if (!onWillUpdateItem
            || onWillUpdateItem(this.getSectionOriginal(sectionSelected), sectionSelected.index,
                itemSelect, itemSelect.index)) {
            if (this.dataSelectedDefault) {
                this.dataSelectedDefault = null;
            }
            if (itemSelect.isAll) {
                this.clearSelectedOfSectionIndex(sectionSelected.index);
                return;
            }

            let { dataSourceFormated } = this.state;
            if (Array.isArray(dataSourceFormated) && dataSourceFormated.length > 0) {
                dataSourceFormated = dataSourceFormated.map((section) => {
                    if (section.index !== sectionSelected.index) {
                        if (allSectionIsOnceSelect) {
                            return this.clearSection(section);
                        }
                        return section;
                    }

                    let { selectedAmount = 0 } = sectionSelected;
                    const { data } = section;
                    if (itemSelect && Array.isArray(data) && data.length > 0 && Array.isArray(data[0]) && data[0].length > 0) {
                        data[0] = data[0].map((item) => {
                            let { isSelected } = item;
                            if (max_options === 0) { // enable select all options
                                if (item.index === itemSelect.index) {
                                    if (item.isSelected) {
                                        if (selectedAmount > min_options) {
                                            isSelected = false;
                                            selectedAmount -= 1;
                                        }
                                    } else {
                                        isSelected = true;
                                        selectedAmount += 1;
                                    }
                                }

                                return {
                                    ...item,
                                    isSelected
                                };
                            }

                            if ((min_options === 0 || min_options === 1) && max_options === 1) { // single select, min_options === 0: enable select empty
                                if (isSelected) {
                                    isSelected = false;
                                    selectedAmount -= 1;
                                }
                                if (item && itemSelect && item.index === itemSelect.index) {
                                    isSelected = true;
                                    selectedAmount += 1;
                                }
                            }

                            if (selectedAmount < max_options) {
                                if (item && itemSelect) {
                                    if (item.index === itemSelect.index) {
                                        if (item.isSelected) {
                                            if (selectedAmount > min_options) {
                                                isSelected = false;
                                                selectedAmount -= 1;
                                            }
                                        } else {
                                            isSelected = true;
                                            selectedAmount += 1;
                                        }
                                    }
                                }
                            } else if (selectedAmount >= max_options) {
                                if (item && itemSelect && item.index === itemSelect.index
                                    && item.isSelected && selectedAmount > min_options) {
                                    isSelected = false;
                                    selectedAmount -= 1;
                                }
                            }

                            return {
                                ...item,
                                isSelected
                            };
                        });
                        data[0] = this.reCheckItemIsAll(data[0], selectedAmount);
                    }

                    return {
                        ...section,
                        selectedAmount,
                        data
                    };
                });
                this.setState({
                    dataSourceFormated
                }, () => { this.buildDataSelected(); });
            }
        }
    }

    buildDataSelected = () => {
        const { dataSourceFormated } = this.state;
        const { onSelected, enableScrollToIndex } = this.props;
        const dataSelected = [];

        if (Array.isArray(dataSourceFormated) && dataSourceFormated.length > 0) {
            dataSourceFormated.forEach((section) => {
                const array = get(section, 'data[0]', {});
                if (Array.isArray(array) && array.length > 0) {
                    const arraySelected = [];
                    array.forEach((item) => {
                        if (item && item.isSelected && !item.isAll) {
                            arraySelected.push(item);
                        }
                    });
                    if (Array.isArray(array) && array.length > 0) {
                        const newSection = { ...section };
                        newSection.data = arraySelected;
                        dataSelected.push(newSection);
                    }
                }
            });
        }
        if (enableScrollToIndex) {
            this.refFlat?.scrollToIndex?.({ animated: true, index: dataSelected?.[0]?.data?.[0]?.index || 0, viewPosition: 0.5 });
            this.isScrolled = true;
        }
        if (onSelected && typeof onSelected === 'function') {
            onSelected(dataSelected);
        }
    }

    clearSelected = () => {
        if (this.dataSelectedDefault) {
            this.dataSelectedDefault = null;
        }
        const { data } = this.props;
        const dataSourceFormated = this.formatDataSource(data);
        this.setState({ dataSourceFormated }, () => { this.buildDataSelected(); });
    }

    clearSection = (section) => {
        if (section) {
            const selectedAmount = 0;
            const { data } = section;
            if (Array.isArray(data) && data.length > 0 && Array.isArray(data[0]) && data[0].length > 0) {
                data[0] = data[0].map((item) => ({
                    ...item,
                    isSelected: false
                }));
                data[0] = this.reCheckItemIsAll(data[0], selectedAmount);
            }

            return {
                ...section,
                selectedAmount,
                data
            };
        }
        return section;
    }

    clearSelectedOfSectionIndex = (sectionIndex) => {
        if (this.dataSelectedDefault) {
            this.dataSelectedDefault = null;
        }
        const { data } = this.props;
        const { dataSourceFormated } = this.state;
        const newData = [...dataSourceFormated];
        if (Array.isArray(data) && Array.isArray(dataSourceFormated)) {
            if (sectionIndex < newData.length && sectionIndex < data.length) {
                const newSection = this.formatDataSource(data)[sectionIndex];
                newData[sectionIndex] = newSection;
            }
        }

        this.setState({ dataSourceFormated: newData }, () => { this.buildDataSelected(); });
    }

    clearSelectedExceptSectionIndex = (sectionIndex) => {
        if (this.dataSelectedDefault) {
            this.dataSelectedDefault = null;
        }
        const { data } = this.props;
        const { dataSourceFormated } = this.state;
        const newData = [...this.formatDataSource(data)];
        if (Array.isArray(data) && Array.isArray(dataSourceFormated)) {
            if (sectionIndex < newData.length && sectionIndex < data.length) {
                const newSection = dataSourceFormated[sectionIndex];
                newData[sectionIndex] = newSection;
            }
        }

        this.setState({ dataSourceFormated: newData }, () => { this.buildDataSelected(); });
    }

    getSectionOriginal = (section) => {
        const { data } = this.props;
        if (!section.index) {
            return section;
        }
        if (Array.isArray(data) && section.index < data.length) {
            return data[section.index];
        }
        return null;
    }

    getItemOriginal = (section, item) => {
        const { data } = this.getSectionOriginal(section) || [];
        if (Array.isArray(data) && data.index < data.length) {
            return data[item.index];
        }
        return null;
    }
}

DataPicker.propTypes = {
    data: PropTypes.array,
    dataLoading: PropTypes.array,
    renderHeader: PropTypes.func,
    renderItemContent: PropTypes.func,
    onWillUpdateItem: PropTypes.func,
    onSelected: PropTypes.func,
    groupStyle: PropTypes.oneOfType([PropTypes.array, PropTypes.object, PropTypes.number]),
    cardStyle: PropTypes.oneOfType([PropTypes.array, PropTypes.object, PropTypes.number]),
    sectionLabelKey: PropTypes.string,
    sectionLabelStyle: PropTypes.oneOfType([PropTypes.array, PropTypes.object, PropTypes.number]),
    labelKey: PropTypes.string,
    labelStyle: PropTypes.oneOfType([PropTypes.array, PropTypes.object, PropTypes.number]),
    dataSelectedDefault: PropTypes.array,
    keyCompareItem: PropTypes.string,
    allSectionIsOnceSelect: PropTypes.bool,
    iconStyle: PropTypes.oneOfType([PropTypes.array, PropTypes.object, PropTypes.number]),
    isHorizontal: PropTypes.bool
};

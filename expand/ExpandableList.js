import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
    View,
    Text,
    FlatList,
    UIManager,
    LayoutAnimation,
    Platform,
    TouchableOpacity,
} from 'react-native';

class ExpandableList extends Component {
    constructor(props) {
        super(props);
        if (Platform.OS === 'android' && props.animation) {
            UIManager.setLayoutAnimationEnabledExperimental(true);
        }
        this.flatList;
        this.layoutStore = [];
        this.state = {
            memberOpened: props.data.map((item, index) => props?.openItems?.includes(index))
        };
    }

    _keyExtractor = (item, index) => index.toString();

    scrollToEnd = (params) => this.flatList.scrollToEnd(params);

    scrollToIndex = (params) => this.flatList.scrollToIndex(params);

    scrollToItem = (params) => this.flatList.scrollToItem(params);

    scrollToOffset = (params) => this.flatList.scrollToOffset(params);

    recordInteraction = () => this.flatList.recordInteraction();

    flashScrollIndicators = () => this.flatList.flashScrollIndicators();

    colapseAll = () => {
        const { data } = this.props;
        this.setState({ memberOpened: data.map(() => false) });
    }

    scrollToSection = ({ animated, section }) => {
        let offset = 0;
        this.layoutStore.forEach((item, index) => {
            if (index < section) {
                offset += item.layout.height;
            }
        });
        this.flatList.scrollToOffset({ animated, offset });
    };

    setSectionState = (index, state) => {
        const { animation } = this.props;
        if (animation) {
            LayoutAnimation.easeInEaseOut(() => {
                this.setState((s) => {
                    const memberOpened = new Map(s.memberOpened);
                    memberOpened.set(index, state); // toggle
                    return { memberOpened };
                });
            });
        } else {
            this.setState((s) => {
                const memberOpened = new Map(s.memberOpened);
                memberOpened.set(index, state); // toggle
                return { memberOpened };
            });
        }
    };

    onToggle = (id, callback) => {
        const { singleMode } = this.props;
        const { memberOpened } = this.state;
        if (!singleMode) {
            const newMemberOpened = [...memberOpened];
            newMemberOpened[id] = !newMemberOpened[id];
            this.setState({ memberOpened: newMemberOpened }, callback);
        } else {
            this.setState({
                memberOpened: memberOpened.map((item, index) => {
                    if (index === id) return !item;
                    return false;
                })
            }, callback);
        }
    };

    _onPress = (item, sectionId) => {
        const { onPress, animation } = this.props;
        const { memberOpened } = this.state;
        if (animation) {
            this.onToggle(sectionId, () => {
                LayoutAnimation.configureNext({
                    duration: 350,
                    create: {
                        type: LayoutAnimation.Types.easeInEaseOut,
                        property: LayoutAnimation.Properties.opacity,
                    },
                    update: { type: LayoutAnimation.Types.easeInEaseOut },
                }, () => {
                    if (onPress) {
                        onPress(item, sectionId, !memberOpened[sectionId]);
                    }
                });
            });
        } else {
            this.onToggle(sectionId, () => {
                if (onPress) {
                    onPress(item, sectionId, !memberOpened[sectionId]);
                }
            });
        }
    };

    _onSubPress = (item, index, sectionId) => {
        const { onSubPress, closeOnSubPress, animation } = this.props;
        const { memberOpened } = this.state;
        if (animation) {
            if (closeOnSubPress) {
                this.onToggle(sectionId, () => {
                    LayoutAnimation.configureNext({
                        duration: 350,
                        create: {
                            type: LayoutAnimation.Types.easeInEaseOut,
                            property: LayoutAnimation.Properties.opacity,
                        },
                        update: { type: LayoutAnimation.Types.easeInEaseOut },
                    }, () => {
                        if (onSubPress) {
                            onSubPress(item, index, sectionId, !memberOpened[sectionId]);
                        }
                    });
                });
            } else if (onSubPress) {
                onSubPress(item, index, sectionId, !memberOpened[sectionId]);
            }
        } else if (closeOnSubPress) {
            this.onToggle(sectionId, () => {
                if (onSubPress) {
                    onSubPress(item, index, sectionId, !memberOpened[sectionId]);
                }
            });
        } else if (onSubPress) {
            onSubPress(item, index, sectionId, !memberOpened[sectionId]);
        }
    }

    _renderSubItem = (item, index, sectionId) => {
        const { renderSubItem, subActiveOpacity, disabledSubItem } = this.props;
        return (
            <TouchableOpacity
                disabled={disabledSubItem}
                activeOpacity={subActiveOpacity}
                onPress={() => this._onSubPress(item, index, sectionId)}
            >
                {renderSubItem
                    ? renderSubItem({ item, index, sectionId })
                    : <Text>{JSON.stringify(item)}</Text>}
            </TouchableOpacity>
        );
    }

    _renderItem = ({ item, index }) => {
        const {
            renderItem,
            subItemKey,
            rowNumberCloseMode = 0,
            SubItemSeparatorComponent,
            itemActiveOpacity,
            itemStyle = {},
            subListProps = {},
            disabledItem
        } = this.props;
        const { memberOpened } = this.state;
        const sectionId = index;
        let memberArr = item[subItemKey] || [];
        if (!memberOpened[sectionId]) {
            memberArr = memberArr.slice(0, rowNumberCloseMode);
        }
        return (
            <View style={itemStyle}>
                <TouchableOpacity
                    disabled={disabledItem}
                    activeOpacity={itemActiveOpacity}
                    onPress={() => this._onPress(item, sectionId)}
                >
                    {renderItem
                        ? renderItem({
                            item, index, memberOpened: memberOpened[sectionId], sectionId
                        }) : null}
                </TouchableOpacity>
                {
                    memberArr.length > 0 && (
                        <FlatList
                            {...subListProps}
                            keyExtractor={(subItem, i) => i.toString()}
                            data={memberArr}
                            renderItem={
                                ({ item: subItem, index: subIndex }) => this._renderSubItem(subItem, subIndex, sectionId)
                            }
                            ItemSeparatorComponent={SubItemSeparatorComponent}
                        />
                    )
                }
            </View>
        );
    };

    _getItemLayout = (data, index) => {
        const { getItemLayout } = this.props;
        let offset = 0;
        const item_height = this.layoutStore[index].layout.height;
        this.layoutStore.forEach((item) => offset += item.layout.height);
        getItemLayout && getItemLayout(data, index);
        return { length: item_height, offset, index };
    };

    render() {
        const { data } = this.props;
        return (
            <FlatList
                {...this.props}
                keyExtractor={this._keyExtractor}
                extraData={this.state}
                initialNumToRender={data && data.length || 0}
                ref={(instance) => this.flatList = instance}
                data={data}
                horizontal={false}
                renderItem={this._renderItem}
            />
        );
    }
}

ExpandableList.propTypes = {
    data: PropTypes.array.isRequired,
    itemKey: PropTypes.string,
    subItemKey: PropTypes.string,
    renderSubItem: PropTypes.func,
    renderItem: PropTypes.func,
    onPress: PropTypes.func,
    onSubPress: PropTypes.func,
    singleMode: PropTypes.bool,
    closeOnSubPress: PropTypes.bool,
    SubItemSeparatorComponent: PropTypes.func,
    itemActiveOpacity: PropTypes.number,
    subActiveOpacity: PropTypes.number,
    openItems: PropTypes.array,
    itemStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
    subListProps: PropTypes.object,
    animation: PropTypes.bool,
    disabledItem: PropTypes.bool,
    disabledSubItem: PropTypes.bool
};

ExpandableList.defaultProps = {
    itemKey: 'item',
    subItemKey: 'subItem',
    singleMode: false,
    closeOnSubPress: false,
    itemActiveOpacity: 0.6,
    subActiveOpacity: 0.6,
    animation: false,
    disabledItem: false,
    disabledSubItem: false
};

export default ExpandableList;

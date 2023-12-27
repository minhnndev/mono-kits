import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
    View,
    Text,
    UIManager,
    LayoutAnimation,
    Platform,
    TouchableOpacity,
    FlatList
} from 'react-native';

class ExpandableView extends Component {
    constructor(props) {
        super(props);
        if (Platform.OS === 'android') {
            UIManager.setLayoutAnimationEnabledExperimental
            && UIManager.setLayoutAnimationEnabledExperimental(true);
        }
        this.state = {
            itemOpened: false
        };
    }

    _onPress = (item) => {
        const { onPress } = this.props;
        const { itemOpened } = this.state;
        this.setState({ itemOpened: !itemOpened });
        if (onPress) {
            onPress(item, !itemOpened);
        }
        LayoutAnimation.configureNext({
            duration: 350,
            create: {
                type: LayoutAnimation.Types.easeInEaseOut,
                property: LayoutAnimation.Properties.opacity,
            },
            update: { type: LayoutAnimation.Types.easeInEaseOut },
        });
    };

    _onSubPress = (item, index) => {
        const { onSubPress, closeOnSubPress } = this.props;
        const { itemOpened } = this.state;
        if (closeOnSubPress) {
            this.setState({ itemOpened: !itemOpened });
        }
        if (onSubPress) {
            onSubPress(item, index, !itemOpened);
        }
        LayoutAnimation.configureNext({
            duration: 350,
            create: {
                type: LayoutAnimation.Types.easeInEaseOut,
                property: LayoutAnimation.Properties.opacity,
            },
            update: { type: LayoutAnimation.Types.easeInEaseOut },
        });
    }

    _renderSubItem = ({ item, index }) => {
        const { renderSubItem, itemKey, subActiveOpacity } = this.props;
        return (
            <TouchableOpacity
                activeOpacity={subActiveOpacity}
                onPress={() => this._onSubPress(item, index)}
                // key={index.toString()}
            >
                {renderSubItem
                    ? renderSubItem(item, index)
                    : item[itemKey] ? <Text>{JSON.stringify(item)}</Text> : null}
            </TouchableOpacity>
        );
    }

    render() {
        const {
            renderItem,
            itemKey,
            subItemKey,
            rowNumberCloseMode = 0,
            data,
            ItemSeparatorComponent,
            itemActiveOpacity,
            style
        } = this.props;
        const { itemOpened } = this.state;
        let memberArr = data[subItemKey] || [];
        if (!itemOpened) {
            memberArr = memberArr.slice(0, rowNumberCloseMode);
        }
        return (
            <View style={style}>
                <TouchableOpacity
                    activeOpacity={itemActiveOpacity}
                    onPress={() => this._onPress(data)}
                >
                    { renderItem
                        ? renderItem(data[itemKey], itemOpened)
                        : data[itemKey] ? <Text>{data[itemKey]}</Text> : null }
                </TouchableOpacity>
                <FlatList
                    keyExtractor={(item, index) => index.toString()}
                    data={memberArr}
                    renderItem={this._renderSubItem}
                    ItemSeparatorComponent={ItemSeparatorComponent}
                />
            </View>
        );
    }
}

ExpandableView.defaultProps = {
    itemKey: 'item',
    subItemKey: 'subItem',
    closeOnSubPress: false,
    itemActiveOpacity: 0.6,
    subActiveOpacity: 0.6,
    style: {}
};

ExpandableView.propsType = {
    data: PropTypes.array.isRequired,
    style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
    itemKey: PropTypes.string,
    subItemKey: PropTypes.string,
    closeOnSubPress: PropTypes.bool,
    itemActiveOpacity: PropTypes.number,
    subActiveOpacity: PropTypes.number,
    onPress: PropTypes.func,
    onSubPress: PropTypes.func,
    ItemSeparatorComponent: PropTypes.func
};

export default ExpandableView;

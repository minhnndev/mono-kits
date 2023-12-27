/* eslint-disable no-extra-boolean-cast */
/* eslint-disable no-param-reassign */
import React, { Component } from 'react';
import {
    findNodeHandle,
    StyleSheet,
    UIManager,
    View,
    Platform
} from 'react-native';
import { get } from 'lodash';
import PropTypes from 'prop-types';
import {
    ValueUtil, NumberUtils, Colors, Text, RNGestureHandler
} from '@momo-kits/core';

const { TouchableOpacity } = RNGestureHandler;
export default class AutoComplete extends Component {
    constructor(props) {
        super(props);
        this.hashmapRefs = {};
        this.hashmapPosition = {};
        this.hashmapInputValue = {};
        this.selectedItem = null;
        this.childrenWithProps = null;
    }

    /**
     * func measure all component have keyAutoComplete to get it's position
     */
    measure() {
        try {
            if (this.hashmapRefs) {
                Object.keys(this.hashmapRefs)
                    .forEach((key) => {
                        if (Platform.OS === 'android') {
                            UIManager.measureLayoutRelativeToParent(findNodeHandle(this.hashmapRefs[key]), (e) => { console.error(e); }, (x, y, width, height) => {
                                this.hashmapPosition[key] = {
                                    x,
                                    y: y + height,
                                    width
                                };
                            });
                        } else {
                            UIManager.measure(findNodeHandle(this.hashmapRefs[key]), (x, y, width, height) => {
                                this.hashmapPosition[key] = {
                                    x,
                                    y: y + height,
                                    width
                                };
                            });
                        }
                    });
            }
        } catch (e) {
            console.log(`try catch :: ${e}`);
        }
    }

    componentDidMount() {
        // setTimeout to fix async
        setTimeout(() => {
            this.measure();
        }, 500);
    }

    getValueByKey = (key, value) => {
        const splitKey = key.split('-');
        return splitKey.length > 1 ? splitKey.reduce((result, item, index) => result = result + value[item] + (index === splitKey.length - 1 ? '' : !!value[item] ? ' ' : ''), '')
            : key === 'phone' ? NumberUtils.formatPhoneNumberVN(value[key]) : value[key];
    };

    /**
     *  loop all child components
     * @param {"Children"} components ;
     */
    cloneChildren(components) {
        if (components) {
            return React.Children.map(components, (child) => {
                if (!child?.props) return child;
                if (child?.props?.children && React.Children.count(child?.props?.children) > 0 && child.type.name !== Text) {
                    // component have children -> clone it and all it's children
                    return React.cloneElement(child, {
                        children: this.cloneChildren(child.props.children)
                    });
                }

                const {
                    onChangeText,
                    keyAutoComplete,
                    onFocus,
                    onEndEditing
                } = child.props;
                if (keyAutoComplete) {
                    // Update props when component have keyAutoComplete
                    if (this.selectedItem) {
                        this.hashmapInputValue[keyAutoComplete] = this.getValueByKey(keyAutoComplete, this.selectedItem);// this.selectedItem[keyAutoComplete];
                        return React.cloneElement(child, {
                            ref: (view) => this.hashmapRefs[keyAutoComplete] = view,
                            onChangeText: (text) => this.changeTextHandle(child, text, onChangeText),
                            onFocus: (e) => this.focusHandle(e, child, onFocus),
                            // value: this.getValueByKey(keyAutoComplete, this.selectedItem),
                            onEndEditing: (e) => this.endFocusHandle(e, onEndEditing)
                        });
                    }
                    return React.cloneElement(child, {
                        ref: (view) => this.hashmapRefs[keyAutoComplete] = view,
                        onChangeText: (text) => this.changeTextHandle(child, text, onChangeText),
                        onFocus: (e) => this.focusHandle(e, child, onFocus),
                        onEndEditing: (e) => this.endFocusHandle(e, onEndEditing)
                    });
                }
                return child;
            });
        }

        return components;
    }

    render() {
        const {
            style = {},
        } = this.props;
        const suggest = get(this.state, 'suggest', {});
        const childrenWithProps = this.cloneChildren(get(this.props, 'children', null));
        return (
            <View style={[{ zIndex: 1 }, style]}>
                {childrenWithProps}
                {this.renderSuggest(suggest)}
            </View>
        );
    }

    querySearch = (child, text) => {
        const keyAutoComplete = get(child.props, 'keyAutoComplete', '');
        const isShowAutoComplete = get(child.props, 'isShowAutoComplete', true);
        const { data } = this.props;
        const dataOutput = data && data.length > 0 && this.filter(data, keyAutoComplete, text);
        if (this.hashmapRefs[keyAutoComplete]) {
            this.setState({
                suggest: {
                    data: dataOutput,
                    position: this.hashmapPosition[keyAutoComplete],
                    isShowAutoComplete
                }
            });
        }
    };

    changeTextHandle = (child, text, onChangeText) => {
        this.querySearch(child, text);
        if (onChangeText && typeof onChangeText === 'function') {
            onChangeText(text);
        }
    };

    focusHandle = (e, child, onFocus) => {
        let text = '';
        if (child && typeof child.getText === 'function') {
            text = child.getText();
        }

        this.querySearch(child, text);

        if (onFocus && typeof onFocus === 'function') {
            onFocus(e);
        }
    };

    endFocusHandle = (e, onEndEditing) => {
        if (this.isShowingSuggest()) {
            this.hideSuggest();
        }
        if (onEndEditing && typeof onEndEditing === 'function') {
            onEndEditing(e);
        }
    };

    filter = (data, key, query) => {
        if (!data || !key) {
            return null;
        }
        if (query === '') {
            return data;
        }

        return data.filter((item) => {
            const valueStr = item ? this.getValueByKey(key, item) : '';
            const valueStrFormated = ValueUtil.removeAlias(valueStr)
                .toLowerCase()
                .trim()
                .replace(/\s/g, '');
            const queryFormated = ValueUtil.removeAlias(query)
                .toLowerCase()
                .trim()
                .replace(/\s/g, '');
            return (
                valueStrFormated.indexOf(queryFormated) !== -1
            );
        });
    };

    renderSuggest(suggest) {
        const { numSuggest } = this.props;
        if (suggest && suggest.data && suggest.data.length > 0 && suggest.isShowAutoComplete) {
            const { x = 0, y = 0, width = 0 } = suggest.position || {};
            const sliceData = suggest.data.slice(0, numSuggest);

            return (
                <View style={
                    [styles.containerSuggest, {
                        left: x,
                        top: y,
                        width
                    }]
                }
                >
                    {
                        sliceData.map((item, index) => (
                            <View key={index.toString()}>
                                {this.renderItem({ item, index })}
                                {index !== sliceData.length - 1 && this.renderSeparator()}
                            </View>
                        ))
                    }
                </View>

            );
        }
        return null;
    }

    renderItem = ({ item, index }) => {
        const {
            renderSuggestItem
        } = this.props;
        return (
            <TouchableOpacity onPress={() => this.onPressItemSuggest(item)}>
                {
                    (renderSuggestItem && typeof renderSuggestItem === 'function')
                        ? renderSuggestItem({ item, index })
                        : this.renderSuggestItemDefault({ item, index })
                }
            </TouchableOpacity>
        );
    };

    renderSeparator = () => (
        <View
            style={styles.separator}
        />
    );

    renderSuggestItemDefault = ({ item }) => {
        const { title, value } = item;
        return (
            <View style={[styles.viewSuggest]}>
                <Text.Title>{title}</Text.Title>
                <Text.Title>{value}</Text.Title>
            </View>
        );
    };

    onPressItemSuggest = (item) => {
        this.selectedItem = item;
        // Loop hashRef to update value of child
        Object.keys(this.hashmapRefs).forEach((key) => {
            if (this.hashmapRefs[key].setText && typeof this.hashmapRefs[key].setText === 'function') this.hashmapRefs[key].setText(this.getValueByKey(key, this.selectedItem));
            if (this.hashmapRefs[key].setValue && typeof this.hashmapRefs[key].setValue === 'function') this.hashmapRefs[key].setValue(this.getValueByKey(key, this.selectedItem));
        });

        const {
            onSelected
        } = this.props;
        this.setState({
            suggest: {}
        }, () => {
            if (onSelected && typeof onSelected === 'function') {
                onSelected(item);
            }
            this.selectedItem = null;
        });
    };

    isShowingSuggest = () => {
        const { suggest } = this.state;
        return suggest && suggest.data && suggest.data.length > 0;
    };

    hideSuggest = () => {
        this.setState({
            suggest: {}
        }, () => {
            this.selectedItem = null;
        });
    };
}

const styles = StyleSheet.create({
    viewSuggest: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 5,
    },
    containerSuggest: {
        backgroundColor: 'white',
        paddingVertical: 10,
        paddingHorizontal: 12,
        position: 'absolute',
        maxHeight: 240,
        borderColor: '#DADADA',
        borderRadius: 4,
        borderWidth: 1,
        shadowColor: '#000000',
        shadowOffset: {
            width: 0,
            height: 1
        },
        shadowRadius: 1,
        elevation: 2,
        shadowOpacity: 0.5,
    },
    separator: {
        height: 1,
        width: '100%',
        backgroundColor: Colors.placeholder,
        marginVertical: 10
    }
});

AutoComplete.propTypes = {
    style: PropTypes.oneOfType([PropTypes.array, PropTypes.object, PropTypes.number]),
    data: PropTypes.arrayOf(PropTypes.object).isRequired,
    renderSuggestItem: PropTypes.func,
    onSelected: PropTypes.func.isRequired,
    numSuggest: PropTypes.number,
};

AutoComplete.defaultProps = {
    numSuggest: 2,
};

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Text, ValueUtil } from '@momo-kits/core';
import Radio from './Radio';

const styles = StyleSheet.create({
    listContainer: {

    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',

    },
    buttonContainerColmn: {
        marginVertical: 3
    },
    buttonContainerRow: {
        marginHorizontal: 3,
        flex: 1
    },
    buttonContainerRowNumColumns: {
        marginVertical: 5
    },
    title: {
        marginBottom: 8,
        fontWeight: 'bold'
    }
});

export default class RadioButton extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedIndex: props.defaultIndex,
            width: 0
        };
    }

    setSelectedIndex = (index) => {
        this.setState({ selectedIndex: index }, () => {
            const { onChange } = this.props;
            onChange(index);
        });
    }

    renderButtonItem = ({ item, index }) => {
        const {
            disableButtons = {}, direction, numColumns,
            itemContainerStyle
        } = this.props;
        const { selectedIndex } = this.state;
        const selected = selectedIndex === index;
        const disable = disableButtons?.[index];

        const { width } = this.state;
        let itemWidthStyle = {};
        let itemStyle = styles.buttonContainerColmn;
        if (direction === 'row') {
            itemStyle = styles.buttonContainerRow;
        } else if (numColumns > 1) {
            itemStyle = styles.buttonContainerRowNumColumns;
            itemWidthStyle = { width: width / numColumns };
        }

        const renderRadioButton = () => this.renderDefaultRadioButton(selected, disable, item, index);
        return (
            <View
                key={index.toString()}
                style={[itemStyle, itemWidthStyle,
                    ValueUtil.extractStyle(itemContainerStyle)]}
            >
                {renderRadioButton?.()}
            </View>

        );
    }

    renderDefaultRadioButton = (selected, disable, value, index) => {
        const {
            renderRadioButton, hideTitle, radioStyle, valueStyle, disableOnChange = false
        } = this.props;
        const onButtonPress = () => this.setSelectedIndex(index);

        if (typeof renderRadioButton === 'function') {
            return renderRadioButton({
                selected, disable, value, index, onPress: onButtonPress
            });
        }

        return (
            <Radio
                disableOnChange={disableOnChange}
                onPress={onButtonPress}
                disable={disable}
                selected={selected}
                hideTitle={hideTitle}
                radioStyle={radioStyle}
                valueStyle={valueStyle}
                value={value}
            />
        );
    }

    renderButton = () => {
        const {
            data = [], direction, numColumns, listProps
        } = this.props;
        const contentContainerStyle = {};
        if (direction === 'row') {
            contentContainerStyle.justifyContent = 'space-between';
            contentContainerStyle.flexGrow = 1;
        }
        return (
            <View
                style={[styles.listContainer, { flexDirection: direction }]}
                onLayout={(e) => {
                    this.setState({ width: e.nativeEvent.layout.width });
                }}
            >
                <FlatList
                    scrollEnabled={false}
                    horizontal={direction === 'row'}
                    numColumns={numColumns}
                    data={data}
                    contentContainerStyle={contentContainerStyle}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={this.renderButtonItem}
                    {...listProps}
                />
            </View>
        );
    }

    render() {
        const { title, titleStyle, style } = this.props;
        return (
            <View style={style}>
                {title ? <Text.Title style={[styles.title, ValueUtil.extractStyle(titleStyle)]}>{title}</Text.Title> : <View />}
                {this.renderButton()}
            </View>
        );
    }
}

RadioButton.propTypes = {
    data: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.string), PropTypes.arrayOf(PropTypes.number)]),
    defaultIndex: PropTypes.number,
    direction: PropTypes.oneOf(['column', 'row']),
    disableButtons: PropTypes.shape({
        index: PropTypes.bool
    }),
    onChange: PropTypes.func,
    style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
    title: PropTypes.any,
    titleStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
    valueStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
    itemContainerStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
    numColumns: PropTypes.number,
    listProps: PropTypes.object,
    radioStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array])
};

RadioButton.defaultProps = {
    direction: 'column',
    numColumns: 1,
    listProps: {}
};

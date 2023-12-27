import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { View, StyleSheet, Dimensions, Platform } from 'react-native';
import {
    IconSource,
    Colors,
    ScreenUtils,
    BottomPopupHeader,
    Spacing,
} from '@momo-kits/core';
import SelectionItemList from './SelectionItemList';

const { ifIphoneX } = ScreenUtils;

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        paddingVertical: 10,
        paddingBottom: ifIphoneX(20, 0),
        maxHeight: Dimensions.get('window').height * 0.66,
    },
    title: {
        color: '#222222',
        fontWeight: 'bold',
    },
    body: {
        marginTop: 10,
        marginBottom: 5,
    },
    header: {
        paddingHorizontal: 10,
        paddingVertical: 5,
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    icClose: {
        width: 14,
        height: 14,
    },
    selectedItemStyle: {
        backgroundColor: Colors.pink_11,
        borderRadius: 6,
        borderWidth: 2,
        borderColor: Colors.pink_07,
    },
    footerView: { marginHorizontal: 10, paddingBottom: 10, marginTop: 10 },
});

const defaultItemProps = {
    alignCentered: true,
    leftIconStyle: {
        width: 36,
        height: 36,
    },
    rightIconStyle: {
        tintColor: 'green',
        width: 20,
        height: 20,
    },
};

export default class BottomSelectionList extends Component {
    constructor(props) {
        super(props);
        this.pressItemTimeout = null;
        const dimensions =
            Platform.OS === 'android' ? Dimensions.get('window') : {};
        this.state = {
            dimensions,
        };
    }

    componentDidMount() {
        if (this.inputRef) {
            this.inputRef.focus();
        }
        this.subscription = Dimensions.addEventListener(
            'change',
            ({ window }) => {
                if (
                    window?.height > 0 &&
                    window?.width > 0 &&
                    Platform.OS === 'android'
                ) {
                    this.setState({ dimensions: window });
                }
            },
        );
    }

    componentWillUnmount() {
        this.subscription?.remove?.();
    }

    onClose = () => {
        const { requestClose, navigator, onClosePopup } = this.props;
        if (requestClose && typeof requestClose === 'function')
            requestClose(onClosePopup);
        else if (navigator) navigator.dismiss();
    };

    onItemPress = (item, index, selectedIndecies) => {
        if (this.pressItemTimeout) return;
        const { onItemPress, closeOnItemPress, delay } = this.props;
        this.pressItemTimeout = setTimeout(() => {
            this.pressItemTimeout = null;
        }, delay);
        if (onItemPress && typeof onItemPress === 'function')
            onItemPress(item, index, selectedIndecies);
        if (!closeOnItemPress) return;
        this.onClose();
    };

    renderFooterComponent = () => {
        const { renderFooterComponent, requestClose } = this.props;
        if (typeof renderFooterComponent === 'function') {
            return (
                <View style={styles.footerView}>
                    {renderFooterComponent(requestClose)}
                </View>
            );
        }
        return <View />;
    };

    onRightButtonPress = () => {
        const { onRightButtonPress } = this.props;
        onRightButtonPress?.(this.onClose);
    };

    render() {
        const { dimensions } = this.state;
        const {
            title,
            body,
            itemProps,
            selectedItemStyle,
            data,
            selectedIndex,
            style,
            headerStyle,
            buttonTitle,
            onButtonPress,
            iconClosePosition,
            rightButtonStyle,
            rightButtonTitle,
            rightTitleStyle,
            iconType,
            closeTextStyle,
        } = this.props;
        const width = dimensions?.width > 0 ? dimensions?.width : undefined;
        return (
            <View style={[styles.container, { width }, style]}>
                <BottomPopupHeader
                    iconClosePosition={iconClosePosition}
                    body={body}
                    onClose={this.onClose}
                    title={title}
                    buttonTitle={buttonTitle}
                    onButtonPress={onButtonPress}
                    style={headerStyle}
                    rightButtonTitle={rightButtonTitle}
                    rightButtonStyle={rightButtonStyle}
                    rightTitleStyle={rightTitleStyle}
                    iconType={iconType}
                    buttonStyle={closeTextStyle}
                    onRightButtonPress={this.onRightButtonPress}
                />
                <SelectionItemList
                    isListItem
                    //selectionIcon={IconSource.ic_check_24}
                    {...this.props}
                    selectedIndex={selectedIndex}
                    data={data}
                    selectedItemStyle={[
                        styles.selectedItemStyle,
                        selectedItemStyle,
                    ]}
                    itemProps={Object.assign(defaultItemProps, itemProps)}
                    onItemPress={this.onItemPress}
                    style={{ paddingHorizontal: Spacing.M }}
                />
                {this.renderFooterComponent()}
            </View>
        );
    }
}

BottomSelectionList.propTypes = {
    data: PropTypes.array,
    body: PropTypes.string,
    headerStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
    itemProps: PropTypes.object,
    navigator: PropTypes.any,
    onClose: PropTypes.func,
    onClosePopup: PropTypes.func,
    onItemPress: PropTypes.func,
    selectedIndex: PropTypes.number,
    selectedItemStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
    style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
    title: PropTypes.string,
    selectedItemTitleStyle: PropTypes.oneOfType([
        PropTypes.object,
        PropTypes.array,
    ]),
    closeOnItemPress: PropTypes.bool,
    rightButtonTitle: PropTypes.string,
    rightButtonStyle: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
    rightTitleStyle: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
    onRightButtonPress: PropTypes.func,
    delay: PropTypes.number,
    closeTextStyle: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
};

BottomSelectionList.defaultProps = {
    closeOnItemPress: true,
    delay: 1000,
};

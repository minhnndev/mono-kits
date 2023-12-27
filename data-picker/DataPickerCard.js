import React, { Component } from 'react';
import {
    StyleSheet, View, TouchableOpacity
} from 'react-native';
import PropTypes from 'prop-types';
import { Image, Text, IconSource } from '@momo-kits/core';
import Skeleton from '@momo-kits/skeleton';

const BORDER_RADIUS = 8;
const PADDING_TOP_BOTOM = 12;
const PADDING_START_END = 6;

const styles = StyleSheet.create({
    cardPicker: {
        backgroundColor: '#FFFFFF',
        alignItems: 'center',
        alignContent: 'center',
        justifyContent: 'center',
        paddingTop: PADDING_TOP_BOTOM,
        paddingBottom: PADDING_TOP_BOTOM,
        paddingStart: PADDING_START_END,
        paddingEnd: PADDING_START_END,
        borderRadius: BORDER_RADIUS,

    },
    cardLoading: {
        paddingTop: PADDING_TOP_BOTOM,
        paddingBottom: PADDING_TOP_BOTOM,
        paddingStart: PADDING_START_END,
        paddingEnd: PADDING_START_END,
        borderRadius: BORDER_RADIUS,
    },
    cardPickerNotSelected: {
        borderColor: '#C7C7CD',
        borderWidth: 1,
    },
    cardPickerSelected: {
        borderColor: '#b0006d',
        borderWidth: 1,
        shadowColor: '#C7C7CD',
        shadowOpacity: 0.3,
        shadowRadius: 3,
        shadowOffset: {
            height: 3,
            width: 0
        }
    },
    cardPickerHide: {
        opacity: 0
    },
    cardDisable: {
        backgroundColor: '#f6f7f8',
        borderColor: '#f6f7f8',
        shadowOpacity: 0,
        opacity: 0.5
    },
    flexRow: {
        flex: 1
    },
    imageCheck: {
        position: 'absolute',
        top: -1,
        left: -1,
        borderTopLeftRadius: BORDER_RADIUS,
        width: 20,
        height: 19
    },
    label: {
        textAlign: 'center',
        // fontSize: 12,
        color: '#222222'
    },
    containerWithIcon: {
        alignContent: 'center',
        justifyContent: 'center',
        alignItems: 'center'
    },
    labelWithIcon: {
        // fontSize: 10,
        color: '#222222',
        marginTop: 4,
        textAlign: 'center'
    },
    icon: {
        width: 24,
        height: 24,
        resizeMode: 'contain'
    },
});

export default class DataPickerCard extends Component {
    render() {
        const {
            disable, selected, hide, style, onPress, loading
        } = this.props;
        if (hide) {
            return (<View style={[styles.cardPicker, styles.cardPickerNotSelected, styles.cardPickerHide, style]} />);
        }

        if (loading) {
            return (
                <Skeleton.Media
                    style={[styles.cardLoading, style]}
                    isRound={false}
                />
            );
        }

        if (disable) {
            return (
                <View
                    style={[styles.cardPicker, styles.cardPickerNotSelected, styles.cardDisable, style]}
                >
                    {
                        this.renderContentCard()
                    }
                </View>
            );
        }

        return (
            <TouchableOpacity
                style={[styles.cardPicker,
                    selected ? styles.cardPickerSelected : styles.cardPickerNotSelected,
                    style]}
                onPress={onPress}
            >
                {
                    this.renderContentCard()
                }
                {
                    selected ? (
                        <Image
                            source={IconSource.ic_check_mini}
                            style={styles.imageCheck}
                        />
                    ) : null
                }
            </TouchableOpacity>
        );
    }

    renderContentCard = () => {
        const {
            renderContent, icon, label, labelStyle, iconSelected, iconStyle, selected
        } = this.props;
        if (renderContent && typeof renderContent === 'function') {
            return renderContent();
        }

        let iconCard = icon;
        if (iconSelected && selected) {
            iconCard = iconSelected;
        }

        if (icon) {
            return (
                <View style={styles.containerWithIcon}>
                    <Image
                        source={iconCard}
                        style={[styles.icon, iconStyle]}
                    />
                    {label ? <Text.Caption style={[styles.labelWithIcon, labelStyle]}>{label}</Text.Caption> : null}
                </View>
            );
        }
        return label ? (<Text.SubTitle style={[styles.label, labelStyle]}>{label}</Text.SubTitle>) : null;
    }
}

DataPickerCard.propTypes = {
    disable: PropTypes.bool,
    selected: PropTypes.bool,
    hide: PropTypes.bool,
    renderContent: PropTypes.func,
    label: PropTypes.string,
    labelStyle: PropTypes.oneOfType([PropTypes.array, PropTypes.object, PropTypes.number]),
    style: PropTypes.oneOfType([PropTypes.array, PropTypes.object, PropTypes.number]),
    onPress: PropTypes.func,
    loading: PropTypes.bool,
    icon: PropTypes.oneOfType([PropTypes.object, PropTypes.number, PropTypes.string]),
    iconSelected: PropTypes.oneOfType([PropTypes.object, PropTypes.number, PropTypes.string]),
    iconStyle: PropTypes.oneOfType([PropTypes.array, PropTypes.object, PropTypes.number])
};

DataPickerCard.defaultProps = {
    disable: false,
    selected: false,
    hide: false,
    renderContent: null,
    label: null,
    labelStyle: null,
    style: null,
    onPress: null,
    loading: false,
    icon: null,
    iconSelected: null,
    iconStyle: null
};

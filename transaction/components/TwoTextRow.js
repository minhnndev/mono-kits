import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import { Colors, ScaleSize } from '@momo-kits/core';
import PropTypes from 'prop-types';
import TwoTextRowBase from './TwoTextRowBase';

const styles = StyleSheet.create({
    header: {
        fontWeight: 'bold',
        color: Colors.black_12,
        fontSize: ScaleSize(14),
        lineHeight: 18,
        textTransform: 'uppercase',
    },
    link: { fontSize: ScaleSize(14), color: Colors.link },
    title: { color: Colors.black_12, fontSize: ScaleSize(14) },
    value: { fontSize: ScaleSize(14), color: Colors.black_17 },
});

export default class TwoTextRow extends Component {
    render() {
        const {
            title,
            titleStyle,
            value,
            valueStyle,
            isHeader,
            onPress,
            onPressLeft,
            iconLeft,
            iconLeftStyle,
            selectableValue,
            iconRight,
            iconStyle,
            caption,
        } = this.props;
        if (isHeader) {
            return (
                <TwoTextRowBase
                    {...this.props}
                    title={{
                        text: title,
                        style: [styles.header, titleStyle],
                        onPressLeft,
                        iconLeft,
                        iconLeftStyle,
                    }}
                    value={{
                        text: value,
                        onPress,
                        style: [styles.link, valueStyle],
                        selectable: selectableValue,
                        icon: iconRight,
                    }}
                />
            );
        }
        return (
            <TwoTextRowBase
                {...this.props}
                title={{
                    text: title,
                    style: [styles.title, titleStyle],
                    caption,
                    onPressLeft,
                    iconLeft,
                    iconLeftStyle,
                }}
                value={{
                    text: value,
                    onPress,
                    style: [styles.value, valueStyle],
                    selectable: selectableValue,
                    icon: iconRight,
                    iconStyle,
                }}
            />
        );
    }
}

TwoTextRow.propTypes = {
    title: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    titleStyle: PropTypes.oneOfType([
        PropTypes.array,
        PropTypes.object,
        PropTypes.number,
    ]),
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    valueStyle: PropTypes.oneOfType([
        PropTypes.array,
        PropTypes.object,
        PropTypes.number,
    ]),
    isHeader: PropTypes.bool,
    onPress: PropTypes.func,
};

TwoTextRow.defaultProps = {
    title: null,
    titleStyle: null,
    value: null,
    valueStyle: null,
    isHeader: false,
    onPress: null,
};

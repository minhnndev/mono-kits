import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import { get } from 'lodash';
import {
    Colors,
    Text,
    TouchableOpacity,
    Spacing,
    Image,
    Radius,
} from '@momo-kits/core';
import PropTypes from 'prop-types';
import CommonUtils from '../utils/CommonUtils';

const FONT_WEIGHT_BOLD = CommonUtils.getFontWeightMedium();

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: Spacing.M,
        minHeight: 42,
    },
    containerTitle: {
        flexShrink: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
    title: {
        color: Colors.black_01,
        textAlign: 'left',
    },
    containerCaption: {
        backgroundColor: Colors.red_05,
        marginStart: Spacing.S,
        paddingHorizontal: Spacing.S,
        borderRadius: Radius.S,
    },
    caption: {
        color: Colors.white,
    },
    containerValue: {
        flexShrink: 0,
        maxWidth: '50%',
        marginStart: Spacing.S,
        flexDirection: 'row',
        alignItems: 'center',
    },
    value: {
        color: Colors.black_17,
        textAlign: 'right',
    },
    divider: {
        width: '100%',
        position: 'absolute',
        bottom: 0,
    },
    dividerTop: {
        top: 0,
    },
    icon: {
        width: 20,
        height: 20,
        tintColor: Colors.link,
        resizeMode: 'contain',
    },
});

export default class TwoTextRowBase extends Component {
    render() {
        const { style } = this.props;
        return (
            <View {...this.props} style={[styles.container, style]}>
                {this.renderDevider('top')}
                {this.renderLabel(true)}
                {this.renderLabel(false)}
                {this.renderDevider()}
            </View>
        );
    }

    renderLabel = (isLeft) => {
        const label = get(this.props, isLeft ? 'title' : 'value', {});
        const styleContainerOfLabel = isLeft
            ? styles.containerTitle
            : styles.containerValue;
        const styleLabelOfLabel = isLeft ? styles.title : styles.value;
        const text = label.text || '';
        let { onPress, icon, iconStyle } = label;
        const { style, caption } = label;

        if (isLeft) {
            onPress = label?.onPressLeft;
            iconStyle = label?.iconLeftStyle;
            icon = label?.iconLeft;
        }

        const { boldValue } = this.props;
        const weightStyle = !isLeft && boldValue ? { fontWeight: FONT_WEIGHT_BOLD } : null;

        if (onPress && typeof onPress === 'function') {
            return (
                <TouchableOpacity
                    onPress={onPress}
                    style={[styleContainerOfLabel, label.containers]}
                >
                    <Text.Title
                        {...label}
                        style={[styleLabelOfLabel, weightStyle, style]}
                    >
                        {text}
                    </Text.Title>
                    {!!icon && (
                        <Image source={icon} style={[styles.icon, iconStyle]} />
                    )}
                </TouchableOpacity>
            );
        }
        return (
            <View style={[styleContainerOfLabel, label.containerStyle]}>
                <Text.Title
                    {...label}
                    style={[styleLabelOfLabel, weightStyle, style]}
                >
                    {text}
                </Text.Title>
                {caption ? (
                    <View style={styles.containerCaption}>
                        <Text.Caption style={styles.caption}>
                            {caption}
                        </Text.Caption>
                    </View>
                ) : null}
            </View>
        );
    };

    renderDevider = () => {
        const { divider, dividerTop, dividerStyle } = this.props;
        if (dividerTop || divider) {
            const { height, color } = dividerStyle || {};
            return (
                <View
                    style={[
                        styles.divider,
                        dividerTop ? styles.dividerTop : null,
                        dividerStyle,
                        {
                            height: height || 0.5,
                            backgroundColor: color || Colors.borders,
                        },
                    ]}
                />
            );
        }
        return null;
    };
}

TwoTextRowBase.propTypes = {
    style: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
    title: PropTypes.object,
    value: PropTypes.object,
    divider: PropTypes.bool,
    dividerTop: PropTypes.bool,
    dividerStyle: PropTypes.object,
    boldValue: PropTypes.bool,
};

TwoTextRowBase.defaultProps = {
    style: null,
    title: {
        text: null,
        onPress: null,
        style: null,
        containerStyle: null,
    },
    value: {
        text: null,
        onPress: null,
        style: null,
        containerStyle: null,
    },
    divider: false,
    dividerTop: false,
    dividerStyle: null,
    boldValue: false,
};

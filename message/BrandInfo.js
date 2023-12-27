import React, { Component } from 'react';
import {
    View, StyleSheet, TouchableOpacity
} from 'react-native';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import {
    Colors, Image, ValueUtil, Text, ScaleSize
} from '@momo-kits/core';
import HTMLView from '@momo-kits/html-view';

const MAX_WIDTH = 44;
const ICON_WIDTH = 42;
const BORDER_WIDTH = 0.5;

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        backgroundColor: 'white',
        paddingVertical: 10,
        paddingHorizontal: 15
    },
    logo: {
        width: 42,
        height: 42,
        borderRadius: 4
    },
    title: {
        color: Colors.black_17,
        fontWeight: 'bold',
    },
    body: {
        fontSize: ScaleSize(14),
        color: Colors.black_12,
        marginTop: 3
    },
    rightIcon: {
        tintColor: Colors.hint,
        width: 24,
        height: 24
    },
    infoView: {
        marginLeft: 15,
        flexDirection: 'row',
        justifyContent: 'space-between',
        flex: 1,
        alignItems: 'center'
    },
    border: {
        borderWidth: 0.5,
        borderColor: Colors.borders,
        borderRadius: 4,
        maxWidth: 44,
        maxHeight: 44
    }
});

export default class BrandInfo extends Component {
    onPress = () => {
        const { onPress } = this.props;
        if (onPress && typeof onPress === 'function') onPress();
    }

    render() {
        const {
            source, title, body, rightIcon, style, onPress,
            logoBordered = false, borderStyle = {}, leftIconStyle = {}, titleStyle,
            rightIconStyle = {}, alignCentered = false, rightComponent, maxNumberOfLines = 2, bodyStyle, titleMaxLines = 1,
            resizeMode = 'cover'
        } = this.props;
        const rightIconSource = ValueUtil.getImageSource(rightIcon);
        const defaultMaxWidth = get(borderStyle, 'width', MAX_WIDTH);
        const defaultIconWidth = get(leftIconStyle, 'width', ICON_WIDTH);
        const defaultBorderWidth = get(borderStyle, 'borderWidth', BORDER_WIDTH);
        const autoMargin = ((defaultMaxWidth - defaultIconWidth) / 2) - (defaultBorderWidth * 2);
        return (
            <TouchableOpacity onPress={this.onPress} activeOpacity={onPress ? 0.5 : 1}>
                <View style={[styles.container, style]}>
                    <View style={logoBordered ? [styles.border, ValueUtil.mergeStyle(borderStyle)] : {}}>
                        <Image
                            style={[styles.logo, { margin: autoMargin }, ValueUtil.mergeStyle(leftIconStyle)]}
                            source={source}
                            resizeMode={resizeMode}
                        />
                    </View>
                    <View style={styles.infoView}>
                        <View style={[alignCentered ? {} : { height: '100%' }, { flex: 1 }]}>
                            <Text.H4 numberOfLines={titleMaxLines} style={[styles.title, ValueUtil.mergeStyle(titleStyle)]}>{title}</Text.H4>
                            {body ? (
                                <HTMLView
                                    styleSheet={{
                                        div: [styles.body, ValueUtil.mergeStyle(bodyStyle)]
                                    }}
                                    nodeComponentProps={{ numberOfLines: maxNumberOfLines }}
                                    value={`<div>${body}<div>`}
                                />
                            ) : <View />}
                        </View>
                        {rightIcon && !rightComponent
                            ? (
                                <Image
                                    source={rightIconSource}
                                    style={[styles.rightIcon, ValueUtil.mergeStyle(rightIconStyle)]}
                                />
                            ) : <View />}
                        {rightComponent}
                    </View>
                </View>
            </TouchableOpacity>

        );
    }
}

BrandInfo.propTypes = {
    alignCentered: PropTypes.bool,
    borderStyle: PropTypes.object,
    rightIconStyle: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
    leftIconStyle: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
    body: PropTypes.string,
    logoBordered: PropTypes.bool,
    title: PropTypes.string,
    onPress: PropTypes.func,
    rightIcon: PropTypes.oneOfType([PropTypes.number, PropTypes.object, PropTypes.string]),
    source: PropTypes.oneOfType([PropTypes.number, PropTypes.object]),
    style: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
    bodyStyle: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
    titleStyle: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
    titleMaxLines: PropTypes.number,
    maxNumberOfLines: PropTypes.number
};

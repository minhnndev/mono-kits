import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { get } from 'lodash';

import {
    Text, Colors, ValueUtil, Image as FastImage, IconSource, Spacing
} from '@momo-kits/core';
import Separator from '@momo-kits/separator';
import HtmlView from '@momo-kits/html-view';

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
    },
    rightView: {
        marginTop: 4,
        flex: 1,
        marginLeft: 10,
        paddingBottom: 8
    },
    icon: {
        width: 50,
        height: 50,
        backgroundColor: Colors.light_periwinkle,
        borderRadius: 25
    },
    title: {
        color: '#222222'
    },
    content: {
        marginTop: 3,
        flex: 1
    },
    verticalLine: {
        position: 'absolute',
        left: 25,
        top: 2,
        bottom: 0,
        borderColor: Colors.light_blue_grey_three,
    },
    activeCircleContainer: {
        backgroundColor: Colors.pink_09
    },
    activeCircle: {
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: Colors.pink_05_b,
        justifyContent: 'center',
        alignItems: 'center',
    },
    defaultCircleContainer: {
        backgroundColor: Colors.black_02
    },
    number: {
        color: Colors.white
    },
    defaultCircle: {
        backgroundColor: Colors.black_09,
        width: 20,
        height: 20,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    circle: {
        width: 24,
        height: 24,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 14,
        marginTop: 2,
    },
    checkIcon: { tintColor: 'white', width: 16, height: 16 },
    seperateLine: {
        borderBottomWidth: 1,
        borderBottomColor: Colors.black_04,
        marginVertical: Spacing.M
    }
});

export default class StepGuideItem extends Component {
    onLayout = ({ nativeEvent }) => {
        const { onHeightCalculated } = this.props;
        if (onHeightCalculated && typeof onHeightCalculated === 'function') onHeightCalculated(nativeEvent.layout.height);
    }

    renderNumber = (props, itemIndex) => {
        const { activeIndex } = this.props;
        const containerStyle = [styles.circle, styles.defaultCircleContainer];
        const circleStyle = [styles.defaultCircle];
        let NumberView = <Text.SubTitle style={styles.number}>{itemIndex + 1}</Text.SubTitle>;
        if (itemIndex <= activeIndex) {
            containerStyle.push(styles.activeCircleContainer);
            circleStyle.push(styles.activeCircle);
        } if (itemIndex < activeIndex) {
            NumberView = <FastImage style={styles.checkIcon} source={{ uri: IconSource.ic_check_24 }} />;
        }
        return (
            <View style={containerStyle}>
                <View style={circleStyle}>
                    {NumberView}
                </View>
            </View>
        );
    }

    renderIconContent = (props, itemIndex) => {
        const {
            source, iconStyle, type, useNativeImage
        } = props;
        if (type === 'number') return this.renderNumber(props, itemIndex);
        const ImageComponent = useNativeImage ? Image : FastImage;
        return <ImageComponent style={[styles.icon, iconStyle]} source={source} />;
    }

    render() {
        const {
            iconStyle, style, title, contents, contentStyle, lineStyle, hideLine, lineProps = {},
            itemIndex, activeIndex, lineType, directionLine, type, titleStyle, subTitleStyle, onLinkPress = () => { }, seperateLine
        } = this.props;
        if (!Array.isArray(contents)) return <View />;
        const iconWidth = get(iconStyle, 'width', 50);
        let lineColor = Colors.light_blue_grey_three;
        if (itemIndex < activeIndex) {
            lineColor = Colors.pink_09;
        }

        let seperateLineStyle = {};
        if (seperateLine && !hideLine) {
            seperateLineStyle = styles.seperateLine;
        }

        return (
            <View style={[styles.container, style]} onLayout={this.onLayout}>
                {hideLine ? <View /> : (
                    <Separator
                        style={[styles.verticalLine, { left: iconWidth / 2 }, lineStyle, type === 'number' ? { bottom: -12 } : {}]}
                        type={lineType}
                        direction={directionLine}
                        color={lineColor}
                        length="95%"
                        thickness={1}
                        {...lineProps}
                    />
                )}
                {this.renderIconContent(this.props, itemIndex)}
                <View style={[styles.rightView, seperateLineStyle, contentStyle]}>
                    {title ? (
                        (itemIndex === activeIndex || activeIndex < 0) ? <Text.H4 weight="bold" style={[styles.title, ValueUtil.extractStyle(titleStyle)]}>{title}</Text.H4> : (
                            <Text.H4
                                weight="regular"
                                style={[styles.title, ValueUtil.extractStyle(titleStyle)]}
                            >
                                {title}
                            </Text.H4>
                        )
                    ) : <View />}
                    {contents.map((content, index) => {
                        const onLinkPressFunc = () => onLinkPress(content, index);
                        if (content?.includes('<div>') || content?.includes('</div>')) {
                            return (
                                <HtmlView
                                    onLinkPress={onLinkPressFunc}
                                    key={index.toString()}
                                    styleSheet={{ div: [styles.content] }}
                                    value={content}
                                />
                            );
                        }
                        return <Text.Title key={index.toString()} style={[styles.content, ValueUtil.extractStyle(subTitleStyle)]}>{content}</Text.Title>;
                    })}
                </View>
            </View>
        );
    }
}

StepGuideItem.propTypes = {
    contents: PropTypes.arrayOf(PropTypes.string),
    contentStyle: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
    iconStyle: PropTypes.PropTypes.oneOfType([PropTypes.array, PropTypes.object, PropTypes.string]),
    titleStyle: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
    source: PropTypes.oneOfType([PropTypes.object, PropTypes.number, PropTypes.string]),
    style: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
    title: PropTypes.string,
    lineProps: PropTypes.object,
    activeIndex: PropTypes.number,
    useNativeImage: PropTypes.bool,
    lineType: PropTypes.oneOf(['solid', 'dash']),
    directionLine: PropTypes.oneOf(['horizontal', 'vertical'])
};

StepGuideItem.defaultProps = {
    contents: [],
    useNativeImage: false,
    lineType: 'dash',
    directionLine: 'vertical'
};

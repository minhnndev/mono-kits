/* eslint-disable react-native/no-inline-styles */
import React, { Component } from 'react';
import {
    Animated,
    View,
    UIManager,
    findNodeHandle,
    StyleSheet,
} from 'react-native';
import {
    Colors,
    ScaleSize,
    NumberUtils,
    Text,
    Spacing,
    Radius,
} from '@momo-kits/core';

let BAR_HEIGHT = 200;

const styles = StyleSheet.create({
    numberText: {
        fontSize: ScaleSize(10),
        lineHeight: 12,
        //fontWeight: 'bold',
        textAlign: 'center',
        //position: 'absolute',
        //bottom: 0,
    },
});

export default class AnimatedBar extends Component {
    constructor(props) {
        super(props);
        this.animated = new Animated.Value(0);
        const { selected, number, barHeight, isRenderLabel } = this.props;
        BAR_HEIGHT = barHeight || 200;
        this.state = { selected, number, isRenderLabel };
        this.textRef = React.createRef();
    }

    componentDidMount() {
        this.animateTo(this.props.delay, this.props.value);
    }

    static getDerivedStateFromProps(nextProps) {
        return {
            selected: nextProps.selected,
            number: nextProps.number,
            isRenderLabel: nextProps.isRenderLabel,
        };
    }

    animateTo = (delay, value) => {
        Animated.sequence([
            Animated.delay(delay),
            Animated.timing(this.animated, {
                toValue: value || 0,
                duration: 500,
                useNativeDriver: false,
            }),
        ]).start();
    };

    measure = () => {
        if (!this.textRef?.current) {
            return;
        }
        try {
            UIManager.measure(
                findNodeHandle(this.textRef.current),
                (x, y, width, height, px, py) => {
                    const { spaceBetween, barWidth, measureListChart } =
                        this.props;
                    if (!measureListChart) {
                        return;
                    }
                    const { px: pxListChart, width: widthListChart } =
                        measureListChart;
                    if (px < pxListChart) {
                        this.setState({ fixPosition: { left: 0 } });
                    } else if (px + width > pxListChart + widthListChart) {
                        this.setState({
                            fixPosition: {
                                right: -(spaceBetween * 2 + barWidth),
                            },
                        });
                    }
                },
            );
        } catch (e) {
            console.log(e, 'Measure Animated Bar error');
        }
    };

    onLayout = () => {
        this.measure();
        // setTimeout(() => {
        //     this.measure();
        // }, 100);
    };

    render() {
        const { number = 0, selected, isRenderLabel } = this.state;
        const translate = this.animated.interpolate({
            inputRange: [0, BAR_HEIGHT],
            outputRange: [0, BAR_HEIGHT],
        });
        const {
            suffix = '',
            spaceBetween,
            activeBarColor,
            inactiveBarColor,
            activeValueColor,
        } = this.props;

        return (
            <View>
                {isRenderLabel && (
                    <Animated.View
                        style={[
                            {
                                position: 'absolute',
                                bottom: translate,
                                alignItems: 'center',
                                alignSelf: 'center',
                                backgroundColor: 'white',
                                paddingHorizontal: Spacing.S,
                                paddingVertical: Spacing.XS,
                                shadowColor: '#000',
                                shadowOpacity: 0.25,
                                shadowOffset: { width: 0, height: 10 },
                                shadowRadius: 10,
                                elevation: 2,
                                borderRadius: Radius.M,
                                marginBottom: Spacing.XS,
                            },
                            // isEmpty(fixPosition) ? {} : { alignItems: 'center', alignSelf: 'center' },
                        ]}>
                        <Text
                            weight="bold"
                            ref={this.textRef}
                            numberOfLines={1}
                            ellipsizeMode="clip"
                            style={[
                                styles.numberText,
                                {
                                    color: activeValueColor || Colors.black_12,
                                },
                            ]}
                            onLayout={this.onLayout}>
                            {NumberUtils.formatNumberToMoney(number, suffix)}
                        </Text>
                    </Animated.View>
                )}
                <View
                    style={{
                        justifyContent: 'flex-end',
                        height: BAR_HEIGHT,
                        paddingHorizontal: spaceBetween,
                    }}>
                    <Animated.View
                        style={[
                            {
                                transform: [{ scaleY: -1 }],
                                borderBottomLeftRadius: 4,
                                borderBottomRightRadius: 4,
                                backgroundColor: selected
                                    ? activeBarColor || Colors.pink_05
                                    : inactiveBarColor || Colors.pink_09,
                                height: translate,
                            },
                        ]}
                    />
                </View>
            </View>
        );
    }
}

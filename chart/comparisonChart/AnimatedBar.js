import React, { Component } from 'react';
import {
    Animated,
    View,
    UIManager,
    findNodeHandle,
    StyleSheet,
} from 'react-native';
import { Text, Spacing, Colors, Radius, NumberUtils } from '@momo-kits/core';
import CustomColors from './CustomColors';

let BAR_HEIGHT = 200;

const styles = StyleSheet.create({
    numberText: {
        textAlign: 'center',
        //position: 'absolute',
        //bottom: Spacing.ZERO,
        //fontWeight: 'bold',
    },
    animatedWrapper: {
        justifyContent: 'flex-end',
    },
    style1: {
        position: 'absolute',
    },
    style2: {
        alignItems: 'center',
        alignSelf: 'center',
    },
});

export default class AnimatedBar extends Component {
    constructor(props) {
        super(props);
        this.animated = new Animated.Value(0);
        let { selected, number, barHeight } = this.props;
        BAR_HEIGHT = barHeight || 200;
        this.state = { selected, number };
        this.textRef = React.createRef();
    }

    componentDidMount() {
        this.animateTo(this.props.delay, this.props.value);
    }

    static getDerivedStateFromProps(nextProps) {
        return { selected: nextProps.selected, number: nextProps.number };
    }

    animateTo = (delay, value) => {
        Animated.sequence([
            Animated.delay(delay),
            Animated.timing(this.animated, {
                toValue: value || 0,
                duration: 500,
                useNativeDriver: false
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
                    } else if (
                        px + width > pxListChart + widthListChart &&
                        !this.state?.fixPosition
                    ) {
                        this.setState({
                            fixPosition: {
                                right: -(spaceBetween * 2 + barWidth),
                            },
                        });
                    }
                },
            );
        } catch (e) {}
    };

    onLayout = (e) => {
        setTimeout(() => {
            this.measure();
        }, 100);
    };

    render() {
        const { number = 0, fixPosition } = this.state;
        const translate = this.animated.interpolate({
            inputRange: [0, BAR_HEIGHT],
            outputRange: [0, BAR_HEIGHT],
        });
        const {
            suffix = '',
            spaceBetween,
            style,
            barStyle,
            barColumnStyle,
            isDown = false,
        } = this.props;

        return (
            <View style={style}>
                {this.state.selected && (
                    <Animated.View
                        style={[
                            styles.style1,
                            { bottom: translate },
                            fixPosition ? null : styles.style2,
                            // {
                            // backgroundColor: 'white',
                            // paddingHorizontal: Spacing.M,
                            // paddingVertical: Spacing.XS,
                            // shadowColor: '#000',
                            // shadowOpacity: 0.25,
                            // shadowOffset: { width: 0, height: 10 },
                            // shadowRadius: 10,
                            // elevation: 2,
                            // borderRadius: Radius.M,
                            // marginBottom: Spacing.XS
                            // }
                        ]}>
                        <Text.Caption
                            ref={this.textRef}
                            style={[
                                styles.numberText,
                                fixPosition,
                                {
                                    transform: isDown
                                        ? [{ rotate: '180deg' }]
                                        : [],
                                },
                            ]}
                            onLayout={this.onLayout}
                            //numberOfLines={1}
                            //weight="bold"
                        >
                            {NumberUtils.formatNumberToMoney(number, suffix)}
                        </Text.Caption>
                    </Animated.View>
                )}
                <View
                    style={[
                        styles.animatedWrapper,
                        { height: BAR_HEIGHT, paddingHorizontal: spaceBetween },
                        barStyle,
                    ]}>
                    <Animated.View
                        style={[
                            {
                                transform: [{ scaleY: -1 }],
                                borderBottomLeftRadius: Radius.XS,
                                borderBottomRightRadius: Radius.XS,
                                backgroundColor: this.state.selected
                                    ? CustomColors.we_peep
                                    : Colors.ice_blue,
                                height: translate,
                            },
                            barColumnStyle,
                        ]}
                    />
                </View>
            </View>
        );
    }
}

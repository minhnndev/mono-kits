import React, { useImperativeHandle, useMemo } from 'react';
import { Animated, StyleSheet, View } from 'react-native';

export default React.forwardRef(
    ({ size, style, trayColor, progressColor, trackSize }, ref) => {
        const [progressValue, animated] = useMemo(() => {
            const animatedValue = new Animated.Value(0); // 0 -> 1

            return [
                animatedValue.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, 1],
                    extrapolate: 'clamp',
                }),
                animatedValue,
            ];
        }, []);

        const progressBarStyle = {
            borderLeftColor: 'transparent',
            borderBottomColor: 'transparent',
            borderTopColor: progressColor,
            borderRightColor: progressColor,
            borderWidth: trackSize,
            borderRadius: size / 2,
        };
        const trayBarStyle = {
            borderLeftColor: 'transparent',
            borderBottomColor: 'transparent',
            borderTopColor: trayColor,
            borderRightColor: trayColor,
            borderWidth: trackSize,
            borderRadius: size / 2,
        };

        useImperativeHandle(
            ref,
            () => ({
                progressTo: (toValue, duration, callback) => {
                    if (duration) {
                        Animated.timing(animated, {
                            toValue,
                            duration,
                            useNativeDriver: true,
                        }).start(callback);
                    } else {
                        animated.setValue(toValue);
                    }
                },
            }),
            [],
        );

        return (
            <View style={[style, { width: size, height: size }]}>
                <View
                    style={[
                        styles.offset,
                        {
                            borderRadius: size / 2,
                            borderColor: trayColor,
                            borderWidth: trackSize,
                        },
                    ]}
                />
                <View style={[styles.progress1, progressBarStyle]} />
                <Animated.View
                    style={[
                        styles.animatedOffset,
                        trayBarStyle,
                        {
                            transform: [
                                {
                                    rotate: progressValue.interpolate({
                                        inputRange: [0, 0.5],
                                        outputRange: ['45deg', '225deg'],
                                        extrapolate: 'clamp',
                                    }),
                                },
                            ],
                        },
                    ]}
                />
                <Animated.View
                    style={[
                        styles.progress2,
                        progressBarStyle,
                        {
                            transform: [
                                {
                                    rotate: progressValue.interpolate({
                                        inputRange: [0.5, 1],
                                        outputRange: ['44deg', '224deg'],
                                        extrapolate: 'clamp',
                                    }),
                                },
                            ],
                            opacity: progressValue.interpolate({
                                inputRange: [0, 0.5, 0.50001, 1],
                                outputRange: [0, 0, 1, 1],
                                extrapolate: 'clamp',
                            }),
                        },
                    ]}
                />
                <Animated.View
                    style={[
                        styles.progress2,
                        progressBarStyle,
                        {
                            transform: [
                                {
                                    rotate: progressValue.interpolate({
                                        inputRange: [0.5, 0.9, 1],
                                        outputRange: [
                                            '45deg',
                                            '189deg',
                                            '226deg',
                                        ],
                                        extrapolate: 'clamp',
                                    }),
                                },
                            ],
                            opacity: progressValue.interpolate({
                                inputRange: [0, 0.5, 0.50001, 1],
                                outputRange: [0, 0, 1, 1],
                                extrapolate: 'clamp',
                            }),
                        },
                    ]}
                />
            </View>
        );
    },
);

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    offset: {
        ...StyleSheet.absoluteFill,
    },
    progress1: {
        ...StyleSheet.absoluteFill,
        transform: [{ rotate: '45 deg' }],
    },
    progress2: {
        ...StyleSheet.absoluteFill,
        transform: [],
    },
    animatedOffset: {
        ...StyleSheet.absoluteFill,
    },
});

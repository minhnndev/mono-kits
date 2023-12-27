import React, { useEffect, useImperativeHandle, useRef } from 'react';
import { Circle, Defs, Mask, Rect, Svg } from 'react-native-svg';
import { View, StyleSheet } from 'react-native';
import { Image } from '@momo-kits/core';
import CircleProgress from './CircleProgress';

const SvgCircle = (
    {
        r,
        color,
        strokeWidth = 10,
        trayColor = 'gray',
        progressColor = 'green',
        progress = 0.5,
        defaultProgress = 0,
        tintColor = 'black',
        onLayout,
        style,
        faceImageInstruction,
        onDidAnimate,
    },
    ref,
) => {
    const progressRef = useRef();
    const d = r * 2;
    useEffect(() => {
        progressRef.current?.progressTo(progress, 1000, () => {
            if (progress >= 1) {
                onDidAnimate?.();
            }
        });
    }, [progress]);

    useImperativeHandle(
        ref,
        () => ({
            progressTo: (toValue, duration) => {
                progressRef.current?.progressTo(toValue, duration);
            },
        }),
        [],
    );

    return (
        <View style={style} onLayout={onLayout}>
            <Svg height={d} width="100%">
                <Defs>
                    <Mask id="mask" x="0" y="0" height="100%" width="100%">
                        <Rect
                            x={0}
                            y={0}
                            height="100%"
                            width="100%"
                            fill="#fff"
                        />
                        <Circle r={r} cx="50%" cy={r} fill="black" />
                    </Mask>
                </Defs>
                <Rect
                    x="0"
                    y="0"
                    height={d}
                    width="100%"
                    fill={color}
                    mask="url(#mask)"
                    fill-opacity="0"
                />
            </Svg>
            <CircleProgress
                ref={progressRef}
                style={styles.circleProgress}
                size={d}
                trayColor={trayColor}
                progressColor={progressColor}
                trackSize={10}
            />

            {!!faceImageInstruction && (
                <View
                    style={{
                        width: d - strokeWidth * 2,
                        height: d - strokeWidth * 2,
                        position: 'absolute',
                        alignSelf: 'center',
                        top: strokeWidth,
                    }}>
                    <Image
                        source={{ uri: faceImageInstruction }}
                        style={{
                            width: '100%',
                            height: '100%',
                            tintColor: tintColor,
                        }}
                        resizeMethod={'scale'}
                        resizeMode={'stretch'}
                    />
                </View>
            )}
        </View>
    );
};

export default React.forwardRef(SvgCircle);

const styles = StyleSheet.create({
    circleProgress: { position: 'absolute', top: 0, alignSelf: 'center' },
});

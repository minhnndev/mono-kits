import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { Spacing, Colors } from '@momo-kits/core';
import Line from '@momo-kits/separator';
import TYPE from '../utils/BreakLineType';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const HEIGHT = Spacing.L;
const CIRCLE_SIZE = Spacing.M - Spacing.XXS;
const CIRCLE_RADIUS = Spacing.S;
const NUM_BREAKLINE_DEFAULT = 1;

const PaymentBreakline = (props) => {
    const { type = TYPE.DEFAULT, itemWidth = SCREEN_WIDTH } = props;
    const numBreakLine = React.useRef(0);

    const { backgroundColor = Colors.pink_05_b } = props || {};

    const getNumBreakline = () => {
        if (!numBreakLine.current) {
            const _numBreakline = Math.floor((itemWidth) / (CIRCLE_RADIUS * 1.5));
            numBreakLine.current = _numBreakline || NUM_BREAKLINE_DEFAULT;
            return _numBreakline;
        }
        return numBreakLine.current;
    };

    const renderCircle = (item, index) => <View style={[styles.circle, { backgroundColor }]} key={index?.toString()} />;

    if (type === TYPE.CIRCLE_BOTTOM || type === TYPE.CIRCLE_TOP) {
        return (
            <View style={[styles.contentCircle, { alignItems: type === TYPE.CIRCLE_TOP ? 'flex-end' : 'flex-start' }]}>
                {new Array(getNumBreakline()).fill(0).map(renderCircle)}
            </View>
        );
    }

    const renderDivider = () => type !== TYPE.NO_DIVIDER && (
        <Line
            color={Colors.black_04}
            dashGap={Spacing.M / 2}
            dashLength={Spacing.M}
            thickness={1}
            type="dash"
        />
    );

    return (
        <View style={styles.container}>
            <View style={[styles.left, { backgroundColor }]} />
            <View style={styles.content}>
                {renderDivider()}
            </View>
            <View style={[styles.right, { backgroundColor }]} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        height: HEIGHT,
        flexDirection: 'row',
        overflow: 'hidden',
        backgroundColor: Colors.white,
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: Spacing.S,
    },
    left: {
        width: HEIGHT,
        height: HEIGHT,
        borderTopRightRadius: HEIGHT / 2,
        borderBottomRightRadius: HEIGHT / 2,
        backgroundColor: Colors.pink_05_b,
        marginLeft: -HEIGHT / 2,
    },
    right: {
        width: HEIGHT,
        height: HEIGHT,
        borderTopLeftRadius: HEIGHT / 2,
        borderBottomLeftRadius: HEIGHT / 2,
        backgroundColor: Colors.pink_05_b,
        marginRight: -HEIGHT / 2,
    },
    contentCircle: {
        flexDirection: 'row',
        height: Spacing.XXS,
        justifyContent: 'space-evenly',
        overflow: 'hidden',
        paddingHorizontal: Spacing.S
    },
    circle: {
        height: CIRCLE_SIZE,
        width: CIRCLE_SIZE,
        borderRadius: CIRCLE_RADIUS
    }
});

export default PaymentBreakline;

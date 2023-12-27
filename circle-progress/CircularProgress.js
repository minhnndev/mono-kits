/* eslint-disable no-bitwise */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, ViewPropTypes, StyleSheet } from 'react-native';
import _ from 'lodash';
import { Text, D3Shape } from '@momo-kits/core';
import {Svg,
    Defs, Stop, G, Path, LinearGradient, Circle
} from 'react-native-svg';

// const {Svg, Defs, Stop, G, Path, LinearGradient, Circle}  = RNSvg;

const { arc } = D3Shape;

export const ProcessUnit = {
    percent: 'percent',
    number: 'number'
};

export const CircularProgressSize = {
    small: 48,
    medium: 70,
    large: 100,
    giant: 140
};

export const ValueSize = {
    small: 'title',
    medium: 'h3',
    large: 'h2',
    giant: 'h1'
};
const styles = StyleSheet.create({
    center: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center'
    }
});

function calculateStopColor(i, beginColor, endColor, segments) {
    return [
        Math.round(beginColor[0] + ((endColor[0] - beginColor[0]) * i) / segments),
        Math.round(beginColor[1] + ((endColor[1] - beginColor[1]) * i) / segments),
        Math.round(beginColor[2] + ((endColor[2] - beginColor[2]) * i) / segments),
    ];
}

function convertRgb(args) {
    const match = args.toString(16).match(/[a-f0-9]{6}|[a-f0-9]{3}/i);
    if (!match) {
        return [0, 0, 0];
    }

    let colorString = match[0];

    if (match[0].length === 3) {
        colorString = colorString.split('').map((char) => char + char).join('');
    }

    const integer = parseInt(colorString, 16);
    const r = (integer >> 16) & 0xFF;
    const g = (integer >> 8) & 0xFF;
    const b = integer & 0xFF;

    return [r, g, b];
}
const LINEAR_GRADIENT_PREFIX_ID = 'gradientRing';

export default class CircularProgress extends Component {
    static renderLinearGradients(state) {
        const {
            r1, beginColor, endColor, segments
        } = state;
        let startColor = beginColor;
        let stopColor = calculateStopColor(1, beginColor, endColor, segments);
        let startAngle = 0;
        let stopAngle = (2 * Math.PI) / segments;

        return _.range(1, segments + 1).map((i) => {
            const linearGradient = (
                <LinearGradient
                    id={LINEAR_GRADIENT_PREFIX_ID + i}
                    key={LINEAR_GRADIENT_PREFIX_ID + i}
                    x1={r1 * Math.sin(startAngle)}
                    y1={-r1 * Math.cos(startAngle)}
                    x2={r1 * Math.sin(stopAngle)}
                    y2={-r1 * Math.cos(stopAngle)}
                >
                    <Stop offset="0" stopColor={`rgb(${startColor.join(',')})`} />
                    <Stop offset="1" stopColor={`rgb(${stopColor.join(',')})`} />
                </LinearGradient>
            );
            startColor = stopColor;
            stopColor = calculateStopColor(i + 1, beginColor, endColor, segments);
            startAngle = stopAngle;
            stopAngle += (2 * Math.PI) / segments;

            return linearGradient;
        });
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        const {
            width, size, beginColor, endColor, segments, customSize
        } = nextProps;
        let nextState = {};

        const circleSize = customSize || CircularProgressSize[size] || CircularProgressSize.small;

        if (segments !== prevState.segments) {
            nextState.segments = segments;
        }

        if (width !== prevState.width || circleSize !== prevState.size) {
            const r2 = circleSize / 2;
            nextState = {
                ...nextState,
                r1: r2 - width,
                r2,
                width,
                size: circleSize,
            };
        }

        if (beginColor !== prevState.beginColorCached || endColor !== prevState.endColorCached) {
            // CHANGE COLOR ORDER
            nextState = {
                ...nextState,
                beginColorCached: beginColor,
                endColorCached: endColor,
                beginColor: convertRgb(endColor),
                endColor: convertRgb(beginColor),
            };
        }

        const keys = Object.keys(nextState);

        if (keys.length) {
            const combinedState = { ...prevState, ...nextState };
            nextState.linearGradients = CircularProgress.renderLinearGradients(combinedState);
        }
        return keys.length ? nextState : null;
    }

    getCircleSize = () => {
        const { size, customSize } = this.props;
        if (customSize) return customSize;
        const sizeNumber = CircularProgressSize[size];
        if (Number.isInteger(sizeNumber)) return sizeNumber;
        return CircularProgressSize.small;
    }

    constructor(props) {
        super(props);
        this.state = {};
    }

    extractFill() {
        const { fill, max, min } = this.props;
        return Math.min(max, Math.max(min, fill));
    }

    renderBackgroundPath() {
        const { r1, r2 } = this.state;
        const { backgroundColor } = this.props;
        const R = this.getCircleSize() / 2;
        const backgroundPath = arc()
            .innerRadius(r1)
            .outerRadius(r2)
            .startAngle(0)
            .endAngle(2 * Math.PI);

        return <Path x={R} y={R} d={backgroundPath()} fill={backgroundColor} />;
    }

    renderCirclePaths() {
        const {
            r1, r2, segments, endColor, beginColor: beginColorState
        } = this.state;
        const { width, beginColor, max } = this.props;
        const fill = this.extractFill();

        let numberOfPathsToDraw = Math.floor((2 * Math.PI * (fill / max)) / ((2 * Math.PI) / segments));
        const rem = ((2 * Math.PI * (fill / max)) / ((2 * Math.PI) / segments)) % 1;
        if (rem > 0) {
            numberOfPathsToDraw += 1;
        }
        let startAngle = 0;
        let stopAngle = -(2 * Math.PI) / segments;
        const R = this.getCircleSize() / 2;
        return [
            <Circle key="start_circle" cx={R} cy={width / 2} r={width / 2} fill={beginColor} />,
            ..._.range(1, numberOfPathsToDraw + 1).map((i) => {
                if (i === numberOfPathsToDraw && rem) {
                    stopAngle = -2 * Math.PI * (fill / max);
                }
                const circlePath = arc()
                    .innerRadius(r1)
                    .outerRadius(r2)
                    .startAngle(startAngle)
                    .endAngle(stopAngle - 0.005);

                const path = (
                    <Path
                        x={R}
                        y={R}
                        key={fill + i}
                        d={circlePath()}
                        fill={`url(#${LINEAR_GRADIENT_PREFIX_ID}${segments - i + 1})`}
                    />
                );
                startAngle = stopAngle;
                stopAngle -= (2 * Math.PI) / segments;

                return path;
            }),
            <Circle
                key="end_circle"
                cx={(r2 - (r2 - r1) / 2) * Math.sin(2 * Math.PI * (fill / max) - Math.PI) + R}
                cy={(r2 - (r2 - r1) / 2) * Math.cos(2 * Math.PI * (fill / max) - Math.PI) + R}
                r={width / 2}
                fill={
                    `rgb(${calculateStopColor(
                        this.extractFill(),
                        endColor,
                        beginColorState,
                        max
                    ).join(',')
                    })`
                }
            />,
        ];
    }

    isFloat = (n) => Number(n) === n && n % 1 !== 0

    getValue = () => {
        const {
            unit, max, percentFixed
        } = this.props;
        if (unit === ProcessUnit.percent) {
            const number = parseFloat((this.extractFill() / max) * 100);
            let value = number;
            if (this.isFloat(number)) value = number.toFixed(percentFixed);
            return `${value}%`;
        }
        return Math.round(this.extractFill());
    }

    renderDefaultCenterComponent = () => {
        const { size, valueStyle, centerComponent } = this.props;
        if (typeof centerComponent === 'function') return centerComponent(this.getValue());
        const valueSize = ValueSize[size] || ValueSize.small;
        return centerComponent || (
            <Text.Title variant={valueSize} style={valueStyle}>{this.getValue()}</Text.Title>
        );
    }

    render() {
        const {
            rotation, style, offset
        } = this.props;
        const { linearGradients } = this.state;
        const circleSize = this.getCircleSize() + offset;
        const containerStyle = {
            width: circleSize,
            height: circleSize,
            justifyContent: 'center',
            alignItems: 'center',
        };

        return (
            <View style={[style, containerStyle]}>
                <Svg width={circleSize} height={circleSize} scale="-1, 1" originX={(circleSize) / 2}>
                    <Defs key="linear_gradients">{linearGradients}</Defs>
                    <G rotate={rotation - 90}>
                        {this.renderBackgroundPath()}
                        {this.renderCirclePaths()}
                    </G>
                </Svg>
                <View style={styles.center}>
                    {this.renderDefaultCenterComponent()}
                </View>
            </View>
        );
    }
}

CircularProgress.propTypes = {
    backgroundColor: PropTypes.string,
    fill: PropTypes.number.isRequired,
    rotation: PropTypes.number,
    size: PropTypes.oneOf(['small', 'medium', 'large', 'giant']),
    customSize: PropTypes.number,
    style: ViewPropTypes.style,
    width: PropTypes.number.isRequired,
    min: PropTypes.number,
    max: PropTypes.number,
    percentFixed: PropTypes.number,
    valueStyle: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
    centerComponent: PropTypes.oneOfType([PropTypes.element, PropTypes.func]),
    unit: PropTypes.oneOf(['number', 'percent']),
    offset: PropTypes.number
};

CircularProgress.defaultProps = {
    backgroundColor: '#e4e4e4',
    rotation: 90,
    min: 0,
    max: 100,
    percentFixed: 0,
    offset: 0
};


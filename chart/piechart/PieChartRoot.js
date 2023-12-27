/* eslint-disable react/no-unused-prop-types */
/* eslint-disable react/default-props-match-prop-types */
import React, { memo, useState } from 'react';
import { View, Platform } from 'react-native';
import PropTypes from 'prop-types';
import { D3Shape as shape } from '@momo-kits/core';
import Svg, { G, Path } from 'react-native-svg';
import TouchableOpacityG from './TouchableOpacityG';

// const { G, Path, Svg } = RNSvg;

const PieChartRoot = memo(({
    data,
    innerRadius,
    outerRadius,
    labelRadius,
    animate,
    animationDuration,
    style,
    chartStyle,
    sort,
    sortKey,
    valueAccessor,
    children,
    startAngle,
    endAngle,
    activeOpacity = 0.4,
}) => {
    const [layout, setLayout] = useState({ height: 0, width: 0 });
    const { height, width } = layout;
    const _onLayout = (event) => {
        const {
            nativeEvent: {
                layout: { height: newHeight, width: newWidth },
            },
        } = event;

        setLayout({ height: newHeight, width: newWidth });
    };

    const _calculateRadius = (arg, max, defaultVal) => {
        if (typeof arg === 'string') {
            return (arg.split('%')[0] / 100) * max;
        } if (arg) {
            return arg;
        }
        return defaultVal;
    };

    if (data?.length === 0) {
        return <View style={chartStyle} />;
    }

    const maxRadius = Math.min(width, height) / 2;

    if (Math.min(...data.map((obj) => valueAccessor({ item: obj }))) < 0) {
        console.log("don't pass negative numbers to pie-chart, it makes no sense!");
    }

    const _outerRadius = _calculateRadius(outerRadius, maxRadius, maxRadius);
    const _innerRadius = _calculateRadius(innerRadius, maxRadius, 0);
    const _labelRadius = _calculateRadius(labelRadius, maxRadius, _outerRadius);

    if (outerRadius > 0 && _innerRadius >= outerRadius) {
        console.warn('innerRadius is equal to or greater than outerRadius');
    }

    const arcs = data.map((item) => {
        const arc = shape
            .arc()
            .outerRadius(_outerRadius)
            .innerRadius(_innerRadius);

        item.arc
            && Object.entries(item.arc).forEach(([key, value]) => {
                if (typeof arc[key] === 'function') {
                    if (typeof value === 'string') {
                        arc[key]((value.split('%')[0] / 100) * _outerRadius);
                    } else {
                        arc[key](value);
                    }
                }
            });
        return arc;
    });

    const labelArcs = data.map((item, index) => {
        if (labelRadius) {
            return shape
                .arc()
                .outerRadius(_labelRadius)
                .innerRadius(_labelRadius);
        }
        return arcs[index];
    });

    const pieSlices = shape
        .pie()
        .value((d) => valueAccessor({ item: d }))
        .sort(sortKey ? (a, b) => b[sortKey] - a[sortKey] : sort)
        .startAngle(startAngle)
        .endAngle(endAngle)(data);

    const slices = pieSlices.map((slice, index) => ({
        ...slice,
        pieCentroid: arcs[index].centroid(slice),
        labelCentroid: labelArcs[index].centroid(slice),
    }));

    const extraProps = {
        width,
        height,
        data,
        slices,
    };
    const svgStyle = { height: height + 20, width: width + 20 };
    return (
        <View pointerEvents="box-none" style={chartStyle || style}>
            <View pointerEvents="box-none" style={{ flex: 1 }} onLayout={(event) => _onLayout(event)}>
                {height > 0 && width > 0 && (
                    <Svg pointerEvents={Platform.OS === 'android' && 'box-none'} style={svgStyle}>
                        {/* center the progress circle */}
                        <G x={width / 2} y={height / 2}>
                            {React.Children.map(children, (child) => {
                                if (child && child.props.belowChart) {
                                    return React.cloneElement(child, extraProps);
                                }
                                return null;
                            })}
                            {React.Children.map(children, (child) => {
                                if (child && !child.props.belowChart) {
                                    return React.cloneElement(child, extraProps);
                                }
                                return null;
                            })}
                            {pieSlices.map((slice, index) => {
                                const {
                                    onPress, color, value
                                } = data[index];
                                const key = value + index;
                                return (
                                    <TouchableOpacityG activeOpacity={onPress ? activeOpacity : 1} key={key} onPress={onPress}>
                                        <Path
                                            fill={color}
                                            d={arcs[index](slice)}
                                            animate={animate}
                                            animationDuration={animationDuration}
                                        />
                                    </TouchableOpacityG>

                                );
                            })}
                        </G>
                    </Svg>
                )}
            </View>
        </View>
    );
});

PieChartRoot.displayName = 'PieChartRoot';

PieChartRoot.propTypes = {
    data: PropTypes.arrayOf(
        PropTypes.shape({
            value: PropTypes.number,
            color: PropTypes.string,
            onPress: PropTypes.func,
            title: PropTypes.string,
            subTitle: PropTypes.string,
            icon: PropTypes.string,
        })
    ).isRequired,
    innerRadius: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    outerRadius: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    labelRadius: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    padAngle: PropTypes.number,
    animate: PropTypes.bool,
    animationDuration: PropTypes.number,
    style: PropTypes.any,
    sort: PropTypes.func,
    valueAccessor: PropTypes.func,
    chartStyle: PropTypes.object,
};

PieChartRoot.defaultProps = {
    data: [],
    startAngle: 0,
    endAngle: Math.PI * 2,
    valueAccessor: ({ item }) => item.value,
    innerRadius: '50%',
    sort: (a, b) => b.value - a.value,
};

export default PieChartRoot;
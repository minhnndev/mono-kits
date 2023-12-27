import React, { useState, memo } from 'react';
import { StyleSheet, View } from 'react-native';
import { G, Text, Polyline, Image } from 'react-native-svg';
import PropTypes from 'prop-types';
import { Spacing, Colors, ScaleSize } from '@momo-kits/core';
import PieChartRoot from './PieChartRoot';

// const {
//     G, Text, Polyline, Image
// } = RNSvg;

const PieChart = memo((props = {}) => {
    const {
        style,
        showLabels,
        data = [],
        titleSize = 12,
        subTitleSize = 10,
        navLineColor = Colors.black_06,
        iconWidth = 20,
        iconHeight = 20,
        titleColor,
        subTitleColor,
    } = props;
    const Labels = ({
        slices,
    }) => slices.map((slice, index) => {
        const { title, subTitle, icon } = data?.[index] || {};
        const { labelCentroid, pieCentroid } = slice;
        const isLeftLabel = labelCentroid[0] < 0;
        const endPoint = [
            pieCentroid[0] / 3 + labelCentroid[0],
            pieCentroid[1] / 3 + labelCentroid[1],
        ];

        const labelHorizontalLength = isLeftLabel ? endPoint[0] - 15 : endPoint[0] + 15;
        const points = `${labelCentroid[0]}, ${labelCentroid[1]}, ${endPoint[0]}, ${endPoint[1]}, ${labelHorizontalLength}, ${endPoint[1]}`;
        const [textX, setTextX] = useState(labelHorizontalLength);
        const [textY, setTextY] = useState(0);
        const onLayout = ({ nativeEvent }) => {
            const { width, height } = nativeEvent.layout;
            const newTextX = isLeftLabel ? labelHorizontalLength - width - Spacing.XS : labelHorizontalLength + Spacing.XS;
            setTextX(newTextX);
            setTextY(height);
        };

        return (
            <G key={points}>
                <Polyline
                    points={points}
                    stroke={navLineColor}
                    fill="none"
                />
                {
                    icon
                        ? (
                            <Image
                                x={textX}
                                y={endPoint[1] - 10}
                                width={iconWidth}
                                height={iconHeight}
                                href={icon}
                                onLayout={onLayout}
                            />
                        )
                        : (
                            <Text
                                fill={titleColor}
                                fontSize={ScaleSize(titleSize)}
                                style={styles.label}
                                x={textX}
                                y={endPoint[1] + 3}
                                onLayout={onLayout}
                            >
                                {title}
                            </Text>
                        )
                }

                <Text
                    fill={subTitleColor}
                    fontSize={ScaleSize(subTitleSize)}
                    style={styles.label}
                    x={textX}
                    y={endPoint[1] + textY + 5}
                >
                    {subTitle}
                </Text>
            </G>
        );
    });
    const containerStyle = { ...style, justifyContent: 'center' };
    return (
        <View style={containerStyle}>
            <PieChartRoot {...props}>
                {
                    showLabels
                        ? <Labels />
                        : null
                }
            </PieChartRoot>
        </View>

    );
});

PieChart.displayName = 'PieChart';
export default PieChart;

const styles = StyleSheet.create({
    label: {
        marginHorizontal: Spacing.L,
    }
});

PieChart.propTypes = {
    data: PropTypes.arrayOf(
        PropTypes.shape({
            value: PropTypes.number,
            color: PropTypes.string,
            onPress: PropTypes.func,
            title: PropTypes.string,
            subTitle: PropTypes.string,
            icon: PropTypes.string,
        })
    ),
    innerRadius: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    outerRadius: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    labelRadius: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    style: PropTypes.any,
    sort: PropTypes.func,
    activeOpacity: PropTypes.number,
    titleColor: PropTypes.string,
    subTitleColor: PropTypes.string,
};

PieChart.defaultProps = {
    data: [],
    innerRadius: '50%',
    sort: (a, b) => b.value - a.value,
    activeOpacity: 0.4,
    titleColor: Colors.black,
    subTitleColor: Colors.black,
};

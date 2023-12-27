import React, { useEffect, useState } from 'react';
import { LinearGradient, Stop } from 'react-native-svg';
import { VictoryArea, VictoryAxis, VictoryChart, VictoryLabel } from 'victory-native';
import { Colors, ScaleSize, Text, Spacing, Radius } from '@momo-kits/core';
import { View } from 'react-native';
import moment from 'moment';

const billion = 1000000000;
const million = 1000000;
const thousand = 1000;

const LineChartController = props => {
    const { data, formatHorizontal, formatVertical, preventColor = [Colors.white] } = props || {};
    const [lineChartData, setLineChartData] = useState([]);

    const getRandomColor = listColorsUsed => {
        const color = COLOR_SCALE[Math.floor(Math.random() * COLOR_SCALE.length)];
        const isValidColor = !listColorsUsed?.includes?.(color) && !preventColor?.includes?.(color);
        return isValidColor ? color : getRandomColor(listColorsUsed);
    };

    useEffect(() => {
        let listColorsUsed = [];
        const dataFormat = data?.map?.(item => {
            let { dataChart, color, title } = item || {};
            if (color) {
                listColorsUsed.push(color);
            } else {
                color = getRandomColor(listColorsUsed);
                listColorsUsed.push(color);
            }
            const fillColor = color;

            return {
                ...item,
                title,
                dataChart,
                fillColor,
            };
        });
        setLineChartData(dataFormat);
    }, [data]);

    const formatY = y => {
        const text = formatVertical?.(y) || formatCurrency(y);
        return text;
    };

    const formatCurrency = number => {
        if (Math.abs(number) / billion >= 1) {
            return `${Math.ceil(number / billion)}B`;
        }
        if (Math.abs(number) / million >= 1) {
            return `${Math.ceil(number / million)}M`;
        }
        if (Math.abs(number) / thousand >= 1) {
            return `${Math.ceil(number / thousand)}K`;
        }
    };

    const formatX = x => {
        const text = formatHorizontal?.(x) || formatDate(x);
        return text;
    };

    const formatDate = date => {
        let month = moment().format('MM');
        if (date < 10) {
            return `0${date}/${month}`;
        }
        return `${date}/${month}`;
    };

    return {
        ...props,
        lineChartData,
        formatX,
        formatY,
    };
};

const LineChart = props => {
    const {
        lineChartData,
        formatX,
        formatY,
        tickValuesHorizontal,
        tickValuesVertical,
        renderDescriptionChart,
    } = LineChartController(props);

    const lineXY = <VictoryLabel style={[{ fill: Colors.black_17, fontSize: ScaleSize(10) }]} />;

    const renderDescription = () => {
        if (renderDescriptionChart && typeof renderDescriptionChart === 'function') {
            return renderDescriptionChart(lineChartData);
        }

        return (
            <View style={styles.viewListDescription}>
                {lineChartData?.map?.((item, index) => (
                    <View key={`dot_${index}`} style={styles.viewDescription}>
                        <View style={[styles.dot, { backgroundColor: item.fillColor }]} />
                        <Text.Title numberOfLines={1} style={styles.title}>
                            {item.title}
                        </Text.Title>
                    </View>
                ))}
            </View>
        );
    };

    return (
        <>
            {renderDescription()}
            <VictoryChart domainPadding={{ y: 10, x: [0, 10] }}>
                {lineChartData?.map?.((item, index) => (
                    <VictoryArea
                        key={`data_${index}`}
                        interpolation="basis"
                        style={{
                            data: {
                                fill: 'url(#grad)',
                                stroke: item.fillColor,
                            },
                        }}
                        animate={{
                            duration: 1000,
                            onLoad: { duration: 1000 },
                        }}
                        data={item.dataChart}
                    />
                ))}
                <VictoryAxis
                    dependentAxis
                    crossAxis={false}
                    tickFormat={formatY}
                    tickValues={tickValuesVertical}
                    style={styles.verticalAxis}
                    tickLabelComponent={lineXY}
                />

                <VictoryAxis
                    style={styles.horizontalAxis}
                    tickFormat={formatX}
                    offsetY={50}
                    tickValues={tickValuesHorizontal}
                    tickLabelComponent={lineXY}
                />
                {lineChartData?.length === 1 ? (
                    <LinearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                        <Stop offset="0" stopColor={lineChartData[0].fillColor} stopOpacity="1" />
                        <Stop offset="1" stopColor="#FFF" stopOpacity="1" />
                    </LinearGradient>
                ) : null}
            </VictoryChart>
        </>
    );
};

const styles = {
    verticalAxis: {
        grid: { stroke: Colors.black_17, strokeWidth: 0.2 },
        axis: { stroke: Colors.black_17, strokeWidth: 0.2 },
    },
    horizontalAxis: {
        axis: { stroke: Colors.black_17, strokeWidth: 0.2 },
    },
    viewListDescription: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: Spacing.L },
    viewDescription: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingRight: Spacing.M,
        paddingVertical: Spacing.M,
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: Radius.XS,
        marginRight: Spacing.S,
    },
    title: {
        color: Colors.black_17,
    },
};

const COLOR_SCALE = [
    Colors.blue_06,
    Colors.gold_07,
    Colors.violet_07,
    Colors.cyan_05,
    Colors.red_07,
    '#f8a127',
    '#ac4d36',
    '#d547e2',
    '#513594',
    '#6c7bed',
    '#a877d2',
    '#38e53f',
    '#472af1',
    '#ad6d30',
    '#b8e285',
    '#670c24',
    '#ce5387',
    '#cb8114',
    '#e4b4a0',
    '#905402',
    '#898729',
    '#8c65dc',
    '#391c26',
    '#485377',
    '#4e3789',
    '#c1ec0c',
    '#a7074f',
    '#35a2ca',
    '#ea3414',
    '#2c7a79',
    '#952bc0',
    '#aee167',
    '#4c66ca',
    '#b8c89b',
    '#34ffc7',
    '#77f549',
    '#61abc1',
    '#728720',
    '#ab5742',
    '#3c9d71',
    '#4e7cd5',
    '#d94c12',
    '#145b7e',
    '#b1986e',
    '#3cc04c',
    '#a7fad3',
    '#958a60',
    '#15b660',
    '#16edc5',
    '#6b8626',
    '#e9b90a',
    '#d631ed',
    '#abde34',
    '#bf9587',
    '#a0c9ed',
    '#ae0117',
    '#e3a40e',
    '#80895a',
    '#15fd4c',
    '#d761ef',
    '#78c3ba',
    '#243dee',
    '#fb9196',
    '#6bca16',
    '#881205',
    '#2ab6e8',
    '#29a347',
    '#6eadf6',
    '#f92de8',
    '#28f272',
    '#f8da98',
    '#7d9f62',
    '#c11aeb',
    '#eb140f',
    '#66e0f8',
    '#8a2993',
    '#648476',
    '#239a19',
    '#fbb5ec',
    '#af5b42',
    '#89cc75',
    '#44107a',
    '#75673e',
    '#cf0db7',
    '#67993d',
    '#8554fd',
    '#9614cc',
    '#b3edb0',
    '#2944bf',
    '#7d5e59',
    '#a057df',
    '#2e5837',
    '#a3f706',
    '#4d73c6',
    '#8de994',
    '#dfee57',
    '#1da266',
    '#f588d9',
    '#910bfd',
    '#2147ef',
];

export default LineChart;

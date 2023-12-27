import React, {
    useEffect,
    useState,
    useImperativeHandle,
    forwardRef,
    useMemo,
} from 'react';
import { Dimensions, Platform, StyleSheet, View } from 'react-native';
import { Radius, Colors, Text, Spacing } from '@momo-kits/core';
import { VictoryLabel, VictoryPie, VictoryLegend } from 'victory-native';
import Svg from 'react-native-svg';
import { fill, inRange, isEmpty, slice } from 'lodash';
import { backgroundColor } from 'react-native/Libraries/Components/View/ReactNativeStyleAttributes';
import { TouchableWithoutFeedback } from 'react-native';
const { width } = Dimensions.get('window');
const WIDTH_CHART = width * 0.5;
const HEIGHT_CHART = width * 0.5;
const INNER_RADIUS = Platform.select({ ios: 94, android: 90 });

const usePieChartHook = (props) => {
    const [pieData, setPieData] = useState([]);
    const {
        data = [],
        setLabelText,
        getInnerRadius,
        preventColor = [Colors.white],
    } = props || {};

    const getRandomColor = (listColorsUsed) => {
        const color =
            COLOR_SCALE[Math.floor(Math.random() * COLOR_SCALE.length)];
        const isValidColor =
            !listColorsUsed?.includes?.(color) &&
            !preventColor?.includes?.(color);
        return isValidColor ? color : getRandomColor(listColorsUsed);
    };

    const getSum = (total, num) => {
        return total + Math.round(num.value || 0);
    };

    useEffect(() => {
        const totalAmount = data?.reduce?.(getSum, 0);
        let listColorsUsed = [];
        const dataChart = data?.map?.((item, index) => {
            let { title, value, color, subValue } = item || {};
            item.fillOpacity = 1;
            if (color) {
                listColorsUsed.push(color);
            } else {
                color = getRandomColor(listColorsUsed);
                listColorsUsed.push(color);
            }
            const fillColor = color;

            return {
                ...item,
                x: title,
                y: value,
                fillColor,
                totalAmount,
                subValue,
                percent:
                    totalAmount > 0
                        ? ((value / totalAmount) * 100).toFixed()
                        : 0,
            };
        });
        setPieData(dataChart);
    }, [data]);

    const setLabelChart = ({ datum }) => {
        const text = setLabelText?.(datum) || `${datum?.percent} %`;
        return typeof text === 'string' ? text : '';
    };

    const setColorValue = ({ datum }) => datum?.fillColor;

    const setInnerRadius = ({ datum }) => {
        const innerRadius = getInnerRadius?.(datum) || INNER_RADIUS;
        return typeof innerRadius === 'number' ? innerRadius : 0;
    };

    return {
        ...props,
        pieData,
        setLabelChart,
        setColorValue,
        setInnerRadius,
        setPieData,
    };
};

const PieChartVictory = forwardRef((props, ref) => {
    const {
        renderRightComponent,
        pieData = [],
        labelProps,
        chartProps,
        widthChart = width,
        widthLegend,
        sliceWidth = 25,
        setLabelChart,
        setColorValue,
        setInnerRadius,
        showLegendRow,
        style,
        renderBottom,
        labelChart,
        totalChart,
        subLabelChart,
        setPieData,
        legendVertical,
        legend,
        legendX,
        ...propsContainer
    } = usePieChartHook(props);

    const [subLabel, setSubLabel] = useState(subLabelChart);
    const [titleChart, setTitleChart] = useState(labelChart);
    const [mainLabel, setMainLabel] = useState(totalChart);

    const updateChart = (pressedData) => {
        const data = [...pieData];
        data.forEach((item) => {
            if (item.title !== pressedData) {
                item.fillOpacity = 0.3;
                item.active = false;
            } else {
                setSubLabel(item.subValue);
                setMainLabel(item.value);
                setTitleChart(item.title);
                item.fillOpacity = 1;
                item.active = true;
            }
        });
        setPieData(data);
    };

    const onPress = (...dataProps) => {
        const pressedData = dataProps[1].datum.title;
        updateChart(pressedData);
    };

    const onPressLegend = (title) => {
        const pressedData = title;
        updateChart(pressedData);
    };

    const eventHandlers = Platform.select({
        android: {
            onPressIn: (...dataProps) => {
                onPress(...dataProps);
            },
        },
        ios: {
            onPress: (...dataProps) => {
                onPress(...dataProps);
            },
        },
    });

    const getPieData = () => {
        return pieData;
    };

    let labelPadding = 25;

    const setRadius = ({ datum }) => {
        let chartRadius = widthChart / 2 - labelPadding * 2;
        if (datum.active == true) {
            chartRadius += 5;
        }
        return chartRadius;
    };

    const setLabelRadius = ({ datum }) => {
        let labelRadius = widthChart / 2 - labelPadding;
        if (datum.active == true) {
            labelRadius += 5;
        }
        return labelRadius;
    };

    const setLabelFontWeight = ({ datum }) => {
        let fontWeight = 400;
        if (datum.active == true) {
            fontWeight = 500;
        }
        return fontWeight;
    };

    const setLabelOpacity = ({ datum }) => {
        let opacity = 0.6;
        if (datum.active == true) {
            opacity = 1;
        }
        return opacity;
    };

    const setLabelFontSize = ({ datum }) => {
        let fontSize = 14;
        if (datum.active == true) {
            fontSize = 15;
        }
        return fontSize;
    };

    useImperativeHandle(ref, () => ({ getPieData }));

    const renderLegend = () => {
        const legendData = pieData?.map?.((item) => {
            return {
                name: item.x,
                symbol: { fill: item.fillColor },
            };
        });

        const orientation = legendVertical ? 'vertical' : 'horizontal';
        const legendHeight = legendVertical ? pieData?.length * 30 : 30;

        return (
            <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                <VictoryLegend
                    name="legend"
                    x={legendX}
                    height={legendHeight}
                    orientation={orientation}
                    data={legendData}
                    gutter={20}
                    events={[
                        {
                            target: 'data',
                            eventHandlers: eventHandlers,
                        },
                    ]}
                />
            </View>
        );
    };

    const renderDescription = () => {
        if (renderBottom && typeof renderBottom === 'function') {
            return renderBottom(pieData);
        }

        const width = legendVertical ? 70 : 250;

        return (
            <View
                style={[
                    legendVertical
                        ? styles.viewListDescriptionVertical
                        : styles.viewListDescriptionHorizontal,
                    { width: widthLegend || width },
                ]}>
                {pieData?.map?.((item, index) => (
                    <TouchableWithoutFeedback
                        onPress={() => onPressLegend(item.x)}
                        key={`dot_${index}`}>
                        <View
                            key={`dot_${index}`}
                            style={[
                                legendVertical
                                    ? [
                                          styles.viewDescriptionVertical,
                                          { width: widthLegend || width },
                                      ]
                                    : styles.viewDescriptionHorizontal,
                            ]}>
                            <View
                                style={[
                                    styles.dot,
                                    { backgroundColor: item.fillColor },
                                ]}
                            />
                            <Text.Title numberOfLines={1} style={styles.title}>
                                {item.x}
                            </Text.Title>
                        </View>
                    </TouchableWithoutFeedback>
                ))}
            </View>
        );
    };

    const renderVictoryPie = () => {
        return (
            <VictoryPie
                height={widthChart}
                data={pieData}
                width={widthChart}
                radius={setRadius}
                padAngle={2}
                cornerRadius={5}
                labelRadius={setLabelRadius}
                innerRadius={widthChart / 2 - labelPadding * 2 - sliceWidth}
                animate={{ duration: 500 }}
                style={{
                    data: {
                        fill: setColorValue,
                        opacity: ({ datum }) => {
                            return datum.fillOpacity;
                        },
                    },
                }}
                labelComponent={
                    <VictoryLabel
                        labelPlacement={'parallel'}
                        verticalAnchor={'middle'}
                        textAnchor="middle"
                        style={{
                            fontSize: setLabelFontSize,
                            fontWeight: setLabelFontWeight,
                            fill: Colors.black_17,
                            opacity: setLabelOpacity,
                        }}
                        text={setLabelChart}
                        {...labelProps}
                    />
                }
                events={[
                    {
                        target: 'data',
                        eventHandlers: eventHandlers,
                    },
                ]}
                {...chartProps}
            />
        );
    };

    const renderInsideData = () => {
        return (
            <View style={styles.insideChartContainer}>
                <Text.SubTitle weight="bold">{titleChart}</Text.SubTitle>
                <Text.H4 color={Colors.blue_04}>{mainLabel}</Text.H4>
                {subLabel && (
                    <Text.SubTitle color={Colors.black_12}>
                        {subLabel}
                    </Text.SubTitle>
                )}
            </View>
        );
    };

    const chartAligment = showLegendRow
        ? {
              flexDirection: 'row',
              justifyContent: 'space-evenly',
              alignItems: 'center',
          }
        : { alignItems: 'center' };

    return (
        <View {...propsContainer} style={chartAligment}>
            <View
                style={[
                    styles.chartContainer,
                    { width: widthChart, height: widthChart },
                ]}>
                {Platform.OS === 'android' ? (
                    <Svg>{renderVictoryPie()}</Svg>
                ) : (
                    renderVictoryPie()
                )}
                {renderInsideData()}
                {!!renderRightComponent && renderRightComponent?.(pieData)}
            </View>
            <View>{legend && renderDescription()}</View>
        </View>
    );
});

const styles = StyleSheet.create({
    chartContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    insideChartContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: -100,
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: Radius.XS,
        marginRight: Spacing.S,
    },
    viewListDescriptionHorizontal: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingHorizontal: Spacing.L,
        alignItems: 'center',
        justifyContent: 'center',
    },
    viewListDescriptionVertical: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    viewDescriptionHorizontal: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: Spacing.S,
    },
    viewDescriptionVertical: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: Spacing.S,
    },
});

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

export default PieChartVictory;

const sampleData = [
    { x: 1, open: 9, close: 30, high: 56, low: 7 },
    { x: 2, open: 80, close: 40, high: 120, low: 10 },
    { x: 3, open: 50, close: 80, high: 90, low: 20 },
    { x: 4, open: 70, close: 22, high: 70, low: 5 },
];

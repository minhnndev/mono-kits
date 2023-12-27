import { Colors, LocalizedStrings, ScaleSize, Spacing } from '@momo-kits/core';
import { NumberUtil } from '@momo-platform/utils';
import { get, set } from 'lodash';
import React, { useEffect, useState } from 'react';
import { Platform, Text, View } from 'react-native';
import Svg from 'react-native-svg';
import {
    VictoryAxis,
    VictoryBar,
    VictoryChart,
    VictoryContainer,
    VictoryGroup,
    VictoryLabel,
    Bar,
    Rect,
} from 'victory-native';
import LoadingWrapper from './LoadingWrapper';

const BILLION = 1000000000;
const MILLION = 1000000;
const THOUSAND = 1000;
const HUNDRED = 100;

const ChartClick = Platform.select({
    ios: View,
    android: Svg,
});

const commonUtilFloor = (value, precision = 0) => {
    var multiplier = Math.pow(10, precision || 0);
    return Math.floor(value * multiplier) / multiplier;
};

const checkHasData = (data) => {
    for (let i = 0; i < data?.length || 0; i++) {
        if (data[i]?.find((item) => item.y > 0)) {
            return true;
        }
    }
    return false;
};

let language = new LocalizedStrings({
    vi: {
        milion: 'Tr',
        bilion: 'Tỷ',
    },
    en: {
        milion: 'M',
        bilion: 'B',
    },
});

const DoubleBarChart = (props) => {
    const {
        data,
        highlightIndex,
        onPressBarColumn,
        verticalAxisStyle,
        horizontalAxisStyle,
        widthChart,
        heightChart = 300,
        padding,
        barWidth = 24,
        chartContainerStyle,
        renderRightComponent,
        LoadingComponent,
        EmptyComponent,
        disabledClickColumnShowLabel,
        axisFontSize,
        titlePosition = 'none',
    } = props || {};
    const [dataShow, setDataShow] = useState(data);
    const [pressedPoint, setPressedPoint] = useState({ x: 0, y: 0 });

    useEffect(() => {
        setDataShow(data);
    }, [data]);

    useEffect(() => {
        if (!disabledClickColumnShowLabel) {
            if (get(data, `[${highlightIndex}]`)) {
                makeHighlight(
                    [...data],
                    highlightIndex,
                    highlightIndex || highlightIndex === 0
                        ? highlightIndex
                        : data[highlightIndex].length - 1,
                );
            } else if (data?.length > 1) {
                makeHighlight(
                    [...data],
                    data.length - 1,
                    highlightIndex
                        ? highlightIndex
                        : data[data.length - 1].length - 1,
                );
            }
        }
    }, [data, highlightIndex]);

    const floor = (value) => {
        return commonUtilFloor(value, value >= HUNDRED ? 0 : 1);
    };

    const formatLabel = (value) => {
        if (value > 1) {
            if (value / BILLION >= 1) {
                return `${floor(value / BILLION)
                    .toString()
                    .replace('.', ',')}${language.getLocalize('bilion')}`;
            }
            if (value / MILLION >= 1) {
                return `${floor(value / MILLION)
                    .toString()
                    .replace('.', ',')}${language.getLocalize('milion')}`;
            }
            if (value / THOUSAND >= 1) {
                return `${floor(value / THOUSAND)
                    .toString()
                    .replace('.', ',')}K`;
            }
            return NumberUtil.formatCurrency(value, 'đ');
        } else {
            return NumberUtil.formatCurrency(value, 'đ');
        }
    };

    const formatY = (tick) => {
        if (tick > 1) {
            if (tick / BILLION >= 1) {
                return `${(tick / BILLION)
                    .toString()
                    .replace('.', ',')}${language.getLocalize('bilion')}`;
            }
            if (tick / MILLION >= 1) {
                return `${(tick / MILLION)
                    .toString()
                    .replace('.', ',')}${language.getLocalize('milion')}`;
            }
            if (tick / THOUSAND >= 1) {
                return `${(tick / THOUSAND).toString().replace('.', ',')}K`;
            }
            return tick;
        } else {
            return tick;
        }
    };

    const formatX = (d) => `${d}`;

    const onPressBar = (dataProps, chartIndex) => {
        onPressBarColumn?.(dataProps, chartIndex);
        if (!disabledClickColumnShowLabel) {
            const { index = 0 } = dataProps || {};
            makeHighlight([...data], chartIndex, index);
        }
    };

    const makeHighlight = (_dataChart, chartIndex, barColumnIndex) => {
        let dataHighlight = _dataChart?.map?.((chart) =>
            chart?.map?.((item) => {
                item.color = item?.color ?? Colors.ice_blue;
                item.label = '';
                return item;
            }),
        );
        let dataTest = dataHighlight;
        for (let i = 0; i < 2; i++) {
            dataTest[i].forEach((col, index) => {
                if (index === barColumnIndex) {
                    col.label = formatLabel(col.y);
                    col.fillOpacity = 1;
                } else {
                    col.fillOpacity = 0.4;
                }
            });

            dataHighlight[i] = dataTest[i];
        }
        setDataShow(dataHighlight);
    };

    const TitleComponent = () => {
        return (
            <View
                style={{
                    display: 'flex',
                    flexDirection: 'row',
                }}>
                {data.map((item) => {
                    return (
                        <View
                            style={{
                                display: 'flex',
                                flexDirection: 'row',
                                alignItems: 'center',
                                margin: Spacing.L,
                            }}>
                            <View
                                style={{
                                    height: 10,
                                    width: 10,
                                    borderRadius: 5,
                                    marginRight: Spacing.XS,
                                    backgroundColor: item[0].color,
                                }}></View>
                            <Text>{item[0].noteTitle}</Text>
                        </View>
                    );
                })}
            </View>
        );
    };

    const hasData = checkHasData(dataShow);
    return (
        <LoadingWrapper
            dataSource={data}
            isEmpty={!hasData}
            LoadingComponent={LoadingComponent}
            EmptyComponent={EmptyComponent}>
            <View
                style={[
                    styles.chartContainer,
                    chartContainerStyle,
                    {
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    },
                ]}>
                {!renderRightComponent && titlePosition === 'top' && (
                    <TitleComponent />
                )}
                <ChartClick height={heightChart} width={widthChart}>
                    <VictoryChart
                        key={'BarGroupReport'}
                        domainPadding={styles.domainPaddingChart}
                        height={heightChart}
                        width={widthChart}
                        padding={padding}
                        containerComponent={
                            <VictoryContainer disableContainerEvents />
                        }>
                        <VictoryAxis
                            crossAxis={false}
                            dependentAxis
                            tickFormat={formatY}
                            style={
                                verticalAxisStyle ?? chartStyles.verticalAxis
                            }
                            tickLabelComponent={
                                <VictoryLabel style={[styles.labels]} />
                            }
                        />
                        <VictoryAxis
                            tickValues={dataShow?.[0]?.map((d) => d.name) || []}
                            tickFormat={formatX}
                            style={
                                horizontalAxisStyle ??
                                chartStyles.horizontalAxis
                            }
                            tickLabelComponent={
                                <VictoryLabel style={[styles.labels]} />
                            }
                        />
                        <VictoryGroup
                            offset={barWidth + Spacing.XS}
                            colorScale={'qualitative'}>
                            {dataShow?.map?.((dataChart, index) => {
                                return (
                                    <VictoryBar
                                        key={`BarGroupReport_${index}`}
                                        style={styles.styleBar}
                                        data={dataChart}
                                        barWidth={barWidth}
                                        cornerRadius={{ top: barWidth / 6 }}
                                        dataComponent={
                                            <DataComponent
                                                onPressBar={onPressBar}
                                                chartIndex={index}
                                                offset={Spacing.XS}
                                            />
                                        }
                                        labelComponent={
                                            index === 0 ? (
                                                <VictoryLabel transform="translate(-4)" />
                                            ) : (
                                                <VictoryLabel transform="translate(4)" />
                                            )
                                        }
                                        events={[
                                            {
                                                target: 'data',
                                                eventHandlers: {
                                                    onPress: (_, dataProps) => {
                                                        onPressBar(
                                                            dataProps,
                                                            index,
                                                        );
                                                    },
                                                },
                                            },
                                        ]}
                                    />
                                );
                            })}
                        </VictoryGroup>
                    </VictoryChart>
                </ChartClick>
                {!renderRightComponent && titlePosition === 'bottom' && (
                    <TitleComponent />
                )}

                {renderRightComponent?.()}
            </View>
        </LoadingWrapper>
    );
};

const DataComponent = (props) => {
    const { x, height, barWidth, style, onPressBar, chartIndex, offset } =
        props || {};
    return (
        <>
            <Bar {...props} />
            <Rect
                x={x - (style.padding || 0)}
                y={0}
                width={barWidth + offset / 2}
                height={height}
                fill="transparent"
                onPress={() => onPressBar(props, chartIndex)}
            />
        </>
    );
};

const chartStyles = {
    verticalAxis: {
        grid: { stroke: Colors.black_05, strokeWidth: 0.2 },
        axis: { stroke: Colors.black_05, strokeWidth: 0.2 },
    },
    horizontalAxis: {
        axis: { stroke: 'none' },
    },
};

const styles = {
    container: { flex: 1 },
    styleAxis: {
        axis: { stroke: Colors.black_05 },
    },
    styleBar: {
        data: {
            fill: ({ datum }) => datum.color ?? Colors.ice_blue,
            fillOpacity: ({ datum }) => datum.fillOpacity ?? 1,
        },
        labels: {
            fill: Colors.black_17,
            fontSize: ScaleSize(10),
            padding: 2,
        },
    },
    domainPaddingChart: { x: Spacing.XL, y: 1 },
    chartContainer: {
        flexDirection: 'row',
        // alignItems: 'center',
    },
    labels: {
        fill: Colors.black_12,
        fontSize: ScaleSize(12),
        verticalAnchor: 'middle',
        capHeight: 0,
    },
};

export default DoubleBarChart;

/* eslint-disable prefer-spread */
/* eslint-disable max-classes-per-file */
/* eslint-disable consistent-this */
/* eslint-disable eqeqeq */
/* eslint-disable react-native/no-inline-styles */
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import {
    View,
    Dimensions,
    TouchableOpacity,
    StyleSheet,
    UIManager,
    findNodeHandle,
} from 'react-native';
import { Colors, Text, NumberUtils, Image, IconSource } from '@momo-kits/core';

import AnimatedBar from './AnimatedBar';

const { width: widthScreen, height: heightScreen } = Dimensions.get('window');

const NUMBER_OF_BAR_ALL_SCREEN = 6;
const BAR_HEIGHT = heightScreen * 0.2;
let BAR_SPACE_BETWEEN = widthScreen / (NUMBER_OF_BAR_ALL_SCREEN * 2);
let BAR_WIDTH =
    widthScreen / (NUMBER_OF_BAR_ALL_SCREEN * 2) + BAR_SPACE_BETWEEN;
const MAX_LINE = 5;
const PADDING = 16;
const PADDING_CONTENT = 0;
let UNIT = 1;

const styles = StyleSheet.create({
    txtAxisY: { backgroundColor: 'transparent', color: '#9599a2' },
    axisY: { justifyContent: 'flex-end', alignItems: 'flex-end' },
    container_axisY: {
        height: BAR_HEIGHT + 12,
        justifyContent: 'space-between',
        marginTop: PADDING - 6,
        marginHorizontal: 4,
    },
    line: {
        height: 1,
        width: '100%',
        backgroundColor: Colors.black_04,
        //opacity: 0.5,
    },
    container_lines: {
        position: 'absolute',
        height: BAR_HEIGHT,
        width: '100%',
        justifyContent: 'space-between',
        marginTop: PADDING,
    },
    txtAxisX: {
        backgroundColor: 'transparent',
        color: Colors.black_12,
        // fontSize: 11,
        //fontWeight: 'bold',
        textAlign: 'center',
    },
    viewAxisX: { alignItems: 'center', marginTop: 4 },
    container: { flexDirection: 'row' },
    listChartContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    flex1: { flex: 1 },
    unitNoteContainer: {
        flexDirection: 'row',
        paddingTop: 10,
        paddingHorizontal: 20,
        alignItems: 'center',
    },
    unitNoteIcon: { width: 12, height: 12 },
    unitNoteText: { color: Colors.second_text_color, marginLeft: 5 },
});

const padZero = (num, size) => {
    let s = `${num}`;
    while (s.length < size) {
        s += '0';
    }
    return Number(s);
};

export default class BarChart extends Component {
    constructor(props) {
        super(props);
        const { data = [], unit = 1 } = props;
        this.max_value = 0;
        this.state = { list: data, ownUpdate: false };
        this.updateBarSize();
        UNIT = typeof unit === 'number' ? unit : 1;
        if (UNIT <= 0) {
            UNIT = 1;
        }
    }

    updateBarSize = (measureListChart) => {
        const widthListChart = measureListChart?.width || widthScreen;
        BAR_SPACE_BETWEEN = widthListChart / NUMBER_OF_BAR_ALL_SCREEN - 8;
        BAR_WIDTH =
            widthListChart / (NUMBER_OF_BAR_ALL_SCREEN * 2) + BAR_SPACE_BETWEEN;
    };

    static getDerivedStateFromProps(nextProps, prevState) {
        if (prevState.ownUpdate) {
            return {
                ownUpdate: false,
            };
        }
        if (
            Array.isArray(nextProps.data) &&
            nextProps.data !== prevState.list
        ) {
            return { list: nextProps.data || [] };
        }
        return null;
    }

    initItemsShow(list) {
        if (Array.isArray(list)) {
            const newlist =
                list.length > NUMBER_OF_BAR_ALL_SCREEN
                    ? list.slice(0, 6)
                    : list.slice(0, list.length);
            this.setMaxValue(newlist);
        }
    }

    scrollToIndex(index, time = 100) {
        const length = this.state.list?.length || 0;
        if (index < length && index >= 0) {
            setTimeout(() => {
                this.refFlatList?.scrollToIndex?.({
                    animated: true,
                    index: index || 0,
                });
            }, time);
        }
    }

    getMaxValue = (value) => {
        let number = Math.ceil(value / UNIT);
        if (number >= 10) {
            let roundedValue = padZero(1, `${number}`.length);
            roundedValue =
                roundedValue && roundedValue >= 1000
                    ? roundedValue / 10
                    : roundedValue >= 100
                    ? roundedValue
                    : 10;
            number = Math.ceil(number / roundedValue) * roundedValue;
        }
        if (number <= 0) {
            number = this.props.minValueAxisY || 0;
        }
        return Math.ceil(number);
    };

    setMaxValue(arr) {
        if (Array.isArray(arr) && arr.length > 0) {
            let value = Math.max.apply(
                Math,
                arr.map((o) => {
                    const { item, number } = o;
                    return item ? item.number : number || 0;
                }),
            );
            value = value || 0;
            const new_max_value = this.getMaxValue(value);
            if (new_max_value !== this.max_value || this.max_value == 0) {
                this.max_value = new_max_value;
            }
        }
    }

    onPressItem = ({ item, index }) => {
        const { onPress } = this.props;
        const newList = this.state.list.map((element, idx) => {
            if (idx === index)
                return { ...element, selected: true, isRenderLabel: true };
            return { ...element, selected: false, isRenderLabel: false };
        });
        this.setState({ list: newList, ownUpdate: true }, () => {
            onPress?.(item);
        });
    };

    renderItem = ({ item, index }) => {
        const {
            showAxisX,
            suffix = '',
            pressEnabled = true,
            activeBarColor,
            inactiveBarColor,
            activeValueColor,
            inactiveAxisXColor,
            activeAxisXColor,
        } = this.props;
        const { measureListChart } = this.state || {};
        return (
            <ChartItem
                key={item + index}
                max_value={this.max_value}
                onPress={this.onPressItem}
                pressEnabled={pressEnabled}
                data={item}
                index={index}
                measureListChart={measureListChart}
                suffix={suffix}
                activeBarColor={activeBarColor}
                inactiveBarColor={inactiveBarColor}
                activeValueColor={activeValueColor}
                activeAxisXColor={activeAxisXColor}
                inactiveAxisXColor={inactiveAxisXColor}
                showAxisX={showAxisX}
            />
        );
    };

    renderAxisY() {
        const { suffix = '', colorAxisX } = this.props;
        const listview = [];
        const unit = (this.max_value / MAX_LINE).toFixed(1);

        for (let i = 0; i <= MAX_LINE; i++) {
            let number = (unit * i).toFixed(1);
            if (number > 10) {
                number = Math.ceil(number);
            } else if (number < 10 && (number * 10) % 10 === 0) {
                number = Math.round(number);
            }
            listview.push(
                <NumberAxisY
                    colorAxisX={colorAxisX}
                    number={number}
                    key={`axisy_${i}`}
                    suffix={suffix}
                />,
            );
        }
        return <View style={styles.container_axisY}>{listview.reverse()}</View>;
    }

    renderAxisYLines() {
        const listview = [];
        for (let i = 0; i <= MAX_LINE; i++) {
            listview.push(<View key={`axisy_line${i}`} style={styles.line} />);
        }
        return <View style={styles.container_lines}>{listview.reverse()}</View>;
    }

    getItemLayout = (data, index) => ({
        length: data.length,
        offset:
            BAR_WIDTH * index +
            PADDING_CONTENT - // contentContainer PaddingHorizontal
            (widthScreen - BAR_WIDTH) / 2, // center screen
        index,
    });

    renderUnitNote = () => {
        const { suffix = '', unitNoteStyle } = this.props;
        return (
            <View style={[styles.unitNoteContainer, unitNoteStyle]}>
                <Image
                    source={IconSource.ic_info_gray}
                    style={styles.unitNoteIcon}
                    resizeMode="contain"
                />
                <Text.SubTitle style={styles.unitNoteText}>
                    Đơn vị tính {NumberUtils.formatNumberToMoney(UNIT, suffix)}
                </Text.SubTitle>
            </View>
        );
    };

    render() {
        const {
            style,
            showAxisY = true,
            showUnit = true,
            headerTitle,
            emptyDataTitles,
        } = this.props;

        const emptyMockData = emptyDataTitles?.map((item) => {
            return {
                title: item,
            };
        });

        const { list } = this.state;
        if (!this.max_value) {
            if (emptyDataTitles && list.length == 0) {
                this.initItemsShow(emptyMockData);
            } else {
                this.initItemsShow(list);
            }
        }

        return (
            <View style={style}>
                {headerTitle ? <Text weight="bold">{headerTitle}</Text> : null}
                {UNIT > 1 && showUnit ? this.renderUnitNote() : null}
                <View style={styles.container}>
                    {showAxisY ? this.renderAxisY() : null}
                    <View style={styles.flex1}>
                        {this.renderAxisYLines()}
                        <View
                            ref={(ref) => (this.listChartRef = ref)}
                            style={styles.listChartContainer}
                            onLayout={this.onLayoutListChart}>
                            {emptyDataTitles && list.length == 0
                                ? emptyMockData.map((item, index) =>
                                      this.renderItem({ item, index }),
                                  )
                                : list.map((item, index) =>
                                      this.renderItem({ item, index }),
                                  )}
                        </View>
                    </View>
                </View>
            </View>
        );
    }

    onLayoutListChart = () => {
        setTimeout(() => {
            if (!this.listChartRef) {
                return;
            }
            try {
                UIManager.measure(
                    findNodeHandle(this.listChartRef),
                    (x, y, width, height, px, py) => {
                        const measureListChart = {
                            x,
                            y,
                            width,
                            height,
                            px,
                            py,
                        };
                        this.updateBarSize(measureListChart);
                        this.setState({ measureListChart });
                    },
                );
            } catch (err) {
                console.log(err, 'Measure Animated Bar error');
            }
        }, 100);
    };
}

BarChart.propTypes = {
    activeAxisXColor: PropTypes.string,
    activeBarColor: PropTypes.string,
    activeValueColor: PropTypes.string,
    colorAxisX: PropTypes.string,
    data: PropTypes.array,
    inactiveAxisXColor: PropTypes.string,
    inactiveBarColor: PropTypes.string,
    minValueAxisY: PropTypes.number,
    onPress: PropTypes.func,
    pressEnabled: PropTypes.bool,
    showAxisY: PropTypes.bool,
    showUnit: PropTypes.bool,
    style: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
    suffix: PropTypes.string,
    unit: PropTypes.number,
    unitNoteStyle: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
};

const NumberAxisY = ({ suffix = 'đ', number, colorAxisX }) => (
    <View style={styles.axisY}>
        <Text.SubTitle
            style={[styles.txtAxisY, { color: colorAxisX || Colors.black_12 }]}>
            {`${NumberUtils.formatNumberToMoney(
                number,
                UNIT > 1 ? '' : suffix,
            )}`}
        </Text.SubTitle>
    </View>
);

class ChartItem extends Component {
    onPress = () => {
        const { pressEnabled = true } = this.props;
        if (pressEnabled) {
            const { data = {}, onPress, index } = this.props || {};
            onPress?.({
                item: { ...data, selected: true, isRenderLabel: true },
                index,
            });
        }
    };

    render() {
        const { data, max_value } = this.props;
        const {
            number: numberData,
            selected = true,
            isRenderLabel = false,
            customBarHeight,
        } = data || {};
        const {
            showAxisX = true,
            suffix = '',
            pressEnabled = true,
            measureListChart,
            activeBarColor,
            inactiveBarColor,
            activeValueColor,
        } = this.props;
        let number = ((numberData || 0) / UNIT).toFixed(1);
        if (number > 10) {
            number = Math.round(number);
        } else if (number < 10 && (number * 10) % 10 === 0) {
            number = Math.round(number);
        }
        return (
            <View
                style={{
                    width: BAR_WIDTH,
                    marginTop: PADDING,
                    zIndex: selected ? 100 : 0,
                }}>
                <TouchableOpacity
                    onPress={this.onPress}
                    activeOpacity={0.5}
                    disabled={!pressEnabled}>
                    <AnimatedBar
                        selected={selected || false}
                        number={number}
                        barHeight={BAR_HEIGHT}
                        barWidth={BAR_WIDTH - BAR_SPACE_BETWEEN}
                        spaceBetween={BAR_SPACE_BETWEEN / 2}
                        value={
                            customBarHeight || (BAR_HEIGHT * number) / max_value
                        }
                        delay={100}
                        suffix={UNIT > 1 ? '' : suffix}
                        measureListChart={measureListChart}
                        activeBarColor={activeBarColor}
                        inactiveBarColor={inactiveBarColor}
                        activeValueColor={activeValueColor}
                        isRenderLabel={isRenderLabel}
                    />
                </TouchableOpacity>

                {showAxisX ? this.renderAxisX() : null}
            </View>
        );
    }

    renderAxisX() {
        const { data, emptyDataTitles } = this.props;
        const { selected, title } = data || {};
        const { activeAxisXColor, inactiveAxisXColor } = this.props;
        return (
            <View style={styles.viewAxisX}>
                <Text.Caption
                    onPress={this.onPress}
                    style={[styles.txtAxisX]} //{ color: selected ? activeAxisXColor || Colors.pink_04 : inactiveAxisXColor || '#9da2a6' }
                >
                    {`${title}`}
                </Text.Caption>
            </View>
        );
    }
}

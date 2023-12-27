/* eslint-disable consistent-this */
import React, { Component } from 'react';
import {
    Dimensions,
    findNodeHandle,
    Platform,
    StyleSheet,
    TouchableOpacity,
    UIManager,
    View,
} from 'react-native';
import { Text, Spacing, Colors, ScaleSize, NumberUtils } from '@momo-kits/core';
import CustomColors from './CustomColors';
import AnimatedBar from './AnimatedBar';

const { width: widthScreen, height: heightScreen } = Dimensions.get('window');

const NUMBER_OF_BAR_ALL_SCREEN = 6;
const BAR_HEIGHT = heightScreen * 0.3;
let BAR_SPACE_BETWEEN = widthScreen / (NUMBER_OF_BAR_ALL_SCREEN * 2);
let BAR_WIDTH =
    widthScreen / (NUMBER_OF_BAR_ALL_SCREEN * 2) + BAR_SPACE_BETWEEN;
const MAX_LINE = 6;
const PADDING = 16;
const PADDING_CONTENT = 0;
let UNIT = 1;

let preSelf = null;

const styles = StyleSheet.create({
    txtAxisY: {
        backgroundColor: Colors.transparent,
        color: Colors.black_12,
        fontSize: ScaleSize(10),
    },
    axisY: { justifyContent: 'flex-end', alignItems: 'flex-end' },
    container_axisY: {
        height: BAR_HEIGHT + 12,
        justifyContent: 'space-between',
        marginTop: PADDING - 6,
        paddingHorizontal: 10,
    },
    line: {
        height: 1,
        width: '100%',
        backgroundColor: CustomColors.ghost,
        opacity: 0.5,
    },
    container_lines: {
        position: 'absolute',
        height: BAR_HEIGHT,
        width: '100%',
        justifyContent: 'space-between',
        marginTop: PADDING,
    },
    txtAxisX: {
        backgroundColor: Colors.transparent,
        color: Colors.red_01,
        textAlign: 'center',
        // backgroundColor: 'red',
        // transform: [{ translateY: -PADDING / 1.5}],
        // marginTop: PADDING
    },
    viewAxisX: { alignItems: 'center', marginTop: Spacing.XS },
    container: { flexDirection: 'row' },
    listChartContainer: {
        flex: 1,
        flexDirection: 'row',
    },
    flex1: { flex: 1 },
    unitNoteContainer: {
        flexDirection: 'row',
        paddingTop: Spacing.S,
        paddingHorizontal: Spacing.L,
        alignItems: 'center',
    },
    unitNoteIcon: { width: 12, height: 12 },
    unitNoteText: { color: Colors.second_text_color, marginLeft: Spacing.XS },
    barStyle(selected, isDown) {
        return {
            width: BAR_WIDTH,
            // marginTop: PADDING,
            marginTop: isDown ? 0 : PADDING,
            zIndex: selected ? 100 : 0,
            transform: isDown ? [{ rotate: '180deg' }] : [],
            // transform: isDown ? [{ rotate: '180deg'}, { translateY: -PADDING}] : [{ translateY: PADDING}],
        };
    },
    bottomBar: {
        ...Platform.select({
            android: {
                marginTop: ScaleSize(10),
            },
            ios: {},
        }),
    },
    flex_end: { justifyContent: 'flex-end' },
    row_flex: { flexDirection: 'row', flex: 1 },
    lineAxisY: {
        position: 'absolute',
        height: BAR_HEIGHT,
        backgroundColor: CustomColors.ghost,
        width: 1,
        top: BAR_SPACE_BETWEEN / 2,
    },
});

function getMaxValue(list1, list2, unit = 1) {
    const arr = list1?.concat?.(list2) || [];
    if (Array.isArray(arr) && arr.length > 0) {
        let value = Math.max.apply(
            Math,
            arr.map(function (o) {
                let { item, number } = o;
                return item ? item.number : number || 0;
            }),
        );
        value = value || 0;
        const max = (Math.round(value / 6) * 6) / unit;
        return max + max / 3;
    }
}

export default class ChartContainer extends Component {
    constructor(props) {
        super(props);
        const { data = [], data2 = [], unit = 1 } = props;
        UNIT = typeof unit === 'number' ? unit : 1;
        if (UNIT <= 0) {
            UNIT = 1;
        }
        this.state = {
            list1: data,
            list2: data2,
            maxValue: getMaxValue(data, data2, UNIT),
        };
        this.updateBarSize();
    }

    static getDerivedStateFromProps(nextProps, state) {
        const { data = [], data2 = [], unit = 1 } = nextProps || {};
        UNIT = unit;
        return {
            list1: data,
            list2: data2,
            maxValue: getMaxValue(data, data2, UNIT),
        };
    }

    updateBarSize = (measureListChart) => {
        const widthListChart = measureListChart?.width || widthScreen;
        BAR_SPACE_BETWEEN = widthListChart / (NUMBER_OF_BAR_ALL_SCREEN * 2);
        BAR_WIDTH =
            widthListChart / (NUMBER_OF_BAR_ALL_SCREEN * 2) + BAR_SPACE_BETWEEN;
    };

    scrollToIndex(index, time = 100) {
        const length = this.state.list1?.length || 0;
        if (index < length && index >= 0) {
            setTimeout(() => {
                this.refFlatList?.scrollToIndex?.({
                    animated: true,
                    index: index || 0,
                });
            }, time);
        }
    }

    renderAxisY() {
        const { showSuffix = true, suffix = '' } = this.props || {};
        const listView = [];
        const maxValue = this.state.maxValue + 0;
        let unit = ((maxValue * 2) / MAX_LINE).toFixed(1);
        // console.log('renderAxisY maxValue', maxValue);

        for (let i = -MAX_LINE / 2; i <= MAX_LINE / 2; i++) {
            let number = Math.abs(unit * i).toFixed(1);
            if (number > 10) {
                number = Math.ceil(number);
            } else if (number < 10 && (number * 10) % 10 === 0) {
                number = Math.round(number);
            }
            if (i < 0) {
                number = -number;
            }
            // console.log('renderAxisY number:', number);
            listView.push(
                <NumberAxisY
                    number={number}
                    key={`axisy_${i}`}
                    suffix={showSuffix ? suffix : ''}
                />,
            );
        }
        return <View style={styles.container_axisY}>{listView.reverse()}</View>;
    }

    renderAxisYLines() {
        const listView = [];
        for (let i = 0; i <= MAX_LINE; i++) {
            listView.push(<View key={`axisy_line${i}`} style={styles.line} />);
        }
        return (
            <View style={styles.container}>
                {/* <View style={styles.lineAxisY} /> */}
                <View style={styles.container_lines}>{listView.reverse()}</View>
            </View>
        );
    }

    getItemLayout = (data, index) => ({
        length: data.length,
        offset:
            BAR_WIDTH * index +
            PADDING_CONTENT - //contentContainer PaddingHorizontal
            (widthScreen - BAR_WIDTH) / 2, //center screen
        index,
    });

    onPressUpItem = (data) => {
        this._onPressColumn(data);
    };

    onPressDownItem = (data) => {
        this._onPressColumn(data);
    };

    _onPressColumn = (data) => {
        const { list1, list2 } = this.state;
        const { onPressColumn } = this.props;
        onPressColumn?.({
            // list1: this.generateListSelectedByData(list1, data),
            // list2: this.generateListSelectedByData(list2, data),
            index: this.getIndexIndData(list1, data),
        });
    };

    getIndexIndData = (list = [], data = {}) => {
        const { title: titleSelected } = data || {};
        const indexOfData = list.findIndex(
            (item) => item?.title === titleSelected,
        );
        return indexOfData;
    };

    render() {
        const { list1, list2, maxValue } = this.state;
        const {
            style,
            showAxisY = true,
            pressEnabled = true,
            suffix,
            colorUp = '',
            colorDown = '',
            activeIndex,
        } = this.props;
        return (
            <View style={style}>
                <View style={styles.container}>
                    {showAxisY ? this.renderAxisY() : null}
                    <View style={styles.flex1}>
                        {this.renderAxisYLines()}
                        <BarComponent
                            activeIndex={activeIndex}
                            barColor={colorUp}
                            list={list1}
                            type={'UP'}
                            measureListChart={this.onLayoutListChart}
                            suffix={suffix}
                            max_value={maxValue}
                            pressEnabled={pressEnabled}
                            onPress={this.onPressUpItem}
                        />
                        <BarComponent
                            activeIndex={activeIndex}
                            barColor={colorDown}
                            list={list2}
                            type={'DOWN'}
                            measureListChart={this.onLayoutListChart}
                            suffix={suffix}
                            max_value={maxValue}
                            pressEnabled={pressEnabled}
                            onPress={this.onPressDownItem}
                            // style={styles.bottomBar}
                        />
                    </View>
                </View>
            </View>
        );
    }

    onLayoutListChart = (e) => {
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
            } catch (error) {
                // LogUtil.e(error, 'Measure Animated Bar error');
            }
        }, 100);
    };
}

class NumberAxisY extends Component {
    render() {
        const { suffix = '', number } = this.props;
        return (
            <View style={styles.axisY}>
                <Text.Caption style={styles.txtAxisY}>
                    {`${NumberUtils.formatNumberToMoney(number, suffix)}`}
                    {/* {`${number} ${suffix}`} */}
                </Text.Caption>
            </View>
        );
    }
}

class Item extends Component {
    constructor(props) {
        super(props);
        const { data, max_value } = props;
        this.state = { data, max_value };
    }

    componentDidMount() {
        if (this.state.data?.selected) {
            preSelf = this;
        }
    }

    resetData() {
        const { data } = this.state;
        this.setState({ data: { ...data, selected: false } });
    }

    static getDerivedStateFromProps(nextProps, state) {
        const { data, max_value } = nextProps;
        if (state.data !== data) {
            return { data, max_value };
        }
        return null;
    }

    onPress = () => {
        const { pressEnabled = true, onPress, isSelected = false } = this.props;
        if (pressEnabled) {
            const { data = {} } = this.state || {};
            const { selected } = data;
            // if (!selected) {
            //     const newState = { ...data, selected: true };
            //     onPress?.(newState);
            // }
            if (!isSelected) {
                const newState = { ...data, selected: true };
                onPress?.(newState);
            }
        }
    };

    renderAxisX() {
        const { data } = this.state;
        const { isSelected = false } = this.props;
        const { selected, title } = data || {};
        return (
            <View style={styles.viewAxisX}>
                <Text.Caption
                    onPress={this.onPress}
                    style={[
                        styles.txtAxisX,
                        { color: Colors.black_12 }, //isSelected ? Colors.black_17 : CustomColors.gray_chateau },
                    ]}
                    //weight="bold"
                >{`${title}`}</Text.Caption>
            </View>
        );
    }

    render() {
        const { data, max_value } = this.state;
        const { isSelected = false } = this.props;
        const { number: numberData, selected } = data || {};
        const {
            suffix = '',
            pressEnabled = true,
            measureListChart,
            type,
            index,
            barColor = '',
        } = this.props;
        let number = ((numberData || 0) / UNIT).toFixed(1);
        if (number > 10 || (number < 10 && (number * 10) % 10 === 0)) {
            number = Math.round(number);
        }
        const isDown = type === 'DOWN';
        const backgroundColorBar = barColor;
        return (
            <View style={{ flex: 1, alignItems: 'center' }}>
                <TouchableOpacity
                    onPress={this.onPress}
                    activeOpacity={1}
                    disabled={!pressEnabled}
                    style={[styles.barStyle(isSelected, isDown)]}>
                    <AnimatedBar
                        key={numberData}
                        selected={isSelected}
                        number={number}
                        barHeight={BAR_HEIGHT / 2}
                        barWidth={BAR_WIDTH - BAR_SPACE_BETWEEN}
                        spaceBetween={BAR_SPACE_BETWEEN / 2}
                        value={(BAR_HEIGHT * number) / (max_value * 2)}
                        delay={100}
                        suffix={suffix}
                        measureListChart={measureListChart}
                        barStyle={styles.flex_end}
                        barColumnStyle={{
                            backgroundColor: backgroundColorBar,
                            opacity: isSelected ? 1 : 0.5,
                        }}
                        isDown={isDown}
                        numberData={numberData}
                    />
                </TouchableOpacity>
                {isDown && this.renderAxisX()}
            </View>
        );
    }
}

class BarComponent extends React.Component {
    renderItem = ({ item, index, type }) => {
        const {
            suffix = '',
            pressEnabled = true,
            max_value,
            onPress,
            barColor,
            activeIndex,
        } = this.props;
        const isSelected = activeIndex === index;
        const { measureListChart } = this.props || {};
        return (
            <Item
                isSelected={isSelected}
                barColor={barColor}
                key={item + index + type}
                max_value={max_value}
                pressEnabled={pressEnabled}
                data={item}
                index={index}
                measureListChart={measureListChart}
                suffix={suffix}
                type={type}
                onPress={onPress}
            />
        );
    };

    render() {
        const { list, type, style } = this.props;
        return (
            <View style={[styles.listChartContainer, style]}>
                {list.map((item, index) =>
                    this.renderItem({ item, index, type }),
                )}
            </View>
        );
    }
}

/* eslint-disable react/no-did-update-set-state */
import React, { Component } from 'react';
import {
    FlatList,
    Dimensions,
    Platform
} from 'react-native';
import moment from 'moment';
import Month from './Month';
import style from './Day/style';
import LunarDateConverter from './LunarDateConverter';

const ITEM_WIDTH = Dimensions.get('window').width - 24;
const MAX_RENDER_PER_BATCH = Platform.OS === 'android' ? 1 : 12;

const converter = new LunarDateConverter();
export default class MonthList extends Component {
    constructor(props) {
        super(props);
        // this.state = {
        //     // data: [],
        //     isDoubleDateMode: props.isDoubleDateMode
        // };
        this.currentDate = moment();
        this.data = this.getMonthList();
        this.currentScrollIndex = this.getIndexOfMonth(moment(props.selectedDate), this.data);
        this.list = React.createRef();
        this.heightStyle = {};
        this.holidays = props.holidays;
    }

    // componentDidUpdate(prevProps) {
    //     const { isDoubleDateMode } = this.props;
    //     if (isDoubleDateMode !== prevProps.isDoubleDateMode) {
    //         this.setState({
    //             // data: this.getMonthList(this.props),
    //             isDoubleDateMode
    //         });
    //     }
    // }

    renderMonth = ({ item, index }) => {
        const { isDoubleDateMode, priceList } = this.props;
        const keyMonth = moment(item.date)?.format('YYYY-MM');
        const priceListDate = priceList?.[keyMonth]?.day;
        return (
            <Month
                {...this.props}
                key={index}
                month={item.date || {}}
                dateList={item.dateList || []}
                priceListDate={priceListDate}
                isDoubleDateMode={isDoubleDateMode}
            />
        );
    };

    checkRange = (date, start, end) => {
        if (!date || !start) return false;
        if (!end) return date.year() === start.year() && date.month() === start.month();
        if (date.year() < start.year() || (date.year() === start.year() && date.month() < start.month())) return false;
        return !(date.year() > end.year() || (date.year() === end.year() && date.month() > end.month()));
    };

    shouldUpdate = (month, props) => {
        if (!props) return false;
        const {
            startDate,
            endDate
        } = props;
        const { startDate: curStartDate, endDate: curEndDate } = this.props;
        const {
            date
        } = month;
        const next = this.checkRange(date, startDate, endDate);
        const prev = this.checkRange(date, curStartDate, curEndDate);
        return !!(prev || next);
    };

    convertLunarToSolar(date) {
        return date ? converter.SolarToLunar({
            solarDay: date.date(),
            solarMonth: date.month() + 1,
            solarYear: date.year()
        }) : {};
    }

    findHoliday = (date) => {
        const { holidays } = this.props;
        if (date && holidays && holidays.length > 0) {
            const day = date.date();
            const month = date.month() + 1;
            return holidays.find((item) => item.day === day && item.month === month);
        }
        return null;
    };

    checkHoliday = (date, holidays) => {
        const holiday = this.findHoliday(date, holidays);
        return {
            isSolarHoliday: !!(holiday && !holiday.lunar),
            isLunarHoliday: !!(holiday && holiday.lunar)
        };
    };

    getDayList = (date) => {
        let dayList;
        const month = date.month();
        let weekday = date.isoWeekday();
        if (weekday === 1) {
            dayList = [];
        } else {
            dayList = new Array(weekday - 1).fill({
                empty: moment(date).subtract(1, 'h'),
                lunarDate: this.convertLunarToSolar(date),
                ...this.checkHoliday(date)
            });
        }
        while (date.month() === month) {
            const cloned = moment(date);
            dayList.push({
                date: cloned,
                lunarDate: this.convertLunarToSolar(cloned),
                ...this.checkHoliday(date)
            });
            date.add(1, 'days');
        }
        date.subtract(1, 'days');
        weekday = date.isoWeekday();
        if (weekday === 1) {
            return dayList.concat(new Array(6).fill({
                empty: moment(date).hour(1),
                lunarDate: this.convertLunarToSolar(date)
            }));
        }
        return dayList.concat(new Array(Math.abs(7 - weekday)).fill({
            empty: moment(date).hour(1),
            lunarDate: this.convertLunarToSolar(date)
        }));
    };

    getMonthList = (props) => {
        const minDate = moment((props || this.props).minDate).date(1);
        const maxDate = moment((props || this.props).maxDate);
        const monthList = [];
        if (!maxDate || !minDate) return monthList;
        while (maxDate > minDate || (
            maxDate.year() === minDate.year()
            && maxDate.month() === minDate.month()
        )) {
            const d = moment(minDate);
            const month = {
                date: d,
                dateList: this.getDayList(d)
            };
            month.shouldUpdate = this.shouldUpdate(month, props);
            monthList.push(month);
            minDate.add(1, 'month');
        }
        return monthList;
    };

    getIndexOfMonth = (month, data) => data.findIndex((item) => item.date.isSame(month, 'month'));

    // componentDidMount() {
    //     const {
    //         selectedDate
    //     } = this.props;
    //     const data = this.getMonthList();
    //     this.currentScrollIndex = this.getIndexOfMonth(moment(selectedDate), data);
    //     this.setState({ data });
    // }
    // componentDidMount() {
    //     if (this.list.current) {
    //         this.scrollToMonth(moment(this.props.selectedDate));
    //     }
    // }

    // componentWillUnmount() {
    //     const { isDoubleDateMode } = this.props;
    //     this.setState({
    //         // data: [],
    //         isDoubleDateMode
    //     });
    // }

    getCurrentVisibleMonth = (info) => {
        const { changed } = info;
        const { onScrollCalendar } = this.props;
        if (changed && changed.length > 0) {
            const { item, key, index } = changed[0];
            if (onScrollCalendar && item && this.currentKey !== key) {
                this.currentKey = key;
                try {
                    this.heightStyle = this.data && this.data[index] && this.data[index].dateList
                        ? {
                            height: (style.containerDayHeight * this.data[index].dateList.length / 7) + 10
                        }
                        : {};
                } catch (e) {
                    this.heightStyle = {};
                }
                if (onScrollCalendar) {
                    onScrollCalendar({ date: item.date, key, currentIndex: index });
                }
            }
        }
    };

    keyExtractor = (item) => `${item.date.month() + 1}/${item.date.year()}`;

    scrollToMonth = (month) => {
        const index = this.getIndexOfMonth(month, this.data);
        if (this.list.current && index !== -1) {
            this.list.current.scrollToIndex({
                index,
                animated: true
            });
        }
    };

    getItemLayout = (data, index) => (
        { length: ITEM_WIDTH, offset: ITEM_WIDTH * index, index }
    )

    render() {
        const { priceList } = this.props;
        return (
            <FlatList
                extraData={priceList}
                style={this.heightStyle}
                horizontal
                pagingEnabled
                ref={this.list}
                data={this.data}
                renderItem={this.renderMonth}
                showsHorizontalScrollIndicator={false}
                keyExtractor={this.keyExtractor}
                onViewableItemsChanged={this.getCurrentVisibleMonth}
                onScrollToIndexFailed={() => {}}
                removeClippedSubviews
                initialNumToRender={1}
                maxToRenderPerBatch={MAX_RENDER_PER_BATCH}
                windowSize={3}
                contentContainerStyle={{ paddingTop: 5 }}
                initialScrollIndex={this.currentScrollIndex}
                getItemLayout={this.getItemLayout}
                viewabilityConfig={{
                    itemVisiblePercentThreshold: 50
                }}
            />
        );
    }
}

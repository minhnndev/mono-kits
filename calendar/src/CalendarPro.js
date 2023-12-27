/* eslint-disable no-bitwise */
import React, { Component } from 'react';
import PropTypes from 'prop-types';

import {
    View,
    Dimensions,
    ScrollView,
    TouchableWithoutFeedback,
    StyleSheet
} from 'react-native';
import Moment from 'moment';
import {
    Text, SwitchLanguage, LocalizedStrings, Colors, Image, IconSource
} from '@momo-kits/core';
import MonthList from './MonthList';
import HeaderControl from './HeaderControl';
import LunarDateConverter from './LunarDateConverter';
import Util from './Util';

const widthScreen = Dimensions.get('window').width;

export default class CalendarPro extends Component {
    constructor(props) {
        super(props);
        this.today = Moment();
        this.year = this.today.year();
        this.getDateRange();
        this.header = this.today.clone();
        this.selectedDate = props.selectedDate;
        this.state = {
            startDate: props.startDate,
            endDate: props.endDate,
            showLunar: props.isShowLunar,
            tabSelected: 0,
            holidays: [],
            ownUpdate: false,
        };
        this.converter = new LunarDateConverter();
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (prevState.ownUpdate) {
            return {
                ownUpdate: false,
            };
        } if (nextProps.isShowLunar !== prevState.showLunar) {
            return { showLunar: nextProps.isShowLunar };
        }
        return null;
    }

    setDateRange = (dateRange, isScrollToStartDate) => {
        if (dateRange && dateRange.startDate && dateRange.endDate) {
            this.setState({ startDate: dateRange.startDate, endDate: dateRange.endDate }, () => {
                const dateScroll = isScrollToStartDate ? dateRange.startDate : dateRange.endDate;
                this.refs.MonthList.scrollToMonth(dateScroll);
            });
        }
    }

    ownSetState(state) {
        this.setState({ ...state, ownUpdate: true });
    }

    loadLabel = (data, type) => {
        const {
            i18n,
            customI18n
        } = this.props;
        if (~['w', 'weekday', 'text'].indexOf(type)) {
            return (customI18n[type] || {})[data] || Util.I18N_MAP[i18n][type][data];
        }
        if (type === 'date') {
            return data.format(customI18n[type] || Util.I18N_MAP[i18n][type]);
        }
    };

    getDateRange = () => {
        const {
            maxDate,
            minDate,
            format
        } = this.props;
        let max = Moment(maxDate, format);
        let min = Moment(minDate, format);
        const maxValid = max.isValid();
        const minValid = min.isValid();
        if (!maxValid && !minValid) {
            max = Moment().add(12, 'months');
            min = Moment();
        }
        if (!maxValid && minValid) {
            max = min.add(12, 'months');
        }
        if (maxValid && !minValid) {
            min = max.subtract(12, 'months');
        }
        if (min.isSameOrAfter(max)) return {};
        this.minDate = min;
        this.maxDate = max;
    };

    onChoose = (day) => {
        const {
            startDate, tabSelected
        } = this.state;
        const { isDoubleDateMode, onDateChange } = this.props;
        if (isDoubleDateMode) {
            if (tabSelected === 1) {
                if (startDate && day >= startDate) {
                    this.ownSetState({
                        endDate: day
                    });
                } else if (startDate && day < startDate) {
                    this.ownSetState({
                        startDate: day,
                        endDate: null
                    });
                }
            } else {
                this.ownSetState({
                    startDate: day
                });
            }
        } else {
            this.ownSetState({
                startDate: day,
                endDate: null,
            });
        }
        if (onDateChange) {
            onDateChange(day);
        }
    };

    executeProcessAfterScrollCalendar = (date, key) => {
        const holidays = Object.values(Util.getHolidaysInMonth(Moment(date)));
        const {
            showLunar
        } = this.state;
        if (this.refs && this.refs.HeaderControl) {
            this.refs.HeaderControl.onUpdateInfo({ date });
            this.header = date.clone().startOf('month');
        }
        let data = [];
        if (!showLunar) {
            data = holidays.filter((item) => !item.lunar || item.mixedLabel);
        } else {
            data = holidays;
        }
        this.ownSetState({ holidays, temp: data, headerKey: key });
    };

    onScrollCalendar = (data) => {
        const { headerKey } = this.state;
        if (data) {
            if (data.key !== headerKey) {
                this.executeProcessAfterScrollCalendar(data.date, data.key);
            }
        }
    };

    setDoubleDateAndTabIndex = (firstDate, secondDate, tabSelected) => {
        this.ownSetState({
            startDate: firstDate ? Moment(firstDate) : null,
            endDate: secondDate ? Moment(secondDate) : null,
            tabSelected
        });
    };

    toggleLunarDate = () => {
        const { showLunar, holidays } = this.state;
        const { onCallbackCalendar } = this.props;
        let data = [];
        const nextStateShowLunar = !showLunar;
        if (!nextStateShowLunar) {
            data = holidays.filter((item) => !item.lunar || item.mixedLabel);
        } else {
            data = holidays;
        }
        if (onCallbackCalendar) {
            onCallbackCalendar('lunar', nextStateShowLunar);
        }

        this.ownSetState({ showLunar: !showLunar, temp: data, ownUpdate: true });
    };

    onPressBackArrow = () => {
        const previousDate = Moment(this.header).startOf('month').subtract(1, 'months');
        if (this.refs && this.refs.HeaderControl && previousDate.isSameOrAfter(this.minDate, 'month')) {
            this.header = previousDate;
            this.refs.HeaderControl.onUpdateInfo({ date: previousDate });
            this.refs.MonthList.scrollToMonth(previousDate);
        }
    };

    onPressNextArrow = () => {
        const nextDate = Moment(this.header).startOf('month').add(1, 'months');
        if (this.refs && this.refs.HeaderControl && nextDate.isSameOrBefore(this.maxDate, 'month')) {
            this.header = nextDate;
            this.refs.HeaderControl.onUpdateInfo({ date: nextDate });
            this.refs.MonthList.scrollToMonth(nextDate);
        }
    };

    render() {
        const {
            startDate, endDate, showLunar, tabSelected, holidays, temp
        } = this.state;
        const {
            i18n, isDoubleDateMode, priceList, labelFrom, labelTo, isHideLabel, isHideHoliday, isOffLunar
        } = this.props;
        let priceListFormat = priceList?.outbound;
        if (isDoubleDateMode) {
            priceListFormat = tabSelected === 0 ? priceList?.outbound : priceList?.inbound;
        }
        return (
            <View style={styles.container}>
                <View style={styles.viewDate}>
                    <HeaderControl
                        ref="HeaderControl"
                        // selectedDate={this.selectedDate}
                        onPressBackArrow={this.onPressBackArrow}
                        onPressNextArrow={this.onPressNextArrow}
                    />
                    <View style={styles.viewDay}>
                        {[1, 2, 3, 4, 5, 6, 7].map((item) => (
                            <Text
                                style={[styles.textDay, { color: item === 6 || item === 7 ? Colors.red_05 : Colors.black_12 }]}
                                key={item}
                            >
                                {Util.mapWeeKDate(item)}
                            </Text>
                        )
                        )}
                    </View>
                    <MonthList
                        ref="MonthList"
                        today={this.today}
                        minDate={this.minDate}
                        maxDate={this.maxDate}
                        startDate={startDate}
                        endDate={endDate}
                        onChoose={this.onChoose}
                        i18n={i18n}
                        onScrollCalendar={this.onScrollCalendar}
                        isShowLunar={!isOffLunar && showLunar}
                        isDoubleDateMode={isDoubleDateMode}
                        tabSelected={tabSelected}
                        lunarConverter={this.converter}
                        holidays={holidays}
                        selectedDate={this.selectedDate}
                        priceList={priceListFormat}
                        labelFrom={labelFrom}
                        labelTo={labelTo}
                        isHideLabel={isHideLabel}
                    />
                </View>
                {
                    !isOffLunar && (
                        <View style={styles.viewLunar}>
                            <TouchableWithoutFeedback onPress={this.toggleLunarDate}>
                                <Image source={showLunar ? IconSource.ic_checkbox_checked_24 : IconSource.ic_checkbox_unchecked_24} style={styles.iconSelected} />
                            </TouchableWithoutFeedback>
                            <Text.SubTitle
                                style={styles.txtLunar}
                                onPress={this.toggleLunarDate}
                            >
                                {SwitchLanguage.showLunar}
                            </Text.SubTitle>
                        </View>
                    )
                }

                {
                    !isHideHoliday && (
                        <ScrollView
                            contentContainerStyle={styles.contentScroll}
                            showsVerticalScrollIndicator={false}
                            enabledNestedScroll
                        >
                            {temp && temp.length > 0 && temp.map((item, idx) => {
                                const labelHoliday = showLunar ? (item.mixedLabel || item.label || '') : (item.label || '');
                                const labelHighlight = showLunar ? (item.highlight || '') : '';
                                const labelDate = LocalizedStrings.defaultLanguage === 'en' ? `${Util.mapMonthShorten(item.month)} ${item.day}` : `${item.day} tháng ${item.month}`;
                                return (
                                    <View style={styles.row} key={idx.toString()}>
                                        <Text.SubTitle style={styles.txtMonthLunar}>
                                            {labelDate}
                                        </Text.SubTitle>
                                        <Text.SubTitle style={styles.subTextLunar}>
                                            {`${labelHoliday} `}
                                            {
                                                labelHighlight ? <Text style={{ color: Colors.red_05 }}>{labelHighlight}</Text> : ''
                                            }
                                        </Text.SubTitle>
                                    </View>
                                );
                            })}
                        </ScrollView>
                    )
                }

            </View>
        );
    }
}

CalendarPro.propTypes = {
    i18n: PropTypes.string,
    format: PropTypes.string,
    customI18n: PropTypes.object,
    isShowLunar: PropTypes.bool,
    onCallbackCalendar: PropTypes.func,
    minDate: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]),
    maxDate: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)])
};

CalendarPro.defaultProps = {
    format: 'YYYY-MM-DD',
    i18n: 'vi',
    customI18n: {},
    isShowLunar: true
};

const styles = StyleSheet.create({
    row: { flexDirection: 'row' },
    txtMonthLunar: { color: Colors.red_05, width: 80 },
    subTextLunar: {
        // fontSize: 12,
        color: '#222222',
        paddingLeft: 6,
        flexShrink: 1
    },
    contentScroll: { paddingHorizontal: 12, paddingVertical: 10 },
    iconSelected: { width: 24, height: 24, resizeMode: 'cover' },
    txtLunar: {
        paddingLeft: 6,
        color: '#222222',
        // fontSize: 12,
        lineHeight: 14
    },
    viewLunar: {
        flexDirection: 'row', alignItems: 'center', marginHorizontal: 12, paddingVertical: 12, borderBottomWidth: 1, borderStyle: 'solid', borderColor: '#c7c7cd'
    },
    viewDate: { paddingHorizontal: 12 },
    textDay: {
        // fontSize: 14,
        lineHeight: 16,
        width: (widthScreen - 38) / 7,
        textAlign: 'center',
        fontWeight: 'bold',
    },
    viewDay: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 7,
        paddingTop: 15,
        paddingBottom: 10,
    },
    container: { flex: 1, backgroundColor: 'white', marginTop: 20, },
});

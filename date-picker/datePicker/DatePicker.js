/* eslint-disable max-len */
/* eslint-disable react/no-unused-prop-types */
import React, { Component } from 'react';
import {
    View, StyleSheet, Dimensions
} from 'react-native';
import PropTypes from 'prop-types';
import {
    BottomPopupHeader, Button, Text, ScreenUtils, SwitchLanguage, Spacing, Colors
} from '@momo-kits/core';
import WheelPicker from './WheelPicker';
import DatePickerHelper from './helper/DatePickerHelper';

const { ifIphoneX } = ScreenUtils;

const widthScreen = Dimensions.get('window').width;
const styles = StyleSheet.create({
    container: {
        width: widthScreen,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 6,
    },
    content: {
        flexDirection: 'row',
        width: widthScreen,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 21,
        paddingTop: 12
    },
    column: {
        borderWidth: 2,
        borderColor: 'red',
    },
    header: {
        borderTopLeftRadius: 12,
        borderTopRightRadius: 12,
        //backgroundColor:'red',
        height: 64,
        borderBottomColor: Colors.black_04,
        borderBottomWidth: 1,
        alignItems:'center',
        justifyContent:'center',
        marginBottom: 0, // Spacing.S,
    },
    view: {
        backgroundColor: 'white',
        borderTopRightRadius: 16,
        borderTopLeftRadius: 16,
        overflow: 'hidden'
    },
    titleCancel: {
        fontSize: 17,
        color: '#4A90E2'
    },
    titleConfirm: {
        fontSize: 17,
        color: '#4A90E2',
        textAlign: 'right'
    }
});

const getStrings = (strings) => (strings?.length === 1 ? `0${strings}` : strings);
class DatePicker extends Component {
    constructor(props) {
        super(props);
        this.initDefault(props);
    }

    // onBackPress = () => {
    //     this.hide();
    //     return true;
    // }

    componentDidMount() {
        // BackHandler.removeEventListener('hardwareBackPress', this.onBackPress);
        // BackHandler.addEventListener('hardwareBackPress', this.onBackPress);

        // setTimeout(() => {
        //     BackHandler.removeEventListener('hardwareBackPress', this.onBackPress);
        //     BackHandler.addEventListener('hardwareBackPress', this.onBackPress);
        // }, 200);

        this.setStateMonth(this.dayIndex, this.monthIndex, this.yearIndex);
        const { onCreateRef } = this.props;
        if (typeof onCreateRef === 'function') onCreateRef(this);
    }

    componentWillUnmount() {
        // BackHandler.removeEventListener('hardwareBackPress', this.onBackPress);
    }

    initDefault(props) {
        if (props) {
            const propsMinDate = props.minDate ? props.minDate : props.minValue;
            const propsMaxDate = props.maxDate ? props.maxDate : props.maxValue;
            const propsSelectedDate = props.selectedDate ? props.selectedDate : props.value;

            if (propsMinDate) {
                this.minDate = DatePickerHelper.formatDate(propsMinDate, props.format);
            } else if (props.maxAge) {
                this.minDate = DatePickerHelper.calculateDateSinceYearAgo(props.maxAge);
            } else {
                this.minDate = null;
            }

            if (propsMaxDate) {
                this.maxDate = DatePickerHelper.formatDate(propsMaxDate, props.format);
            } else if (props.minAge) {
                this.maxDate = DatePickerHelper.calculateDateSinceYearAgo(props.minAge);
            } else {
                this.maxDate = null;
            }

            if (this.maxDate && this.minDate && this.maxDate.getTime() < this.minDate.getTime()) {
                this.maxDate = null;
                this.minDate = null;
            }

            if (propsSelectedDate) {
                this.selectedDate = DatePickerHelper.formatDate(propsSelectedDate, props.format);
                if (this.selectedDate) {
                    if (this.minDate && this.selectedDate.getTime() < this.minDate.getTime()) {
                        this.selectedDate = null;
                    } else if (this.maxDate && this.maxDate.getTime() < this.selectedDate.getTime()) {
                        this.selectedDate = null;
                    }
                }
            } else {
                this.selectedDate = null;
            }
            if (props.format === 'hh:mm') {
                this.selectedDate = props.isRanged ? {
                    from: DatePickerHelper.formatDate(propsSelectedDate.from, props.format),
                    to: DatePickerHelper.formatDate(propsSelectedDate.to, props.format)
                } : DatePickerHelper.formatDate(propsSelectedDate, props.format);
            }
        }
        this.createDataDate(this.minDate, this.maxDate, props.minuteArray, props.rangeHour);
        this.selectedIndexDate();
    }

    createDataDate(minDate, maxDate, minuteArray, rangeHour) {
        this.minDay = 1;
        this.minMonth = 1;
        this.minYear = 1970;

        this.maxDay = 31;
        this.maxMonth = 12;
        this.maxYear = 2100;
        if (minDate) {
            this.minDay = minDate.getDate();
            this.minMonth = minDate.getMonth() + 1;
            this.minYear = minDate.getFullYear();
        }
        if (maxDate) {
            this.maxDay = maxDate.getDate();
            this.maxMonth = maxDate.getMonth() + 1;
            this.maxYear = maxDate.getFullYear();
        }
        this.days = DatePickerHelper.makeRange(1, 31);
        this.months = DatePickerHelper.makeRange(1, 12);
        this.years = DatePickerHelper.makeRange(this.minYear, this.maxYear);
        this.hours = DatePickerHelper.makeRange(0, 23, true);
        if (Array.isArray(minuteArray)) {
            this.minutes = minuteArray;
        } else {
            this.minutes = DatePickerHelper.makeRange(0, 59, true);
        }
        this.ranged = rangeHour || DatePickerHelper.arrayRange;
    }

    selectedIndexDate() {
        const { format, isRanged } = this.props;
        let current = new Date();
        if (this.minDate && current.getTime() < this.minDate.getTime()) {
            current = this.minDate;
        } else if (this.maxDate && current.getTime() > this.maxDate.getTime()) {
            current = this.maxDate;
        }
        if (format === 'hh:mm' && isRanged) {
            const valueHours_1 = this.selectedDate?.from ? `${getStrings(this.selectedDate?.from?.getHours()?.toString())}:${getStrings(this.selectedDate?.from?.getMinutes()?.toString())}` : '00:00';
            const valueHours_2 = this.selectedDate?.to ? `${getStrings(this.selectedDate?.to?.getHours()?.toString())}:${getStrings(this.selectedDate?.to?.getMinutes()?.toString())}` : '00:00';
            this.hourRangeIndex_1 = valueHours_1
                ? this.ranged.indexOf(valueHours_1)
                : this.ranged.indexOf(`${current.getHours().toString()}:${current.getMinutes().toString()}`);

            this.hourRangeIndex_2 = valueHours_2
                ? this.ranged.indexOf(valueHours_2)
                : this.ranged.indexOf(`${current.getHours().toString()}:${current.getMinutes().toString()}`);
            return;
        }
        this.dayIndex = this.selectedDate
            ? this.days.indexOf(this.selectedDate.getDate().toString())
            : this.days.indexOf(current.getDate().toString());

        this.monthIndex = this.selectedDate
            ? this.months.indexOf((this.selectedDate.getMonth() + 1).toString())
            : this.months.indexOf((current.getMonth() + 1).toString());

        this.yearIndex = this.selectedDate
            ? this.years.indexOf(this.selectedDate.getFullYear().toString())
            : this.years.indexOf(current.getFullYear().toString());

        if (format === 'hh:mm' && !isRanged) {
            const valueHours = this.selectedDate ? this.selectedDate?.getHours()?.toString()?.length === 1 ? `0${this.selectedDate.getHours().toString()}` : this.selectedDate?.getHours()?.toString() || '' : '';
            const valueMinute = this.selectedDate ? this.selectedDate?.getMinutes()?.toString()?.length === 1 ? `0${this.selectedDate.getMinutes().toString()}` : this.selectedDate?.getMinutes()?.toString() || '' : '';
            
            this.hourIndex = this.selectedDate
                ? this.hours.indexOf(valueHours)
                : this.hours.indexOf(current.getHours().toString().length === 1 ? `0${current.getHours().toString()}` : current.getHours().toString());

            this.minuteIndex = this.selectedDate
                ? this.minutes.indexOf(valueMinute)
                : this.minutes.indexOf(current.getMinutes().toString().length === 1 ? `0${current.getMinutes().toString()}` : current.getMinutes().toString());
        }
    }

    onBeginDrag = (refName) => {
        // eslint-disable-next-line no-restricted-syntax
        for (const i in this.arrayRef) {
            if (i && i !== refName && this.arrayRef && this.arrayRef[i] && this.arrayRef[i].update) {
                this.arrayRef[i].setScrollEnabled(false);
            }
        }
    }

    onEndDrag = (refName) => {
        // eslint-disable-next-line no-restricted-syntax
        for (const i in this.arrayRef) {
            if (i && i !== refName && this.arrayRef && this.arrayRef[i] && this.arrayRef[i].update) {
                this.arrayRef[i].setScrollEnabled(true);
            }
        }
    }

    show = () => {

    }

    hide = () => {
        const { onClose, requestClose } = this.props;
        if (requestClose && typeof requestClose === 'function') {
            requestClose(() => {
                if (onClose && typeof onClose === 'function') {
                    onClose();
                }
            });
        }
    }

    finish = () => {
        const {
            format, onSelected, isRanged, selectedDate
        } = this.props;
        if (isRanged && format === 'hh:mm') {
            const from = this.ranged[this.hourRangeIndex_1];
            const to = this.ranged[this.hourRangeIndex_2];
            if (onSelected && typeof onSelected === 'function') {
                onSelected({ from, to });
            }
            this.hide();
            return;
        }
        const day = this.days[this.dayIndex];
        const month = this.months[this.monthIndex];
        const year = this.years[this.yearIndex];
        const hour = this.hours[this.hourIndex] || '00';
        const minute = this.minutes[this.minuteIndex] || '00';
        const selectedDateFormatted = DatePickerHelper.toString(day, month, year, hour, minute, format);
        if (onSelected && typeof onSelected === 'function') {
            onSelected(selectedDateFormatted || selectedDate || DatePickerHelper.getCurrentDate(format));
        }
        this.hide();
    }

    renderUpdate(param) {
        if (param && param.day != null) {
            this.dayIndex = param.day;
            this.updateWheelPiker('DayView', {
                arrayValue: this.days,
                value: param.day
            });
        }

        if (param && param.month != null) {
            this.monthIndex = param.month;
            this.updateWheelPiker('MonthView', {
                arrayValue: this.months,
                value: param.month
            });
        }

        if (param && param.year != null) {
            this.yearIndex = param.year;
            this.updateWheelPiker('YearView', {
                arrayValue: this.years,
                value: param.year
            });
        }

        if (param && param.hour != null) {
            this.hourIndex = param.hour;
            this.updateWheelPiker('HourView', {
                arrayValue: this.hours,
                value: param.hour
            });
        }

        if (param && param.minute != null) {
            this.minuteIndex = param.minute;
            this.updateWheelPiker('MinuteView', {
                arrayValue: this.minutes,
                value: param.minute
            });
        }

        if (param && param.hourRange_1 != null) {
            this.hourRangeIndex_1 = param.hourRange_1;
            this.updateWheelPiker('HourRange1', {
                arrayValue: this.ranged,
                value: param.hourRange_1
            });
        }

        if (param && param.hourRange_2 != null) {
            this.hourRangeIndex_2 = param.hourRange_2;
            this.updateWheelPiker('HourRange2', {
                arrayValue: this.ranged,
                value: param.hourRange_2
            });
        }
    }

    setStateDate(dayIndex, monthIndex, yearIndex) {
        const day = parseInt(this.days[dayIndex]);
        const month = parseInt(this.months[monthIndex]);
        const year = parseInt(this.years[yearIndex]);

        let isUpDate = false;
        let minDay = 1;
        let maxDay = DatePickerHelper.getMaxDate(month, year);

        if (this.maxDay && year === this.maxYear && this.maxMonth === month) {
            maxDay = this.maxDay;
        }

        if (this.minDay && year === this.minYear && this.minMonth === month) {
            minDay = this.minDay;
        }

        if (maxDay !== this.days?.length || minDay !== parseInt(this.days[0])) {
            isUpDate = true;
        }

        let index = dayIndex;

        if (isUpDate) {
            this.days = DatePickerHelper.makeRange(minDay, maxDay);
            index = day > maxDay ? this.days?.length - 1 : (day < minDay ? 0 : this.days.indexOf(day.toString()));
        }

        this.renderUpdate({
            day: index,
            month: monthIndex,
            year: yearIndex
        });
    }

    setStateMonth(dayIndex, monthIndex, yearIndex) {
        const month = parseInt(this.months[monthIndex]);
        const year = parseInt(this.years[yearIndex]);

        let isUpDate = false;
        let minMonth = 1;
        let maxMonth = 12;

        if (this.maxMonth && year === this.maxYear) {
            maxMonth = this.maxMonth;
        }
        if (this.minMonth && year === this.minYear) {
            minMonth = this.minMonth;
        }
        if (maxMonth !== this.months?.length || minMonth !== parseInt(this.months[0])) {
            isUpDate = true;
        }
        let index = monthIndex;
        if (isUpDate) {
            this.months = DatePickerHelper.makeRange(minMonth, maxMonth);
            index = month > maxMonth
                ? this.months?.length - 1
                : (month < minMonth ? 0 : this.months?.indexOf(month.toString()));
        }
        this.setStateDate(dayIndex, index, yearIndex);
    }

    updateWheelPiker(refName, param) {
        let refWheelPicker;
        if (this.arrayRef) {
            refWheelPicker = this.arrayRef[refName];
            if (refWheelPicker && refWheelPicker.update) {
                this.arrayRef[refName].update(param);
            }
        }
    }

    renderColumn(refName, valueInput, arrayValue, label, bottomOffset, callback, reversePreFix) {
        if (!this.arrayRef) {
            this.arrayRef = {};
        }
        return (
            <WheelPicker
                bottomOffset={bottomOffset}
                key={refName}
                refName={refName}
                ref={(ref) => {
                    this.arrayRef[refName] = ref;
                }}
                value={valueInput}
                arrayValue={arrayValue}
                reversePreFix={reversePreFix}
                preFix={label}
                onBeginDrag={this.onBeginDrag}
                onEndDrag={this.onEndDrag}
                onValueChange={(value) => {
                    if (callback) {
                        callback(value);
                    }
                }}
            />
        );
    }

    renderHeader() {
        const {
            title, placeholder, body, buttonTitle, onButtonPress, headerStyle, iconClosePosition = 'right', iconType
        } = this.props;
        return (
            <BottomPopupHeader
                iconType={iconType}
                iconClosePosition={iconClosePosition}
                body={body}
                onClose={this.hide}
                title={title || placeholder}
                buttonTitle={buttonTitle}
                onButtonPress={onButtonPress}
                style={[styles.header, headerStyle]}
            />
        );
        // return (
        //     <View style={styles.header}>
        //         <TouchableOpacity
        //             onPress={this.hide}
        //         >
        //             <Text style={styles.titleCancel}>
        //                 {titleCancel}
        //             </Text>
        //         </TouchableOpacity>
        //         <Text style={styles.title}>
        //             {title || placeholder}
        //         </Text>
        //         <TouchableOpacity onPress={this.finish}>
        //             <Text style={styles.titleConfirm}>
        //                 {titleConfirm}

        //             </Text>
        //         </TouchableOpacity>
        //     </View>
        // );
    }

    renderDescription = () => {
        const { description, descriptionStyle, renderDescription } = this.props;
        if (renderDescription) return renderDescription;
        return description ? (
            <Text.Title style={[{ marginBottom: Spacing.S }, descriptionStyle]}>{description}</Text.Title>
        ) : null;
    };

    renderContent() {
        const {
            format, labelDay, labelMonth, labelYear, bottomOffset, labelMinute, labelHour, isRanged
        } = this.props;
        if (isRanged && format === 'hh:mm') {
            return (
                <View style={styles.container}>
                    {this.renderDescription()}
                    <View style={styles.content}>
                        {this.renderColumn('HourRange1', this.hourRangeIndex_1, this.ranged, SwitchLanguage.from, bottomOffset, (value) => {
                            this.renderUpdate({ hourRange_1: value });
                        }, true)}
                        {this.renderColumn('HourRange2', this.hourRangeIndex_2, this.ranged, SwitchLanguage.to, bottomOffset, (value) => {
                            this.renderUpdate({ hourRange_2: value });
                        }, true)}
                    </View>
                </View>
            );
        }
        return (
            <View style={styles.container}>
                {this.renderDescription()}
                <View style={styles.content}>
                    {
                        format.indexOf('dd') !== -1
                            ? this.renderColumn('DayView', this.dayIndex, this.days, labelDay || SwitchLanguage.day, bottomOffset, (value) => {
                                this.renderUpdate({ day: value });
                            })
                            : null
                    }
                    {
                        format.indexOf('MM') !== -1
                            ? this.renderColumn('MonthView', this.monthIndex, this.months, labelMonth || SwitchLanguage.month, bottomOffset, (value) => {
                                this.setStateDate(this.dayIndex, value, this.yearIndex);
                            })
                            : null
                    }
                    {
                        format.indexOf('YYYY') !== -1
                            ? this.renderColumn('YearView', this.yearIndex, this.years, labelYear || SwitchLanguage.year, bottomOffset, (value) => {
                                this.setStateMonth(this.dayIndex, this.monthIndex, value);
                            })
                            : null
                    }
                    {
                        format.indexOf('hh') !== -1
                            ? this.renderColumn('HourView', this.hourIndex, this.hours, labelHour || SwitchLanguage.hour, bottomOffset, (value) => {
                                this.renderUpdate({ hour: value });
                            }, true)
                            : null
                    }
                    {
                        format.indexOf('mm') !== -1
                            ? this.renderColumn('MinuteView', this.minuteIndex, this.minutes, labelMinute || SwitchLanguage.minute, bottomOffset, (value) => {
                                this.renderUpdate({ minute: value });
                            }, true)
                            : null
                    }
                </View>

            </View>
        );
    }

    renderFooter() {
        const { titleFooter, renderFooter } = this.props;
        return renderFooter ? renderFooter() : (
            <View style={{ paddingHorizontal: 12, marginBottom: ifIphoneX(35, 12), marginTop: 16 }}>
                <Button
                    onPress={this.finish}
                    title={titleFooter || SwitchLanguage.confirm}
                    type="primary"
                />
            </View>

        );
    }

    render() {
        const { style } = this.props;
        return (
            <View style={[styles.view, style]}>
                {this.renderHeader()}
                {this.renderContent()}
                {this.renderFooter()}
            </View>
        );
    }
}

DatePicker.propTypes = {
    selectedDate: PropTypes.any,
    format: PropTypes.string,
    placeholder: PropTypes.string,
    minDate: PropTypes.string,
    maxDate: PropTypes.string,
    titleFooter: PropTypes.string,
    title: PropTypes.string,
    // titleCancel: PropTypes.string,
    // titleConfirm: PropTypes.string,
    labelMonth: PropTypes.string,
    labelHour: PropTypes.string,
    labelMinute: PropTypes.string,
    labelDay: PropTypes.string,
    labelYear: PropTypes.string,
    onSelected: PropTypes.func,
    bottomOffset: PropTypes.number,
    renderDescription: PropTypes.any,
    description: PropTypes.string,
    renderFooter: PropTypes.any,
    style: PropTypes.any,
    rangeHour: PropTypes.array,
    iconClosePosition: PropTypes.oneOf(['left', 'right']),
    iconType: PropTypes.oneOf(['icon', 'text']),
};

DatePicker.defaultProps = {
    format: 'dd/MM/YYYY',
    placeholder: SwitchLanguage.chooseDate,
    minDate: '1/1/1970',
    // titleCancel: SwitchLanguage.cancel,
    // titleConfirm: SwitchLanguage.done,
    // labelMonth: SwitchLanguage.month,
    // labelDay: SwitchLanguage.day,
    // labelYear: SwitchLanguage.year,
    // labelHour: SwitchLanguage.hour,
    // labelMinute: SwitchLanguage.minute,
    bottomOffset: 0,
};

export default DatePicker;


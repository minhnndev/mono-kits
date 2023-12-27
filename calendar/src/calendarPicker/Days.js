import React, { Component, } from 'react';
import { View, } from 'react-native';
import styles from './styles';
import { getDaysInMonth, MAX_COLUMNS, MAX_ROWS, } from './util';
import Day from './Day';

export default class Days extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedDay: 0,
            selectedMonth: 0,
            selectedYear: 0,
        };
        this.selectedDate = null;
    }

    componentDidMount() {
        const { selectedDate } = this.props;
        if (selectedDate) {
            const temp = selectedDate;
            if (typeof temp.getDate === 'function') {
                this.selectedDate = temp;
            } else {
                this.selectedDate = new Date(temp);
            }
            this.updateSelectedStates(
                this.selectedDate.getDate(),
                this.selectedDate.getMonth(),
                this.selectedDate.getFullYear(),
            );
        }
    }

    updateSelectedStates = (day, month, year) => {
        const { onDayChange } = this.props;
        // const monthTmp = month + 1;
        this.setState({
            selectedDay: day,
            selectedMonth: month,
            selectedYear: year,
        });
        if (onDayChange) {
            onDayChange(day, month, year);
        }
    }

    onPressDay = (day, month, year) => {
        const { minDate, maxDate } = this.props;
        const selectDate = new Date(year, month, day);
        selectDate.setHours(0, 0, 0, 0);
        if (minDate) {
            minDate.setHours(0, 0, 0, 0);
            if (selectDate < minDate) {
                return;
            }
        }

        if (maxDate) {
            maxDate.setHours(0, 0, 0, 0);
            if (selectDate > maxDate) {
                return;
            }
        }
        this.updateSelectedStates(day, month, year);
    }

    getCalendarDays = () => {
        const {
            month, year, mode, minDate, maxDate, firstDate, secondDate, tabSelected
        } = this.props;
        const { selectedMonth, selectedDay, selectedYear } = this.state;
        let columns;
        const matrix = [];
        let i;
        let j;
        let currentDay = 0;
        const thisMonthFirstDay = new Date(year, month, 1);
        let slotsAccumulator = 1;

        let goNextMonth = false;
        for (i = 0; i < MAX_ROWS; i += 1) { // Week rows
            columns = [];
            if (goNextMonth) { break; }
            for (j = 0; j < MAX_COLUMNS; j += 1) { // Day columns
                // HungHC: getDay() Sunday is 0, Monday is 1, and so on.
                let tmp = thisMonthFirstDay.getDay();
                if (tmp === 0) { tmp = 7; }
                if (slotsAccumulator >= tmp) {
                    if (currentDay < getDaysInMonth(month, year)) {
                        const day = currentDay + 1;
                        const selected = (selectedDay === day
                        && selectedMonth === month
                        && selectedYear === year);
                        const date = Date(year, month, day);

                        columns.push(<Day
                            mode={mode}
                            key={j.toString()}
                            column={j}
                            day={day}
                            month={month}
                            year={year}
                            selected={selected}
                            date={date}
                            minDate={minDate}
                            maxDate={maxDate}
                            firstDate={firstDate}
                            secondDate={secondDate}
                            tabSelected={tabSelected}

                            otherMonth={false}
                            onDayChange={this.onPressDay}
                        />);
                        currentDay += 1;
                    } else {
                        // HungHC: show next month
                        goNextMonth = true;
                        if (j === 0) {
                            break;
                        }

                        let nextMonth = month + 1;
                        const day = currentDay + 1 - getDaysInMonth(month, year);
                        let yearTmp = year;
                        if (nextMonth > 11) {
                            nextMonth = 0;
                            yearTmp = year + 1;
                        }
                        const date = Date(yearTmp, nextMonth, day);
                        const selected = (selectedDay === day
                        && selectedMonth === nextMonth
                        && selectedYear === yearTmp);
                        columns.push(<Day
                            mode={mode}
                            key={j.toString()}
                            column={j}
                            day={day}
                            month={nextMonth}
                            year={yearTmp}
                            selected={selected}
                            date={date}
                            minDate={minDate}
                            maxDate={maxDate}
                            firstDate={firstDate}
                            secondDate={secondDate}
                            tabSelected={tabSelected}
                            otherMonth
                            onDayChange={this.onPressDay}
                        />);
                        currentDay += 1;
                    }
                } else {
                    // HungHC: show prev month
                    let prevMonth = month - 1;
                    let yearTmp = year;
                    if (prevMonth < 0) {
                        prevMonth = 11;
                        yearTmp = year - 1;
                    }
                    const daysPrev = getDaysInMonth(prevMonth, yearTmp);
                    let tmpDay = thisMonthFirstDay.getDay();
                    if (tmpDay === 0) { tmpDay = 7; }
                    const delta = (slotsAccumulator - tmpDay + 1);
                    const day = daysPrev + delta;

                    const selected = (selectedDay === day
                    && selectedMonth === prevMonth
                    && selectedYear === yearTmp);

                    const date = Date(yearTmp, prevMonth, day);
                    columns.push(<Day
                        mode={mode}
                        key={j.toString()}
                        column={j}
                        day={day}
                        month={prevMonth}
                        year={yearTmp}
                        selected={selected}
                        date={date}
                        minDate={minDate}
                        maxDate={maxDate}
                        firstDate={firstDate}
                        secondDate={secondDate}
                        tabSelected={tabSelected}
                        otherMonth
                        onDayChange={this.onPressDay}
                    />);
                }

                slotsAccumulator += 1;
            }
            matrix[i] = [];
            matrix[i].push(<View key={i.toString()} style={styles.weekRow}>{columns}</View>);
        }

        return matrix;
    }

    render() {
        return <View style={styles.daysWrapper}>{ this.getCalendarDays()}</View>;
    }
}

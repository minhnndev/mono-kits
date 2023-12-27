/* eslint-disable react/no-typos */
import React, { Component, } from 'react';
import { View, } from 'react-native';
import PropTypes from 'prop-types';
import styles from './styles';
import HeaderControls from './HeaderControls';
import Days from './Days';
import WeekDaysLabels from './WeekDaysLabels';

class CalendarPicker extends Component {
    constructor(props) {
        super(props);

        this.selectedDate = null;
        const temp = props.selectedDate;
        try {
            if (typeof temp.getDate === 'function') {
                this.selectedDate = temp;
            } else {
                this.selectedDate = new Date(temp);
            }
        } catch (e) {
            this.selectedDate = new Date();
        }
        this.state = {
            // date: this.selectedDate,
            month: this.selectedDate.getMonth(),
            day: this.selectedDate.getDate(),
            year: this.selectedDate.getFullYear(),
            // selectedDay: [],
            tabSelected: 0,
        };
    }

    onDayChange = (day, month, year) => {
        const { onDateChange } = this.props;
        const date = new Date(year, month, day);
        if (onDateChange) { onDateChange(date); }
        if (this.refs.header) { this.refs.header.setMonth(month); }
        this.setState({
            year,
            month,
            day,
        });
    }

    onMonthYearChange = (month, year) => {
        this.setState({
            month,
            year
        });
    }

    onMonthChange = (month) => {
        this.setState({ month, });
    }


    getNextYear = () => {
        const { year } = this.state;
        this.setState({ year: parseInt(year) + 1, });
    }

    getPrevYear =() => {
        const { year } = this.state;
        this.setState({ year: parseInt(year) - 1, });
    }

    setDoubleDateAndTabIndex = (first, second, tabSelected) => {
        this.setState({
            firstDate: first,
            secondDate: second,
            tabSelected
        });
    }

    render() {
        const {
            day, year, month, firstDate, secondDate, tabSelected
        } = this.state;
        const {
            minDate, maxDate, mode, navigator
        } = this.props;
        return (
            <View style={styles.calendar}>
                <HeaderControls
                    ref="header"
                    year={year}
                    month={month}
                    navigator={navigator}
                    onMonthYearChange={this.onMonthYearChange}
                    onMonthChange={this.onMonthChange}
                    getNextYear={this.getNextYear}
                    getPrevYear={this.getPrevYear}
                    minDate={minDate || null}
                />
                <WeekDaysLabels />

                <Days
                    mode={mode}
                    firstDate={firstDate}
                    secondDate={secondDate}
                    tabSelected={tabSelected}
                    month={month}
                    year={year}
                    day={day}
                    minDate={minDate || new Date()}
                    maxDate={maxDate}
                    selectedDate={this.selectedDate}
                    onDayChange={this.onDayChange}
                />
            </View>
        );
    }
}
export default CalendarPicker;

CalendarPicker.propTypes = {
    navigator: PropTypes.object.isRequired,
    minDate: PropTypes.any,
    maxDate: PropTypes.any,
    mode: PropTypes.oneOf(['doubleDate', 'signleDate']),
    selectedDate: PropTypes.any,
    onDateChange: PropTypes.func,
};

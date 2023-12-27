/* eslint-disable no-param-reassign */
import React, { Component, } from 'react';
import {
    Text, TouchableOpacity, View
} from 'react-native';
import PropTypes from 'prop-types';
import { IconSource, Image } from '@momo-kits/core';
import { DatePicker } from '@momo-kits/date-picker';
import styles from './styles';
import { MONTHS } from './util';

const padding = (input) => `${input > 9 ? input : `0${input}`}`;

const formatDate = (date) => {
    if (date && typeof date.getDate === 'function') {
        return `${padding(date.getMonth() + 1)}/${(date.getFullYear()).toString()}`;
    }
    return null;
};

const makeRange = (min = 0, max = 9999, step = 1) => {
    const range = [];
    let entry = `${0}`;

    for (min; min <= max; min += step) {
        entry = `${min}`;
        range.push(entry);
    }

    return range;
};
export default class HeaderControls extends Component {
    constructor(props) {
        super(props);
        const { month } = this.props;
        this.state = {
            selectedMonth: month
        };

        const minYear = 1900 + (new Date()).getYear();
        const maxYear = minYear + 5;
        this.months = makeRange(1, 12);
        this.years = makeRange(minYear, maxYear);
        this.momoDatePicker = React.createRef();
    }

    setMonth = (month) => {
        this.setState({
            selectedMonth: month,
        });
    }

    getNext = () => {
        const { selectedMonth } = this.state;
        const { getNextYear, onMonthChange } = this.props;
        let next = selectedMonth + 1;
        if (next > 11) {
            next = 0;
            this.setState({ selectedMonth: next });
            getNextYear();
        } else {
            this.setState({ selectedMonth: next });
        }

        onMonthChange(next);
    }

    getPrevious = () => {
        const { selectedMonth } = this.state;
        const {
            onMonthChange, year, minDate, getPrevYear
        } = this.props;

        let prev = selectedMonth - 1;
        if (prev < 0) {
            prev = 11;
            this.setState({ selectedMonth: prev });
            getPrevYear();
            onMonthChange(prev);
        } else if (year <= minDate.getFullYear() && prev < minDate.getMonth()) {
            return null;
        } else {
            this.setState({ selectedMonth: prev });
            onMonthChange(prev);
        }
    }

    pickMonthYear = () => {
        const { navigator, minDate, maxDate } = this.props;
        navigator.showBottom({
            screen: DatePicker,
            params: {
                dragDisabled: true,
                onSelected: this.onMonthYearChange,
                onClose: () => { },
                selectedDate: formatDate(minDate),
                minDate: formatDate(minDate),
                maxDate: formatDate(maxDate),
                format: 'MM/YYYY',
            }
        });
    };

    onMonthYearChange = (date) => {
        const { onMonthYearChange } = this.props;
        const splitDate = date.split('/');
        const idM = +splitDate[0];
        const idY = +splitDate[1];
        this.setState({
            selectedMonth: idM - 1
        });
        if (onMonthYearChange) {
            onMonthYearChange(idM - 1, idY);
        }
    }

    render() {
        const { selectedMonth } = this.state;
        const { year, minDate } = this.props;
        const previous = selectedMonth - 1 < 0 ? 11 : selectedMonth - 1;
        const opacity = (previous < minDate.getMonth() && minDate.getFullYear() === year) ? 0.2 : 1;
        // const monthNow = (new Date()).getMonth() + 1;
        // const yearNow = (new Date()).getYear() + 1900;
        return (
            <View style={styles.headerWrapper}>

                <TouchableOpacity onPress={() => this.getPrevious()} style={{ paddingHorizontal: 20, }}>
                    <Image style={{ width: 20, height: 20, opacity }} source={IconSource.ic_back_arrow} />
                </TouchableOpacity>

                <TouchableOpacity onPress={this.pickMonthYear}>
                    <Text style={styles.monthLabel}>
                        { MONTHS[selectedMonth] }
                        /
                        { year }
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => this.getNext()} style={{ paddingHorizontal: 20, }}>
                    <Image style={{ width: 20, height: 20, }} source={IconSource.ic_arrow_next} />
                </TouchableOpacity>
            </View>
        );
    }
}

HeaderControls.propTypes = {
    getNextYear: PropTypes.func,
    onMonthChange: PropTypes.func,
    onMonthYearChange: PropTypes.func,
    getPrevYear: PropTypes.func,
    year: PropTypes.number,
    minDate: PropTypes.any,
};

HeaderControls.defaultProps = {

};

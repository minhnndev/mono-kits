import React, { Component, } from 'react';
import { TouchableOpacity, View } from 'react-native';
import PropTypes from 'prop-types';
import { Text } from '@momo-kits/core';
import styles from './styles';

export default class Day extends Component {
    processMinDate() {
        const { minDate } = this.props;
        if (minDate) {
            minDate.setHours(0, 0, 0, 0);
            if (this.date < minDate) {
                this.disableTouch = true;
            }
        }
    }

    processMaxDate() {
        const { maxDate } = this.props;
        if (maxDate) {
            maxDate.setHours(0, 0, 0, 0);
            if (this.date > maxDate) {
                this.disableTouch = true;
            }
        }
    }

    processDoubleDate() {
        const {
            mode, otherMonth, firstDate, secondDate, tabSelected
        } = this.props;
        const { date } = this;
        if (mode === 'doubleDate' && !otherMonth) {
            if (firstDate && tabSelected === 1) {
                firstDate.setHours(0, 0, 0, 0);
                if (date < firstDate) {
                    this.disableTouch = true;
                    this.styleDouble = {};
                } else if (date.getTime() === firstDate.getTime()) {
                    this.colorCanTouch = '#2eb3e8';
                    this.colorText = 'white';
                    this.styleDouble = {};
                }
            }
            if (secondDate && firstDate) {
                secondDate.setHours(0, 0, 0, 0);
                if (date > firstDate && date < secondDate) {
                    this.colorCanTouch = '#90d6f3';

                    this.styleDouble = styles.styleBetween;

                    this.colorText = 'white';
                }
                if (secondDate.getTime() !== firstDate.getTime()) {
                    if (date.getTime() === firstDate.getTime()) {
                        this.colorCanTouch = '#2eb3e8';
                        this.colorText = 'white';
                        this.styleDouble = styles.styleFirstDate;
                    }
                    if (date.getTime() === secondDate.getTime()) {
                        this.styleDouble = styles.styleSecondDate;
                        this.colorCanTouch = '#2eb3e8';
                        this.colorText = 'white';
                    }
                }
            }
        }
    }

    processSelected() {
        const { selected } = this.props;
        if (selected && !this.disableTouch) {
            this.colorCanTouch = '#2eb3e8';
            this.colorText = 'white';
        }
    }

    processDateNow() {
        const { selected } = this.props;
        if (!selected && this.date.getTime() === this.dateNow.getTime()) {
            this.colorCanTouch = '#8F8E94';
            this.colorText = 'white';
        }
    }

    processOtherMonth() {
        const { otherMonth } = this.props;
        if (otherMonth) {
            this.colorTextDisable = 'white';
        }
    }

    processRender() {
        this.processMinDate();
        this.processMaxDate();
        // this.processDateNow()
        this.processDoubleDate();
        this.processSelected();
        this.processOtherMonth();
    }

    render() {
        const {
            day, month, year, otherMonth, onDayChange
        } = this.props;
        this.colorCanTouch = 'white';
        this.colorText = '#393939';
        this.colorTextDisable = '#DADADA';
        this.styleDouble = {};
        this.disableTouch = false;
        this.dateNow = new Date();
        this.dateNow.setHours(0, 0, 0, 0);
        this.date = new Date(year, month, day);
        this.date.setHours(0, 0, 0, 0);
        this.processRender();
        return (

            <View style={styles.dayWrapper}>
                <View style={this.styleDouble} />
                {
                    this.disableTouch || otherMonth
                        ? (
                            <View style={styles.dayButton}>
                                <Text.Title style={[styles.dayLabel, { color: this.colorTextDisable }]}>
                                    {day}
                                </Text.Title>
                            </View>
                        )
                        : (
                            <View style={[styles.dayButtonSelected, { backgroundColor: this.colorCanTouch }]}>
                                <TouchableOpacity
                                    style={styles.dayButton}
                                    onPress={() => onDayChange(day, month, year)}
                                >
                                    <Text.Title style={[styles.dayLabel, { color: this.colorText }]}>
                                        {day}
                                    </Text.Title>
                                </TouchableOpacity>

                            </View>
                        )

                }
            </View>
        );
    }
}
Day.propTypes = {
    day: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    month: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    year: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    otherMonth: PropTypes.bool,
    onDayChange: PropTypes.func,
};

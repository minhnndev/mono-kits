import React, {Component} from 'react';
import PropTypes from 'prop-types';

import {View, TouchableHighlight, Text} from 'react-native';
import {Colors, SwitchLanguage} from '@momo-kits/core';
import style from './style';

class Day extends Component {
  constructor(props) {
    super(props);
    this.statusCheck();
  }

  chooseDay = () => {
    const {onChoose, date} = this.props;
    onChoose && onChoose(date);
  };

  findHoliday = (date, holidays) => {
    if (date && holidays && holidays.length > 0) {
      const day = date.date();
      const month = date.month() + 1;
      return holidays.find(item => item.day === day && item.month === month);
    }
    return null;
  };

  checkHoliday = (date, holidays) => {
    const holiday = this.findHoliday(date, holidays);
    return {
      solarHoliday: !!(holiday && !holiday.lunar),
      lunarHoliday: !!(holiday && holiday.lunar),
    };
  };

  statusCheck = props => {
    const {
      startDate,
      endDate,
      date = null,
      minDate,
      maxDate,
      empty,
      index,
      isShowLunar,
      tabSelected,
      isDoubleDateMode,
      lunarDate,
      isSolarHoliday,
      isLunarHoliday,
      price,
    } = props || this.props;
    this.isValid =
      date &&
      (date >= minDate || date.isSame(minDate, 'day')) &&
      (date <= maxDate || date.isSame(maxDate, 'day'));
    this.isMid =
      (isDoubleDateMode && date > startDate && date < endDate) ||
      (!date && empty >= startDate && empty <= endDate);
    this.isStart = date && date.isSame(startDate, 'd');
    this.isStartPart = this.isStart && endDate;
    this.isEnd = isDoubleDateMode && date && date.isSame(endDate, 'day');
    this.isFocus = this.isMid || this.isStart || this.isEnd;
    this.isWeekEnd = index === 6 || index === 5;
    this.showLunar = isShowLunar;
    this.lunarDate = lunarDate;
    this.isDoubleDateMode = isDoubleDateMode;
    this.isLunarHoliday = isLunarHoliday;
    this.isLunarDayStart = this.lunarDate && this.lunarDate.lunarDay === 1;
    this.isSolarHoliday = isSolarHoliday;
    this.isInScope = isDoubleDateMode
      ? tabSelected === 0 ||
        (tabSelected === 1 &&
          startDate &&
          date &&
          date.isSameOrAfter(startDate, 'day'))
      : true;
    return this.isFocus || this.diffPrice;
  };

  shouldComponentUpdate(nextProps) {
    const {
      isDoubleDateMode,
      isShowLunar,
      tabSelected,
      isSolarHoliday,
      isLunarHoliday,
      price,
      isBestPrice,
      startDate,
      endDate,
    } = this.props;
    const prevStatus = this.isFocus;
    const selectionModeChange = isDoubleDateMode !== nextProps.isDoubleDateMode;
    const lunarChange = isShowLunar !== nextProps.isShowLunar;
    const nextStatus = this.statusCheck(nextProps);
    const tabChange = tabSelected !== nextProps.tabSelected;
    const solarHoliday = isSolarHoliday !== nextProps.isSolarHoliday;
    const lunarHoliday = isLunarHoliday !== nextProps.isLunarHoliday;
    const diffPrice =
      price !== nextProps.price && isBestPrice !== nextProps.isBestPrice;
    const startDateChange =
      startDate && !startDate?.isSame?.(nextProps.startDate, 'day');
    const endDateChange =
      endDate && !endDate?.isSame?.(nextProps.endDate, 'day');
    return !!(
      prevStatus !== nextStatus ||
      selectionModeChange ||
      lunarChange ||
      tabChange ||
      solarHoliday ||
      lunarHoliday ||
      diffPrice ||
      startDateChange ||
      endDateChange
    );
  }

  render() {
    const {
      date,
      empty,
      isDoubleDateMode,
      price,
      isBestPrice,
      isShowPrice,
      labelFrom,
      labelTo,
      isHideLabel,
    } = this.props;
    const text = date ? date.date() : '';
    return (
      <View style={style.dayContainer}>
        <View
          style={[
            this.isMid && !empty && style.mid,
            this.isStartPart && style.dayStartContainer,
            this.isEnd && style.dayEndContainer,
          ]}>
          {this.isValid && this.isInScope ? (
            <TouchableHighlight
              style={[style.day, (this.isStart || this.isEnd) && style.focused]}
              underlayColor="rgba(255, 255, 255, 0.35)"
              onPress={this.chooseDay}>
              <>
                <Text
                  style={[
                    style.dayText,
                    this.isWeekEnd && style.weekendDay,
                    this.isSolarHoliday && style.weekendDay,
                    (this.isStart || this.isEnd) && style.focusedText,
                  ]}>
                  {text}
                </Text>
                {this.lunarDate && this.showLunar && (
                  <Text
                    style={[
                      style.lunarDayText,
                      (this.isLunarHoliday || this.isLunarDayStart) &&
                        style.weekendDay,
                      (this.isStart || this.isEnd) && style.focusedText,
                    ]}>
                    {this.lunarDate.lunarDay === 1
                      ? `${this.lunarDate.lunarDay}/${this.lunarDate.lunarMonth}`
                      : this.lunarDate.lunarDay}
                  </Text>
                )}
              </>
            </TouchableHighlight>
          ) : (
            <View style={[style.day]}>
              <Text style={[style.dayText, style.dayTextDisabled]}>{text}</Text>
              {this.lunarDate && this.showLunar && text ? (
                <Text style={[style.lunarDayText, style.dayTextDisabled]}>
                  {this.lunarDate.lunarDay === 1
                    ? `${this.lunarDate.lunarDay}/${this.lunarDate.lunarMonth}`
                    : this.lunarDate.lunarDay}
                </Text>
              ) : (
                <View />
              )}
            </View>
          )}
        </View>

        {isDoubleDateMode && this.isStart && !isHideLabel && (
          <View style={style.txtGo}>
            <Text style={{fontSize: 8, color: 'white'}}>
              {labelFrom || SwitchLanguage.departing}
            </Text>
          </View>
        )}
        {isDoubleDateMode && this.isEnd && !isHideLabel && (
          <View style={style.txtBack}>
            <Text style={{fontSize: 8, color: 'white'}}>
              {labelTo || SwitchLanguage.returning}
            </Text>
          </View>
        )}
        {this.isValid && this.isInScope && !!price && (
          <Text style={[style.price, isBestPrice && {color: Colors.pink_05_b}]}>
            {price}
          </Text>
        )}
      </View>
    );
  }
}

export default Day;

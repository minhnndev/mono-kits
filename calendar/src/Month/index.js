import React, { PureComponent } from 'react';

import {
    View
} from 'react-native';
import moment from 'moment';
import Day from '../Day';

export default class Month extends PureComponent {
    constructor(props) {
        super(props);
        const { dateList } = props;
        this.rowArray = new Array(dateList.length / 7).fill('');
        this.temp = this.rowArray.map((item, i) => dateList.slice(i * 7, i * 7 + 7));
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

    checkHoliday = (date) => {
        const holiday = this.findHoliday(date);
        return {
            isSolarHoliday: !!(holiday && !holiday.lunar),
            isLunarHoliday: !!(holiday && holiday.lunar)
        };
    };

    renderDayRow = (dayList, index) => (
        <View
            style={{
                flexDirection: 'row',
                justifyContent: 'space-between'
            }}
            key={`row${index}`}
        >
            {dayList.map((item, i) => {
                const keyDay = moment(item.date).format('YYYY-MM-DD');
                const priceInfo = this.props?.priceListDate?.[keyDay];
                return (
                    <Day
                        {...this.props}
                        {...this.checkHoliday(item.date)}
                        date={item.date}
                        lunarDate={item.lunarDate}
                        empty={item.empty}
                        key={`day${i.toString()}`}
                        index={i}
                        price={priceInfo?.priceAsString}
                        isBestPrice={priceInfo?.isBestPrice}
                    />
                );
            }
            )}
        </View>
    );

    render() {
        const {
            month
        } = this.props;
        if (month) {
            return (
                <View>
                    <View style={{ paddingHorizontal: 7, paddingVertical: 5 }}>
                        {this.temp.map((item, i) => this.renderDayRow(item, i)
                        )}
                    </View>
                </View>
            );
        }
        return (<View />);
    }
}

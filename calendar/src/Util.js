import moment from 'moment';

import { SwitchLanguage } from '@momo-kits/core';
import LunarDateConverter from './LunarDateConverter';
import holiday from './holidayData';

const I18N_MAP = {
    en: {
        w: ['', 'Mon', 'Tues', 'Wed', 'Thur', 'Fri', 'Sat', 'Sun'],
        weekday: ['', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        text: {
            start: 'Start',
            end: 'End',
            date: 'Date',
            save: 'Save',
            clear: 'Reset'
        },
        date: 'DD / MM'
    },
    vi: {
        w: ['', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'],
        weekday: ['', 'Thứ hai', 'Thứ ba', 'Thứ tư', 'Thứ năm', 'Thứ sáu', 'Thứ bảy', 'Chủ nhật'],
        text: {
            start: 'Start',
            end: 'End',
            date: 'Date',
            save: 'Save',
            clear: 'Reset'
        },
        date: 'DD / MM'
    }
};

const Solar = (momentDate) => ({
    solarDay: momentDate.date(),
    solarMonth: momentDate.month() + 1,
    solarYear: momentDate.year()
});

const formatYYYYMMDD = (dd, mm, yyyy) => `${yyyy}-${mm < 10 ? `0${mm}` : mm}-${dd < 10 ? `0${dd}` : dd}`;

const formatDDMM = (dd, mm) => `${dd < 10 ? `0${dd}` : dd}/${mm < 10 ? `0${mm}` : mm}`;

const groupHolidaysByDate = (holidays) => {
    const groupedHolidays = {};
    if (holidays && holidays.length > 0) {
        holidays.forEach((item) => {
            const {
                day, month, lunar, label
            } = item;
            const key = formatDDMM(day, month);
            let holidaysObj = groupedHolidays[key] ? { ...groupedHolidays[key] } : { ...item };
            if (groupedHolidays[key]) {
                if (holidaysObj.lunar && !lunar) {
                    holidaysObj = {
                        ...holidaysObj,
                        label,
                        mixedLabel: `${label}, ${holidaysObj.label}`
                    };
                } else if (!holidaysObj.lunar && lunar) {
                    holidaysObj = {
                        ...holidaysObj,
                        label: holidaysObj.lunar,
                        mixedLabel: `${holidaysObj.lunar}, ${label}`
                    };
                }
            }
            groupedHolidays[key] = holidaysObj;
        });
    }

    return groupedHolidays;
};

const sortByDate = (arr) => {
    if (arr && arr.length > 1) {
        arr.sort((a, b) => {
            if (a.month > b.month || (a.month === b.month && a.day > b.day)) {
                return 1;
            }
            return -1;
        });
    }

    return groupHolidaysByDate(arr);
};

module.exports = {

    WEEKDAYS: [
        'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN',
    ],

    WEEKDAYSFROMMOMENT: [SwitchLanguage.sun, SwitchLanguage.mon, SwitchLanguage.tue, SwitchLanguage.wed, SwitchLanguage.thu, SwitchLanguage.fri, SwitchLanguage.sat],

    WEEKDAYSNAME: [
        'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'Chủ nhật',
    ],

    MONTHS: [
        'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6', 'Tháng 7',
        'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'
    ],

    MAX_ROWS: 7,

    MAX_COLUMNS: 7,

    mapWeeKDate(i) {
        const date = ['', SwitchLanguage.mon, SwitchLanguage.tue, SwitchLanguage.wed, SwitchLanguage.thu, SwitchLanguage.fri, SwitchLanguage.sat, SwitchLanguage.sun];
        return date[i];
    },

    mapMonth(i) {
        const month = new Map([
            [1, SwitchLanguage.jan],
            [2, SwitchLanguage.feb],
            [3, SwitchLanguage.mar],
            [4, SwitchLanguage.apr],
            [5, SwitchLanguage.may],
            [6, SwitchLanguage.jun],
            [7, SwitchLanguage.jul],
            [8, SwitchLanguage.aug],
            [9, SwitchLanguage.sep],
            [10, SwitchLanguage.oct],
            [11, SwitchLanguage.nov],
            [12, SwitchLanguage.dec],
        ]);
        return month.get(i);
    },

    mapMonthShorten(i) {
        const month = new Map([
            [1, 'Jan'],
            [2, 'Feb'],
            [3, 'Mar'],
            [4, 'Apr'],
            [5, 'May'],
            [6, 'Jun'],
            [7, 'Jul'],
            [8, 'Aug'],
            [9, 'Sep'],
            [10, 'Oct'],
            [11, 'Nov'],
            [12, 'Dec'],
        ]);
        return month.get(i);
    },

    getDaysInMonth(month, year) {
        const lastDayOfMonth = new Date(year, month + 1, 0);
        return lastDayOfMonth.getDate();
    },

    getHolidaysInMonth(headerInfo) {
        if (headerInfo) {
            const today = moment();
            const converter = new LunarDateConverter();
            const startDate = moment(headerInfo).startOf('month');
            const endDate = moment(headerInfo).endOf('month');
            const minLunarDate = converter.SolarToLunar(Solar(startDate));
            const maxLunarDate = converter.SolarToLunar(Solar(endDate));
            const holidays = [];
            const currentYear = minLunarDate.lunarYear !== maxLunarDate.lunarYear ? [minLunarDate.lunarYear, maxLunarDate.lunarYear] : minLunarDate.lunarYear;

            // Handle Solar holidays
            if (holiday.solar[headerInfo.month() + 1]) {
                holiday.solar[headerInfo.month() + 1].forEach((date) => {
                    const dateAsMoment = moment({ year: headerInfo.year(), month: date.month - 1, date: date.day });
                    if (dateAsMoment.isSameOrAfter(today, 'date')) {
                        holidays.push(date);
                    }
                });
            }

            holiday.lunar.forEach((item) => {
                if (currentYear instanceof Array) {
                    const solar1 = converter.LunarToSolar({
                        lunarDay: item.lunarDay,
                        lunarMonth: item.lunarMonth,
                        lunarYear: currentYear[0]
                    });
                    const solar2 = converter.LunarToSolar({
                        lunarDay: item.lunarDay,
                        lunarMonth: item.lunarMonth,
                        lunarYear: currentYear[1]
                    });
                    const solar1AsMoment = moment(formatYYYYMMDD(solar1.solarDay, solar1.solarMonth, solar1.solarYear));
                    const solar2AsMoment = moment(formatYYYYMMDD(solar2.solarDay, solar2.solarMonth, solar2.solarYear));
                    if (solar1AsMoment.isBetween(startDate, endDate) && solar1AsMoment.isSameOrAfter(today, 'date')) {
                        holidays.push({
                            ...item,
                            day: solar1.solarDay,
                            month: solar1.solarMonth
                        });
                    } else if (solar2AsMoment.isBetween(startDate, endDate) && solar2AsMoment.isSameOrAfter(today, 'date')) {
                        holidays.push({
                            ...item,
                            day: solar2.solarDay,
                            month: solar2.solarMonth
                        });
                    }
                } else {
                    const solar = converter.LunarToSolar({
                        lunarDay: item.lunarDay,
                        lunarMonth: item.lunarMonth,
                        lunarYear: currentYear
                    });
                    const solarAsMoment = moment(formatYYYYMMDD(solar.solarDay, solar.solarMonth, solar.solarYear));
                    if (solarAsMoment.isBetween(startDate, endDate) && solarAsMoment.isSameOrAfter(today, 'date')) {
                        holidays.push({
                            ...item,
                            day: solar.solarDay,
                            month: solar.solarMonth
                        });
                    }
                }
            });

            return sortByDate(holidays);
        }
        return [];
    },
    I18N_MAP,
};

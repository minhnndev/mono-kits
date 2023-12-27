/* eslint-disable prefer-template */
/* eslint-disable no-param-reassign */
export default class DatePickerHelper {
    static arrayRange = [
        '00:00',
        '00:30',
        '01:00',
        '01:30',
        '02:00',
        '02:30',
        '03:00',
        '03:30',
        '04:00',
        '04:30',
        '05:00',
        '05:30',
        '06:00',
        '06:30',
        '07:00',
        '07:30',
        '08:00',
        '08:30',
        '09:00',
        '09:30',
        '10:00',
        '10:30',
        '11:00',
        '11:30',
        '12:00',
        '12:30',
        '13:00',
        '13:30',
        '14:00',
        '14:30',
        '15:00',
        '15:30',
        '16:00',
        '16:30',
        '17:00',
        '17:30',
        '18:00',
        '18:30',
        '19:00',
        '19:30',
        '20:00',
        '20:30',
        '21:00',
        '21:30',
        '22:00',
        '22:30',
        '23:00',
        '23:30'
    ];

    static makeRange(min, max, isDouble) {
        const array = [];
        // eslint-disable-next-line no-plusplus
        for (let i = min; i <= max; i++) {
            const string = String(i);
            const value = string.length === 1 && isDouble ? `0${string}` : string;
            array.push(value);
        }
        return array;
    }

    static getCurrentDate(format) {
        if (format) {
            const current = new Date();
            const day = current.getDate().toString();
            const month = (current.getMonth() + 1).toString();
            const year = current.getFullYear().toString();
            return DatePickerHelper.toString(day, month, year, null, null, format);
        }
        return '';
    }

    static formatDate(date, format) {
        if (date && format) {
            const {
                year, month, day, hour, minute, second = 0
            } = DatePickerHelper.getDateTimeFromFormat(date, format);
            if (DatePickerHelper.checkValidDate(year, month, day)
                && DatePickerHelper.checkValidTime(hour, minute, second)) {
                return new Date(year, month, day, hour, minute, second);
            }
            return null;
        }
        return null;
    }

    static getDateTimeFromFormat(date, format) {
        if (date == null || format == null) {
            return {
                year: null,
                month: null,
                day: null,
                hour: null,
                minute: null,
                second: null,
            };
        }
        if (typeof date !== 'string') {
            date = date.toString();
        }
        if (typeof format !== 'string') {
            format = format.toString();
        }
        const normalized = date.replace(/[^a-zA-Z0-9]/g, '-');
        const normalizedFormat = format.replace(/[^a-zA-Z0-9]/g, '-');
        const formatItems = normalizedFormat.split('-');
        const dateItems = normalized.split('-');

        const monthIndex = formatItems.indexOf('MM');
        const dayIndex = formatItems.indexOf('dd');
        const yearIndex = formatItems.indexOf('YYYY');
        const hourIndex = formatItems.indexOf('hh');
        const minutesIndex = formatItems.indexOf('mm');
        const secondsIndex = formatItems.indexOf('ss');

        const today = new Date();

        const year = yearIndex > -1 ? dateItems?.[yearIndex] : today.getFullYear();
        const month = monthIndex > -1 ? dateItems?.[monthIndex] - 1 : today.getMonth() === 0 ? 1 : today.getMonth() - 1;
        const day = dayIndex > -1 ? dateItems?.[dayIndex] : today.getDate();

        const hour = hourIndex > -1 ? dateItems[hourIndex] : 0;
        const minute = minutesIndex > -1 ? dateItems[minutesIndex] : 0;
        const second = secondsIndex > -1 ? dateItems[secondsIndex] : 0;

        return {
            year: year || null,
            month: month >= 0 ? month : null,
            day: day || null,
            hour: hour || null,
            minute: minute || null,
            second: second || null,
        };
    }

    static round = (number) => {
        if (parseInt(number) > 9) {
            return number;
        }
        return `0${number}`;
    }

    static toString(day, month, year, hour, minute, format) {
        if (day && month && year && format) {
            format = format.replace('YYYY', year);
            format = format.replace('MM', this.round(month));
            format = format.replace('dd', this.round(day));
            format = format.replace('hh', hour);
            format = format.replace('mm', minute);
            return format;
        }
        return null;
    }

    static checkValidDate(y, m, d) {
        const year = parseInt(y);
        const month = parseInt(m);
        const day = parseInt(d);
        const months31 = [0, 2, 4, 6, 7, 9, 11];
        const months30 = [3, 5, 8, 10];
        const months28 = [1];
        const isLeap = ((year % 4 === 0) && (year % 100 !== 0)) || (year % 400 === 0);
        if (year != null && month != null && day != null) {
            const isDayValid = day > 0;
            const isMonthValid = (months31.indexOf(parseInt(month)) != -1 && day <= 31)
            || (months30.indexOf(month) != -1 && day <= 30)
            || (months30.indexOf(month) != -1 && day <= 31)
            || (months28.indexOf(month) != -1 && day <= 28)
            || (months28.indexOf(month) != -1 && day <= 29 && isLeap);
            return isDayValid && isMonthValid;
        }
        return false;
    }

    static checkValidTime(hour, minute, second) {
        if ((hour >= 0 && hour < 24) && (minute >= 0 && minute < 60) && (second >= 0 && second < 60)) {
            return true;
        }
        return false;
    }

    static calculateDateSinceYearAgo(yearAgo) {
        let nowDate = new Date();
        nowDate = new Date(nowDate.getFullYear() - yearAgo, nowDate.getMonth(), nowDate.getDate());
        return nowDate;
    }

    static getMaxDate(month = new Date().getMonth(), year = new Date().getFullYear()) {
        const monthLength = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
        // Adjust for leap years
        if (year % 400 === 0 || (year % 100 !== 0 && year % 4 === 0)) {
            monthLength[1] = 29;
        }

        return monthLength[month - 1];
    }

    static capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
      }
}

import { SwitchLanguage } from '@momo-kits/core';

module.exports = {
    WEEKDAYS: SwitchLanguage.getLocalize({
        vi: [
            'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN',
        ],
        en: ['Mon', 'Tues', 'Wed', 'Thur', 'Fri', 'Sat', 'Sun'],
    }),

    WEEKDAYSNAME: [
        'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'Chủ nhật',
    ],

    MONTHS: SwitchLanguage.getLocalize({
        vi: [
            'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6', 'Tháng 7',
            'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'
        ],
        en: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    }),

    MAX_ROWS: 7,

    MAX_COLUMNS: 7,

    getDaysInMonth(month, year) {
        const lastDayOfMonth = new Date(year, month + 1, 0);
        return lastDayOfMonth.getDate();
    },

    getDayofDate(date) {
        const WEEKDAYSNAME = ['Thứ hai', 'Thứ ba', 'Thứ tư', 'Thứ năm', 'Thứ sáu', 'Thứ bảy', 'Chủ nhật'];
        let day = date.getDay();
        if (date.getDay() === 0) {
            day = 7;
        }
        return WEEKDAYSNAME[day - 1];
    },
    formatDate(date) {
        const padding = (input) => `${input > 9 ? input : `0${input}`}`;
        if (date && typeof date.getDate === 'function') {
            return `${padding(date.getDate())}/${
                padding(date.getMonth() + 1)}/${
                (date.getFullYear()).toString()}`;
        }
        return null;
    },

};

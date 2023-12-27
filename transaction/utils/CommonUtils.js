import { Platform } from 'react-native';
import { NumberUtils } from '@momo-kits/core';
import moment from 'moment';
import I18n from './I18n';

export default class CommonUtils {
    static formatNumberToMoney(number, currency = I18n.currencyVND) {
        return NumberUtils.formatNumberToMoney(number, currency);
    }

    static isArrayNotEmpty(array) {
        return (
            array && typeof array !== 'string' && Array.isArray(array) && array.length > 0
        );
    }

    static isObject(val) {
        return typeof val === 'object' && val !== null;
    }

    static getFontWeightMedium() {
        return Platform.OS === 'android' ? 'bold' : '600';
    }

    static formatTimeByGTM7(timestamp, format = 'HH:mm - DD/MM/YYYY') {
        return moment(timestamp).utcOffset(7).format(format);
    }
}

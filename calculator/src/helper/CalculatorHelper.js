/* eslint-disable no-eval */
/* eslint-disable no-restricted-globals */
import { NumberUtils } from '@momo-kits/core';

export default class CalculatorHelper {
    static HEIGHT_CALCULATOR_KEYBOARD = 0

    static KEY_HEIGHT_CALCULATOR_KEYBOARD = 'ACTION_KEY_BOARD_HEIGHT_KEYBOARD';

    static OPERATORS = {
        '+': '+',
        '-': '-',
        '×': '*',
        '÷': '/'
    };

    MAX_LENGTH = 30;

    MAX_NUMBER = 9;

    static removeLastSymbols(s) {
        const str = s.toString();
        if (str.length <= 3) return str;
        const lastsymbol = str.substring(str.length - 3, str.length);
        if (lastsymbol === ' ÷ ' || lastsymbol === ' × ' || lastsymbol === ' + ' || lastsymbol === ' - ') {
            return str.substring(0, str.length - 3);
        }
        return str;
    }

    static formatFormular(formular) {
        let formatedFormular = '';
        const { numbers, operators } = this.splitFormular(formular);

        if (!numbers || numbers.length === 0) {
            return '';
        }
        if ((!operators || operators.length === 0) && numbers.length === 1) {
            let numberstr = numbers[0];
            if (isNaN(numberstr) || Number(numberstr) === 0) {
                return '';
            }
            if (numberstr.length > this.MAX_NUMBER) {
                numberstr = numberstr.slice(0, this.MAX_NUMBER - numberstr.length);
            }
            return NumberUtils.formatNumberToMoney(numberstr);
        }
        if (numbers !== undefined && numbers !== null) {
            for (let i = 0; i < numbers.length; i += 1) {
                let numberstr = numbers[i];
                if (numberstr.length > this.MAX_NUMBER) {
                    numberstr = numberstr.slice(0, this.MAX_NUMBER - numberstr.length);
                }
                const number = Number(`${numberstr}`);
                formatedFormular += NumberUtils.formatNumberToMoney(number);
                if (operators && operators[i]) {
                    formatedFormular += ` ${(operators[i])} `;
                }
            }
            return formatedFormular;
        }
        return formular;
    }

    static calculate(formular) {
        try {
            const { numbers, operators } = this.splitFormular(formular);
            let formatedFormular = '';
            if (numbers !== undefined && numbers !== null) {
                for (let i = 0; i < numbers.length; i += 1) {
                    const formatnumber = Number(`${numbers[i]}`);
                    formatedFormular += formatnumber;
                    if (operators && operators[i]) {
                        formatedFormular = formatedFormular + this.OPERATORS[operators[i]] || operators[i];
                    }
                }
                if (formatedFormular !== '') {
                    const result = eval(formatedFormular);
                    if (isNaN(result) || result === Infinity || result < 0) {
                        return 0;
                    }

                    return Math.ceil(result);
                }
            }
            return 0;
        } catch (e) {
            return 0;
        }
    }

    static splitFormular(formular) {
        if (formular) {
            const formularTmp = String(formular).replace(/ /g, '').replace(/\./g, '');
            const numbers = formularTmp.match(/[\d,]+/ig);
            const listString = Array.from(formularTmp);
            const operators = listString.filter((item) => item === '÷' || item === '×' || item === '+' || item === '-');
            return { numbers, operators };
        }
        return {};
    }

    static isCalculating(value) {
        if (value) {
            const valueString = value.toString();
            return valueString.includes('+') || valueString.includes('-')
            || valueString.includes('×') || valueString.includes('÷');
        }
        return false;
    }
}

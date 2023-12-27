/* eslint-disable no-param-reassign */
/* eslint-disable no-restricted-globals */

export default {
    getRandomInt(min, max) {
        const minV = Math.ceil(min);
        const maxV = Math.floor(max);
        return Math.floor(Math.random() * (maxV - minV + 1)) + minV;
    },

    getRandomIntInclusive(min, max) {
        const minV = Math.ceil(min);
        const maxV = Math.floor(max);
        return Math.floor(Math.random() * (maxV - minV + 1)) + minV;
    },
    formatNumberToPercent(number, persent = '%') {
        if (!number || isNaN(number) || Number(number) === 0) {
            return `0${persent}`;
        }
        return `${number}${persent}`;
    },
    formatNumberToMoney(number, currency = '') {
        if (!number || isNaN(number) || Number(number) === 0) {
            return `0${currency}`;
        }

        const array = [];
        let result = '';
        let isNegative = false;

        if (number < 0) {
            isNegative = true;
        }

        const numberString = Math.abs(number).toString();
        if (numberString.length < 3) {
            return numberString + currency;
        }

        let count = 0;
        for (let i = numberString.length - 1; i >= 0; i -= 1) {
            count += 1;
            if (numberString[i] === '.' || numberString[i] === ',') {
                array.push(',');
                count = 0;
            } else {
                array.push(numberString[i]);
            }
            if (count === 3 && i >= 1) {
                array.push('.');
                count = 0;
            }
        }

        for (let i = array.length - 1; i >= 0; i -= 1) {
            result += array[i];
        }

        if (isNegative) { result = `-${result}`; }

        return result + currency;
    },
    formatMoneyToNumber(money, currencyUnit) {
        if (money && money.length > 0) {
            const moneyString = money.replace(currencyUnit, '').replace(/,/g, '').replace(/đ/g, '').replace(/\./g, '')
                .replace(/ /g, '');
            const number = Number(moneyString);
            if (isNaN(number)) {
                return 0;
            }
            return number;
        }

        return money;
    },
    formatBankCardNumber(number, maxLength = 19) {
        if (!number) return '';
        if (typeof number === 'string' || typeof number === 'string') {
            return number.toString().replace(/\s?/g, '').replace(/(\d{4})/g, '$1 ').trim()
                .substring(0, maxLength);
        }
    },
    checkCardType(string, customRegexData) {
        const cardNumber = string.replace(/ /g, '');
        const regexData = [
            {
                cardType: 'VISA',
                cardUrl:
                    'https://img.mservice.io/momo_app_v2/img/app_icon/ic_topupCreditCard_visa.png',
                regex: /^4[0-9]{12}(?:[0-9]{3})?$/
            },
            {
                cardType: 'MasterCard',
                cardUrl:
                    'https://img.mservice.io/momo_app_v2/img/app_icon/ic_topupCreditCard_master.png',
                regex:
                    /^(?:5[1-5][0-9]{2}|222[1-9]|22[3-9][0-9]|2[3-6][0-9]{2}|27[01][0-9]|2720)[0-9]{12}$/
            }
        ];
        let matchedItem = null;
        (customRegexData || regexData).forEach((item) => {
            const regex = new RegExp(item.regex);
            if (regex.test(cardNumber) && matchedItem === null) {
                matchedItem = item;
            }
        });
        return matchedItem;
    },
    formatPhoneNumberVN(phone, prefix = '0') {
        if (phone) {
            let phoneFormatted = `+${phone.replace(/\D/g, '')}`;
            phoneFormatted = phoneFormatted.replace('+84', '0');
            phoneFormatted = phoneFormatted.replace('(+84)', '0');
            phoneFormatted = phoneFormatted.replace('(084)', '0');
            phoneFormatted = phoneFormatted.replace('(0)', '');
            phoneFormatted = phoneFormatted.replace(/\D/g, '');

            if (phoneFormatted.indexOf('00') === 0) {
                phoneFormatted = phoneFormatted.substr(1);
            }
            if (phoneFormatted.indexOf('84') === 0 && phoneFormatted.length > 3) {
                phoneFormatted = phoneFormatted.substr(2);
            }
            if (phoneFormatted.indexOf('0') !== 0) {
                phoneFormatted = `0${phoneFormatted}`;
            }

            if (phoneFormatted.indexOf(prefix) === 0) {
                return phoneFormatted;
            }

            phoneFormatted = prefix + phoneFormatted.substr(1);
            return phoneFormatted;
        }

        return phone;
    },
    roundNumber(number) {
        return number < 10 ? `0${number}` : number;
    }
};

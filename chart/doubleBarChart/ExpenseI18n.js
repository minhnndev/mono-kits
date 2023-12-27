import { LocalizedStrings } from '@momo-kits/core';

let ExpenseI18n = new LocalizedStrings({
    vi: {
        milion: 'Tr',
        bilion: 'Tỷ',
    },
    en: {
        milion: 'M',
        bilion: 'B',
    },
});

ExpenseI18n.get = (key, defaultValue = '') => {
    let value;
    value = LocalizedStrings.getLocalize(key);
    console.log(value);
    if (!value || value.length <= 0) {
        value = defaultValue;
    }
    if (!value || typeof value !== 'string') {
        value = '';
    }
    return value;
};

export default ExpenseI18n;

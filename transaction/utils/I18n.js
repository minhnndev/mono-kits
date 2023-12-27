import { LocalizedStrings } from '@momo-kits/core';

const languages = {
    vi: {
        currencyVND: 'đ',
        paymentTime: 'Thời gian thanh toán',
        transactionCode: 'Mã giao dịch',
        defaultService: 'Dịch vụ',
        status_fail: 'Giao dịch không thành công',
        status_pending: 'Giao dịch đang chờ xử lý',
        status_success: 'Giao dịch thành công',
        detail: 'Chi tiết',
        walletBalance: 'Số dư',
        textCollaped: 'Xem thêm',
        textExpanded: 'Thu gọn',
        sourceName: 'Nguồn tiền/ Tài khoản giao dịch',
        momoWallet: 'Ví Momo',
        transaction: 'Giao dịch'
    },
    en: {
        currencyVND: ' VND',
        paymentTime: 'Payment time',
        transactionCode: 'Transaction code',
        defaultService: 'Service',
        status_fail: 'Payment failed',
        status_pending: 'Payment is processing',
        status_success: 'Payment successful',
        detail: 'Detail',
        walletBalance: 'Momo balance',
        textCollaped: 'View more',
        textExpanded: 'Collapse',
        sourceName: 'Payment method/ Account',
        momoWallet: 'Momo Wallet',
        transaction: 'Transaction'
    },
};

const I18n = new LocalizedStrings(languages);
I18n.get = (key, defaultValue = '') => {
    let value;
    value = LocalizedStrings.getLocalize(key);
    if (!value || value.length <= 0) {
        value = defaultValue;
    }
    if (!value || typeof value !== 'string') {
        value = '';
    }
    return value;
};
export { languages };
export default I18n;

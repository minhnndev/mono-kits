/* eslint-disable no-template-curly-in-string */
import LocalizedStrings from './Language';

const SwitchLanguage = new LocalizedStrings({
    vi: {
        /* COMMON */
        seeMore: 'Xem thêm',
        cancel: 'Huỷ',
        done: 'Xong',
        confirm: 'Xác nhận',
        month: 'tháng',
        day: 'ngày',
        choose: 'Chọn',
        /* STEP */
        sent: 'Đã gửi',
        received: 'Đã tiếp nhận',
        processing: 'Đang xử lý',
        processed: 'Đã xử lý',

        /* IMAGE PICKER LIST */
        addImg: 'Thêm hình',

        /* RADIO BUTTON */
        chooseBtn: 'Chọn button',

        /* IMAGE LIST */
        imgEg: 'Hình ảnh tham khảo',

        /* SELECTION TAG */
        filter: 'Sắp xếp',
        shipping: 'Đang giao hàng',
        men: 'Nam',
        women: 'Nữ',
        more: 'Khác',

        /* DISCOUNT VOUCHER CARD */
        expDate: 'Ngày hết hạn',

        /* VOUCHER CARD */
        exp: 'HSD',
        inActive: 'Chưa kích hoạt',
        voucherRemindHour: 'Hết hạn sau {hours} giờ',
        voucherRemindMinute: 'Hết hạn sau {minutes} phút',
        voucherRemindSecond: 'Hết hạn sau {seconds} giây',
        voucherRemindDay: 'Hết hạn sau {days} ngày',

        /* CALENDAR */
        chooseRoundtrip: 'CHỌN VÉ KHỨ HỒI',
        depart: 'Ngày đi',
        return: 'Ngày về',
        departing: 'Đi',
        returning: 'Về',
        jan: 'Tháng 1',
        feb: 'Tháng 2',
        mar: 'Tháng 3',
        apr: 'Tháng 4',
        may: 'Tháng 5',
        jun: 'Tháng 6',
        jul: 'Tháng 7',
        aug: 'Tháng 8',
        sep: 'Tháng 9',
        oct: 'Tháng 10',
        nov: 'Tháng 11',
        dec: 'Tháng 12',
        mon: 'T2',
        tue: 'T3',
        wed: 'T4',
        thu: 'T5',
        fri: 'T6',
        sat: 'T7',
        sun: 'CN',
        showLunar: 'Hiển thị lịch âm',

        // Holiday
        // Solar
        newYear: 'Tết Dương lịch',
        valentine: 'Ngày Lễ Tình nhân',
        womenDay: 'Ngày Quốc tế Phụ nữ',
        liberationDay: 'Ngày giải phóng Miền Nam thống nhất đất nước',
        laborDay: 'Ngày Quốc tế Lao động',
        childrenDay: 'Ngày Quốc tế Thiếu nhi',
        nationalDay: 'Quốc khánh nước CHXHCN Việt Nam',
        womenDayVN: 'Ngày Phụ nữ Việt Nam',
        teacherDay: 'Ngày Nhà giáo Việt Nam',
        christmasEve: 'Ngày Lễ Giáng Sinh',
        christmas: 'Ngày Lễ Giáng Sinh',
        // Lunar
        lunarNewYear: 'Tết Nguyên Đán',
        hungKingDay: 'Giỗ Tổ Hùng Vương',

        /* BALANCE */
        balance: 'Số dư trong ví',

        /* DATE PICKER */
        chooseDate: 'Chọn ngày tháng năm',
        year: 'năm',
        hour: 'giờ',
        minute: 'phút',
        from: 'Từ',
        to: 'Đến',

        /* CONNECTION STATUS */
        connected: 'Đã kết nối',
        disconnected: 'Mất kết nối',

        /* READ MORE */
        hide: 'Ẩn',
        viewAllTitle: 'Xem tất cả',
        headerTitle: 'Lịch sử thanh toán',
        SHORTEN: 'THU GỌN',
        viewMoreBank: 'XEM THÊM (${otherItemCount} ngân hàng)',

        transaction_success: 'Thành công',
        transaction_fail: 'Thất bại',
        transaction_processing: 'Đang xử lý',
        viewMore: 'Xem thêm',
        shorten: 'Thu gọn',
        Payment: 'Thanh toán ${serviceName}',
        currencyUnit: 'đ',
        Month: 'Tháng',
        save: 'Lưu',

        favoriteIn: 'Thêm dịch vụ yêu thích',
        favoriteOut: 'Xóa dịch vụ yêu thích',
        deviceIn: 'Thêm vào thiết bị',
        setting: 'Cài đặt',
        transaction: 'Lịch sử giao dịch',
        share: 'Chia sẽ dịch vụ',
        information: 'Thông tin chung',
        tutorial: 'Hướng dẫn sử dụng',
        question: 'Câu hỏi thường gặp',
        support: 'Trung tâm hỗ trợ'
    },
    en: {
        /* COMMON */
        seeMore: 'See more',
        cancel: 'Cancel',
        done: 'Done',
        confirm: 'Confirm',
        month: 'month',
        day: 'day',
        choose: 'Choose',
        /* STEP */
        sent: 'Sent',
        received: 'Received',
        processing: 'Processing',
        processed: 'Done',

        /* IMAGE PICKER LIST */
        addImg: 'Add image',

        /* RADIO BUTTON */
        chooseBtn: 'Choose button',

        /* IMAGE LIST */
        imgEg: 'Example images',

        /* SELECTION TAG */
        filter: 'Filter',
        shipping: 'Shipping',
        men: 'Men',
        women: 'Women',
        more: 'More',

        /* DISCOUNT VOUCHER CARD */
        expDate: 'Expiration date',

        /* VOUCHER CARD */
        exp: 'EXP',
        inActive: 'Not Activated',
        voucherRemindHour: 'Revoke after {hours} hours',
        voucherRemindMinute: 'Revoke after {minutes} minutes',
        voucherRemindSecond: 'Revoke after {seconds} seconds',
        voucherRemindDay: 'Revoke after {days} days',

        /* CALENDAR */
        chooseRoundtrip: 'CHOOSE ROUNDTRIP TICKET',
        depart: 'Departing',
        return: 'Returning',
        departing: 'De',
        returning: 'Re',
        jan: 'January',
        feb: 'February',
        mar: 'March',
        apr: 'April',
        may: 'May',
        jun: 'June',
        jul: 'July',
        aug: 'August',
        sep: 'September',
        oct: 'October',
        nov: 'November',
        dec: 'December',
        mon: 'Mon',
        tue: 'Tue',
        wed: 'Wed',
        thu: 'Thu',
        fri: 'Fri',
        sat: 'Sat',
        sun: 'Sun',
        showLunar: 'Show Lunar Calendar',

        // Holiday
        // Solar
        newYear: "New Year's Day",
        valentine: "Valentine's Day",
        womenDay: "International Women's Day",
        liberationDay: 'Liberation Day',
        laborDay: "Internation Labor's Day",
        childrenDay: "International Labor's Day",
        nationalDay: 'National Day',
        womenDayVN: "Vietnamese Women's Day",
        teacherDay: "Teacher's Day",
        christmasEve: 'Christmas Eve',
        christmas: 'Christmas Day',
        // Lunar
        lunarNewYear: 'Lunar New Year',
        hungKingDay: "Hung Kings' Festival",

        /* BALANCE */
        balance: 'Wallet Balance',

        /* DATE PICKER */
        chooseDate: 'Choose date',
        year: 'year',
        hour: 'hour',
        minute: 'minute',
        from: 'From',
        to: 'To',

        /* CONNECTION STATUS */
        connected: 'Connected',
        disconnected: 'Disconnected',

        /* READ MORE */
        hide: 'Hide',
        viewAllTitle: 'View all',
        headerTitle: 'Transaction history',
        SHORTEN: 'SHORTEN',
        viewMoreBank: 'VIEW MORE (${otherItemCount} banks)',
        transaction_success: 'Success',
        transaction_fail: 'Fail',
        transaction_processing: 'Processing',
        viewMore: 'View more',
        shorten: 'Shorten',
        Payment: '${serviceName} payment',
        currencyUnit: 'VND',
        Month: 'Month',
        save: 'Save',

        favoriteIn: 'Add to favorite services',
        favoriteOut: 'Remove to favorite services',
        deviceIn: 'Add to device',
        setting: 'Settings',
        transaction: 'Transaction History',
        share: 'Share',
        information: 'Information',
        tutorial: 'Instruction',
        question: 'FAQ',
        support: 'Support center'
    }
});

export default SwitchLanguage;

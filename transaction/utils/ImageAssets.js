const CDN = 'https://img.mservice.io/momo_app_v2/new_version/img/appx_icon/';
const CDN_IMAGE_TRANSACTION = 'https://cdn.mservice.com.vn/app/img/transaction/';

const ImageAssets = {
    ic_arrow_right_small: CDN.concat('24_arrow_chevron_right_small.png'),
    ic_tranhis_status_result_payment_success:
        CDN.concat('48_notifications_icon48_info.png'),
    ic_tranhis_status_result_payment_fail:
        CDN.concat('48_notifications_minus_octagon.png'),
    ic_payment_result_pending:
        CDN_IMAGE_TRANSACTION.concat('ic_payment_result_pending.png'),
    ic_success: CDN_IMAGE_TRANSACTION.concat('ic_success.png'),
    ic_fail: CDN_IMAGE_TRANSACTION.concat('ic_fail.png'),
    ic_eye_v2_on: CDN_IMAGE_TRANSACTION.concat('ic_eye.png'),
    ic_eye_v2_off: CDN_IMAGE_TRANSACTION.concat('ic_eye_off.png'),
};

export default ImageAssets;

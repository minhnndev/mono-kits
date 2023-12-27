import { IconSource, SwitchLanguage } from '@momo-kits/core';

export const TRANSACTION_STATUS = {
    ALL: 0,
    SUCCESS: 1,
    PROCESSING: 2,
    FAIL: 3
};

const TranType = {
    M2N: 5,
    LUCKY_MONEY_2018: 2018
};

const WAITING_CASHBACK = 204;
const WAITING = 200; // waiting receiver
const INIT_START = 1;

export default class TransactionHistoryHelper {
    static getStatusText(status) {
        let statusText = SwitchLanguage?.transaction_processing;
        if (status === TRANSACTION_STATUS.SUCCESS) {
            statusText = SwitchLanguage?.transaction_success;
        } else if (status === TRANSACTION_STATUS.FAIL) {
            statusText = SwitchLanguage?.transaction_fail;
        } else if (status === TRANSACTION_STATUS.PROCESSING) {
            statusText = SwitchLanguage?.transaction_processing;
        }
        return statusText;
    }

    static getResultTransaction(tranHisError, tranType, status) {
        if (tranHisError === 0 || tranHisError === undefined) {
            if ((status === INIT_START || status === WAITING) && (tranType === TranType.M2N || tranType === TranType.LUCKY_MONEY_2018)) {
                return TRANSACTION_STATUS.PROCESSING;
            }
            if (status === WAITING_CASHBACK) {
                return TRANSACTION_STATUS.PROCESSING;
            }
            return TRANSACTION_STATUS.SUCCESS;
        }

        if (tranHisError === 9000) { // transaction process
            return TRANSACTION_STATUS.PROCESSING;
        }

        return TRANSACTION_STATUS.FAIL;
    }

    static getIconByStatus(status) {
        const {
            SUCCESS, FAIL, PROCESSING
        } = TRANSACTION_STATUS;
        let icon = IconSource.ic_transaction_history_status_processing;
        if (status === SUCCESS) {
            icon = IconSource.ic_transaction_history_status_success;
        } else if (status === FAIL) {
            icon = IconSource.ic_transaction_history_status_fail;
        } else if (status === PROCESSING) {
            icon = IconSource.ic_transaction_history_status_processing;
        }
        return icon;
    }
}

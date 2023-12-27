import { DeviceEventEmitter } from 'react-native';

export const requestFunction = (func, args = [], requestId, callback) => {
    if (global?.miniAppApi && global?.miniAppApi?.dispatch) {
        global?.miniAppApi?.dispatch?.(func, ...args, callback);
    } else {
        const responseId = requestId || new Date().getTime();
        const responseListener = `KIT_RESPONSE_MESSAGE_${responseId}`;
        const TIME_OUT = 5000;
        const timeout = setTimeout(() => {
            DeviceEventEmitter.removeListener(responseListener);
        }, TIME_OUT);
        DeviceEventEmitter.addListener(responseListener, (result) => {
            DeviceEventEmitter.removeListener(responseListener);
            clearTimeout(timeout);
            callback?.(result);
        });
        DeviceEventEmitter.emit('KITS_REQUEST_MESSAGE', { func, args, responseListener });
    }
};

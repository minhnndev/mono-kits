import { Dimensions, Platform } from 'react-native';

const { width } = Dimensions.get('window');

export const isIphoneX = () => {
    const dimension = Dimensions.get('window');
    return (
        Platform.OS === 'ios'
        && !Platform.isPad
        && !Platform.isTVOS
        && (dimension.height >= 812 || dimension.width >= 812 || dimension.height >= 896 || dimension.width >= 896)
    );
};

export function DynamicSize(value, customWidth, standardScreenHeight = 375) {
    const dynamicSize = (value * (customWidth || width)) / standardScreenHeight;
    return Math.round(dynamicSize);
}

export const ifIphoneX = (a, b) => {
    if (isIphoneX()) return a;
    return b;
};

export default class ScreenUtils {
    static isIphoneX() {
        return isIphoneX();
    }

    static ifIphoneX(a, b) {
        return ifIphoneX(a, b);
    }

    static getPaddingBottomIphoneX() {
        return ifIphoneX(34, 0);
    }
}

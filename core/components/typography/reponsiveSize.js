import { Platform, StatusBar, Dimensions } from 'react-native';
import { isIphoneX } from '../../utils/ScreenUtils';

const { height, width } = Dimensions.get('window');
const standardLength = width > height ? width : height;
const offset = width > height ? 0 : Platform.OS === 'ios' ? 78 : StatusBar.currentHeight;

const deviceHeight = isIphoneX() || Platform.OS === 'android'
    ? standardLength - offset
    : standardLength;

export function RFPercentage(percent) {
    const heightPercent = (percent * deviceHeight) / 100;
    return Math.round(heightPercent);
}

// guideline height for standard 5" device screen is 680 deviceHeight <= 568 ? fontSize :
export function RFValueVertical(fontSize, standardScreenHeight = 680) {
    const heightPercent = (fontSize * deviceHeight) / standardScreenHeight;
    return Math.round(heightPercent);
}

export function RFValueHorizontal(fontSize, customWidth, standardScreenHeight = 375) {
    const heightPercent = Math.round((fontSize * (customWidth || width)) / standardScreenHeight);
    return heightPercent > fontSize + 5 ? fontSize + 5 : heightPercent;
}

export function DynamicFont(fontSize, customWidth, standardScreenHeight = 375) {
    const heightPercent = Math.round((fontSize * (customWidth || width)) / standardScreenHeight);
    return heightPercent > fontSize + 5 ? fontSize + 5 : heightPercent <= fontSize - 3 ? fontSize - 3 : heightPercent;
}

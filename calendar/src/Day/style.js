import { Dimensions } from 'react-native';
import { Colors } from '@momo-kits/core';

const dayWidth = (Dimensions.get('window').width - 38) / 7;
const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_DPI_WIDTH = (SCREEN_WIDTH * Dimensions.get('window').scale);
const IPHONE_4_5_WIDTH = 640;
const dayTextSize = SCREEN_DPI_WIDTH === IPHONE_4_5_WIDTH ? 13 : 15;
const lunarTextSize = SCREEN_DPI_WIDTH === IPHONE_4_5_WIDTH ? 8 : 10;
const priceTextSize = SCREEN_DPI_WIDTH === IPHONE_4_5_WIDTH ? 8 : 10;
const lineHeightDayText = 1.3 * dayTextSize;
const lineHeightLunarText = 1.3 * lunarTextSize;
const lineHeightPriceText = 1.3 * priceTextSize;
const containerDayHeight = lineHeightDayText + lineHeightLunarText + lineHeightPriceText + 10;
const heightDefault = lineHeightDayText + lineHeightLunarText;
export default {
    dayContainer: {
        width: dayWidth,
        borderRadius: 4,
        alignItems: 'center',
        height: containerDayHeight,
    },
    day: {
        width: dayWidth,
        paddingVertical: 5,
        overflow: 'hidden',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 4,
        height: heightDefault + 5
    },
    dayText: {
        fontSize: dayTextSize,
        textAlign: 'center',
        fontWeight: 'bold',
        color: '#222222'
    },
    lunarDayText: {
        width: dayWidth,
        textAlign: 'right',
        fontSize: SCREEN_DPI_WIDTH === IPHONE_4_5_WIDTH ? 8 : 10,
        paddingRight: 5,
        color: '#222222'
    },
    todayText: {
        color: 'blue'
    },
    weekendDay: {
        color: '#e82956'
    },
    dayTextDisabled: {
        opacity: 0.2
    },
    focused: {
        backgroundColor: Colors.pink_05_b
    },
    focusedText: {
        color: 'white'
    },
    dayStartContainer: {
        borderTopLeftRadius: 4,
        borderBottomLeftRadius: 4,
        backgroundColor: Colors.pink_09,
        // height: heightDefault
    },
    dayEndContainer: {
        borderTopRightRadius: 4,
        borderBottomRightRadius: 4,
        backgroundColor: Colors.pink_09,
        // height: heightDefault
    },
    mid: {
        backgroundColor: Colors.pink_09,
        // height: heightDefault
    },
    departLabel: {
        position: 'absolute',
        backgroundColor: 'yellow',
        width: 20,
        height: 20,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center'
    },
    returnLabel: {
        position: 'absolute',
        backgroundColor: 'yellow',
        width: 20,
        height: 20,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        top: 0,
        right: 0
    },
    containerDayHeight,
    txtBack: {
        position: 'absolute',
        backgroundColor: '#ffbb1e',
        borderRadius: 100,
        top: -2,
        right: -2,
        zIndex: 999,
        padding: 2,
        width: 15,
        height: 15,
        justifyContent: 'center',
        alignItems: 'center'
    },
    txtGo: {
        position: 'absolute',
        backgroundColor: '#ffbb1e',
        top: -2,
        left: -2,
        borderRadius: 100,
        padding: 2,
        zIndex: 999,
        width: 15,
        height: 15,
        justifyContent: 'center',
        alignItems: 'center'
    },
    price: {
        fontSize: priceTextSize,
        lineHeight: lineHeightPriceText,
        color: '#8d919d'
    },
    lineHeightPriceText
};

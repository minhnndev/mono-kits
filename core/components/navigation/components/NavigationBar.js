import React from 'react';
import {
    StyleSheet,
    Animated,
    Dimensions,
    Platform,
    StatusBar,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import utils from '../assets/utils';
import imgs from '../assets/imgs';
import Colors from '../../../colors';
import Image from '../../image/FastImage';

const { width: screenWidth } = Dimensions.get('window');

// ipx : height: 462, width: 1125
const getHeightResize = () => {
    // const image = imgs.bg_header;
    // const { height: imgH, width: imgW } = Image.resolveAssetSource(image) || {};
    const ratio = 1125 / 462; // imgW / imgH;
    return Math.round(screenWidth / ratio);
};

const IOS = getHeightResize(); // utils.getDefaultHeaderHeight() * 3 + 6;
const ANDROID =
    utils.getDefaultHeaderHeight() * 2 + 12 + StatusBar.currentHeight * 2;
const AnimationBar = Animated.createAnimatedComponent(LinearGradient);

// const AnimationImage = Animated.createAnimatedComponent(Image);
// ['#b0006d', '#f67b9a'],

const NavigationBar = ({
    colors, //= ['#b0006d', '#f67b9a'],
    source,
    start = { x: 0, y: 0 },
    end = { x: 1, y: 1 },
    style,
    blur = false,
}) => {
    const headerBar = source || imgs.bg_header;
    return Array.isArray(colors) ? (
        <AnimationBar
            start={start}
            end={end}
            colors={colors}
            style={[styles.container, { opacity: blur ? 0.9 : 1 }, style]}
        />
    ) : (
        <AnimationBar
            start={start}
            end={end}
            colors={['#b0006d', '#f67b9a']}
            pointerEvents="box-none"
            style={styles.imgContainer}>
            <Image source={headerBar} style={styles.headerBar} />
        </AnimationBar>
    );
};
export default NavigationBar;

const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
        flex: 1,
    },
    headerBar: {
        flex: 1,
        position: 'absolute',
        top: 0,
        width: '100%',
        height: Platform.OS === 'ios' ? IOS : ANDROID,
        resizeMode: 'cover',
    },
    imgContainer: {
        flex: 1,
        backgroundColor: Colors.white,
        overflow: 'hidden',
    },
});

import React from 'react';
import {
  Animated,
  Dimensions,
  Platform,
  StatusBar,
  StyleSheet,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {getHeaderColors, getHeaderImage} from '../assets/imgs';
import Colors from '../../../colors';
import Image from '../../image/FastImage';

const {width: screenWidth} = Dimensions.get('window');

const getHeightResize = () => {
  const ratio = 1125 / 462; // imgW / imgH;
  return Math.round(screenWidth / ratio);
};

const HeightBar = Platform.select({
  ios: getHeightResize(),
  android: 124 + StatusBar.currentHeight * 2,
  default: getHeightResize(),
});

const AnimationBar = Animated.createAnimatedComponent(LinearGradient);

const NavigationBar = ({
  colors,
  source,
  start = {x: 1, y: 0},
  end = {x: 1, y: 1},
  style,
  blur = false,
}) => {
  const headerBar = source || getHeaderImage();
  return Array.isArray(colors) ? (
    <AnimationBar
      start={start}
      end={end}
      colors={colors}
      style={[styles.container, {opacity: blur ? 0.9 : 1}, style]}
    />
  ) : (
    <AnimationBar
      start={start}
      end={end}
      colors={getHeaderColors()}
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
    height: HeightBar,
    resizeMode: 'stretch',
  },
  imgContainer: {
    flex: 1,
    backgroundColor: Colors.white,
    overflow: 'hidden',
  },
});

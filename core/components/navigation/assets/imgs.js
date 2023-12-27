import {NativeModules} from 'react-native';
import ResouceManager from '../../../resources/ResourceManager';
import ValueUtil from '../../../utils/ValueUtil';
import icons from '../../icon/cached_images.json';

ResouceManager.loadResource('navigationBar');

const headerColors = [
  'rgba(189,24,114,1)',
  'rgba(255,133,186,1)',
  'rgba(255,255,255,0)',
];

const buttonColors = {};

const getHeaderImage = () => {
  const navigationBarResource = NativeModules?.RNResource?.navigationBar;
  if (ValueUtil.parseData(navigationBarResource)?.headerBar) {
    return ValueUtil.parseData(navigationBarResource)?.headerBar;
  }
  return icons.header_background.uri;
};

const getHeaderColors = () => {
  const navigationBarResource = NativeModules?.RNResource?.navigationBar;
  if (ValueUtil.parseData(navigationBarResource)?.headerColors) {
    return ValueUtil.parseData(navigationBarResource)?.headerColors;
  }
  return headerColors;
};

const getButtonColors = () => {
  const navigationBarResource = NativeModules?.RNResource?.navigationBar;
  if (ValueUtil.parseData(navigationBarResource)?.buttonColors) {
    return ValueUtil.parseData(navigationBarResource)?.buttonColors;
  }
  return buttonColors;
};

export {getHeaderImage, getHeaderColors, getButtonColors};

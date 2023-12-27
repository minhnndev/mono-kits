import {PixelRatio} from 'react-native';

const scale = () => {
  const scaleRate = 0.008;
  if (PixelRatio.get() > 2) {
    return 1 + (PixelRatio.get() / 2) * scaleRate;
  }
  return 1;
};
const fontSize = {
  h1: scale() * 32,
  h2: scale() * 24,
  h3: scale() * 20,
  h4: scale() * 16,
  title: scale() * 14,
  subTitle: scale() * 12,
  caption: scale() * 10,
  smallPrint: scale() * 8,
  // will remove in next version,
  body: scale() * 15,
  paragraph: scale() * 14,
};

const fontWeight = {
  bold: 'bold',
  medium: '600',
  normal: 'normal',
  regular: '400',
};

const fontFamily = {
  SFProText_Black: 'SFProText-Black',
  SFProText_BlackItalic: 'SFProText-BlackItalic',
  SFProText_Bold: 'SFProText-Bold',
  SFProText_BoldItalic: 'SFProText-BoldItalic',
  SFProText_Heavy: 'SFProText-Heavy',
  SFProText_HeavyItalic: 'SFProText-HeavyItalic',
  SFProText_Light: 'SFProText-Light',
  SFProText_LightItalic: 'SFProText-LightItalic',
  SFProText_Medium: 'SFProText-Medium',
  SFProText_MediumItalic: 'SFProText-MediumItalic',
  SFProText_Regular: 'SFProText-Regular',
  SFProText_RegularItalic: 'SFProText-RegularItalic',
  SFProText_Semibold: 'SFProText-Semibold',
  SFProText_SemiboldItalic: 'SFProText-SemiboldItalic',
  SFProText_Thin: 'SFProText-Thin',
  SFProText_ThinItalic: 'SFProText-ThinItalic',
  SFProText_Ultralight: 'SFProText-Ultralight',
  SFProText_UltralightItalic: 'SFProText-UltralightItalic',
};

export default {
  fontSize,
  fontFamily,
  fontWeight,
};

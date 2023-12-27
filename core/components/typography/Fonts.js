import { RFValueHorizontal } from './reponsiveSize';

const fontSize = {
    h1: RFValueHorizontal(32),
    h2: RFValueHorizontal(24),
    h3: RFValueHorizontal(20),
    h4: RFValueHorizontal(16),
    title: RFValueHorizontal(14),
    subTitle: RFValueHorizontal(12),
    caption: RFValueHorizontal(10),
    smallPrint: RFValueHorizontal(8),
    // will remove in next version,
    body: 15,
    paragraph: 14,
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

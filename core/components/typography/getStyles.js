import { StyleSheet } from 'react-native';
import Fonts from './Fonts';

const toUpFirstCase = (a) => a.charAt(0).toUpperCase() + a.slice(1);

const mappingFont = ({ name = '', type = 'regular' }) =>
    `${name}_${toUpFirstCase(type)}`;

const styles = ({ font }) => {
    // const weight = StyleSheet.create({
    //     bold: { fontWeight: Fonts.fontWeight.bold },
    //     medium: { fontWeight: Fonts.fontWeight.medium },
    //     regular: { fontWeight: Fonts.fontWeight.regular },
    //     normal: { fontWeight: Fonts.fontWeight.normal },
    // });

    const weight = StyleSheet.create({
        bold: { fontFamily: Fonts.fontFamily.SFProText_Bold },
        medium: { fontFamily: Fonts.fontFamily.SFProText_Medium },
        regular: { fontFamily: Fonts.fontFamily.SFProText_Regular },
        normal: { fontWeight: Fonts.fontWeight.normal },
    });

    const type = StyleSheet.create({
        h1: {
            fontSize: Fonts.fontSize.h1,
        },
        h2: {
            fontSize: Fonts.fontSize.h2,
        },
        h3: {
            fontSize: Fonts.fontSize.h3,
        },
        h4: {
            fontSize: Fonts.fontSize.h4,
        },
        title: {
            fontSize: Fonts.fontSize.title,
        },
        subTitle: {
            fontSize: Fonts.fontSize.subTitle,
        },
        caption: {
            fontSize: Fonts.fontSize.caption,
        },
        smallPrint: {
            fontSize: Fonts.fontSize.smallPrint,
        },
        // will remove in next version
        body: {
            fontSize: Fonts.fontSize.body,
        },
        paragraph: {
            fontSize: Fonts.fontSize.paragraph,
        },
    });

    const fontFamily = StyleSheet.create({
        black: {
            fontFamily: Fonts.fontFamily[mappingFont(font)],
        },
        regular: {
            fontFamily: Fonts.fontFamily[mappingFont(font)],
        },
        bold: {
            fontFamily: Fonts.fontFamily[mappingFont(font)],
        },
        semibold: {
            fontFamily: Fonts.fontFamily[mappingFont(font)],
        },
        heavy: {
            fontFamily: Fonts.fontFamily[mappingFont(font)],
        },
        light: {
            fontFamily: Fonts.fontFamily[mappingFont(font)],
        },
        thin: {
            fontFamily: Fonts.fontFamily[mappingFont(font)],
        },
        ultralight: {
            fontFamily: Fonts.fontFamily[mappingFont(font)],
        },
    });
    return { fontFamily, type, weight };
};
export default styles;

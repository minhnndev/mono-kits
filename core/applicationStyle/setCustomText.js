/* eslint-disable prefer-rest-params */
/* eslint-disable no-param-reassign */
import { Text } from 'react-native';

// const generatorFont = (name, weight) => {
//     const fontFamily = (font) => `${name}-${font}`;
//     const font = {
//         100: 'Thin',
//         200: 'Ultralight',
//         300: 'Light',
//         400: 'Regular',
//         500: 'Medium',
//         600: 'Semibold',
//         700: 'Bold',
//         800: 'Heavy',
//         900: 'Black',
//         normal: 'Regular',
//         bold: 'Bold',
//     };
//     return { fontFamily: fontFamily(font[weight] || font.normal) };
// };

// const generatorLineHeight = (size) => ({ lineHeight: size ? size + 4 : 18 });

const setCustomText = (customProps) => {
    const TextRender = Text.render;
    const initialDefaultProps = Text.defaultProps;
    Text.defaultProps = {
        ...initialDefaultProps,
        ...customProps
    };
    Text.render = function render(props) {
        const oldProps = props;
        // const customWeight = generatorFont('SFProText', props?.style?.fontWeight);
        // const customLineHeight = generatorLineHeight(props?.style?.fontSize);
        props = { ...props, style: [customProps.style, props.style] };
        try {
            return TextRender.apply(this, arguments);
        } finally {
            props = oldProps;
        }
    };
};

export default setCustomText;

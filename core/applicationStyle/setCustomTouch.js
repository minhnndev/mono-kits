/* eslint-disable prefer-rest-params */
/* eslint-disable no-param-reassign */
import { TouchableOpacity } from 'react-native';

const setCustomTouch = (customProps) => {
    const TextRender = TouchableOpacity.render;
    const initialDefaultProps = TouchableOpacity.defaultProps;
    TouchableOpacity.defaultProps = {
        ...initialDefaultProps,
        ...customProps
    };
    TouchableOpacity.render = function render(props) {
        const oldProps = props;
        props = { ...props, style: [customProps.style, props.style] };
        try {
            return TextRender.apply(this, arguments);
        } finally {
            props = oldProps;
        }
    };
};

export default setCustomTouch;

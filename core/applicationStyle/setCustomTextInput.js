/* eslint-disable prefer-rest-params */
/* eslint-disable no-param-reassign */
import { TextInput } from 'react-native';

const setCustomTextInput = (customProps) => {
    const TextInputRender = TextInput.render;
    const initialDefaultProps = TextInput.defaultProps;
    TextInput.defaultProps = {
        ...initialDefaultProps,
        ...customProps
    };
    TextInput.render = function render(props) {
        const oldProps = props;
        props = { ...props, style: [customProps.style, props.style] };
        try {
            return TextInputRender.apply(this, arguments);
        } finally {
            props = oldProps;
        }
    };
};

export default setCustomTextInput;

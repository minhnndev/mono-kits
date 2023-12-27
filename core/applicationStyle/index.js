import setCustomText from './setCustomText';
import setCustomTextInput from './setCustomTextInput';

const customTextInputProps = {
    allowFontScaling: false,
};

// Setting default styles for all Text UserComponent.
const customTextProps = {
    allowFontScaling: false,
};

const init = () => {
    setCustomTextInput(customTextInputProps);
    setCustomText(customTextProps);
};

export default init;

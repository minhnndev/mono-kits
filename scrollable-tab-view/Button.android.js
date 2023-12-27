const React = require('react');
const ReactNative = require('react-native');

const { TouchableNativeFeedback } = ReactNative;

const Button = ({ children, ...props }) => (
    <TouchableNativeFeedback
        delayPressIn={0}
        background={TouchableNativeFeedback.SelectableBackground()} // eslint-disable-line new-cap
        {...props}
    >
        {children}
    </TouchableNativeFeedback>
);

module.exports = Button;

const React = require('react');
const ReactNative = require('react-native');

const { View } = ReactNative;

const StaticContainer = require('./StaticContainer');

const SceneComponent = ({ children, shouldUpdated, ...props }) => (
    <View {...props}>
        <StaticContainer shouldUpdate={shouldUpdated}>
            {children}
        </StaticContainer>
    </View>
);

module.exports = SceneComponent;

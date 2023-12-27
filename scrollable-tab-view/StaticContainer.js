/* eslint-disable react/destructuring-assignment */
const React = require('react');

class StaticContainer extends React.Component {
    shouldComponentUpdate(nextProps) {
        return !!nextProps.shouldUpdate;
    }

    render() {
        const { children } = this.props;
        if (children === null || children === false) {
            return null;
        }
        return React.Children.only(children);
    }
}

module.exports = StaticContainer;

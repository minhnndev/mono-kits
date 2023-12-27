import React from 'react';
import PropTypes from 'prop-types';

import {
    Linking, Platform, StyleSheet, View
} from 'react-native';
import htmlToElement from './htmlToElement';
import CustomHtmlView from './customHtmlView';

const boldStyle = { fontWeight: 'bold' };
const italicStyle = { fontStyle: 'italic' };
const underlineStyle = { textDecorationLine: 'underline' };
const codeStyle = { fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace' };

const baseStyles = StyleSheet.create({
    b: boldStyle,
    strong: boldStyle,
    i: italicStyle,
    em: italicStyle,
    u: underlineStyle,
    pre: codeStyle,
    code: codeStyle,
    a: {
        fontWeight: '500',
        color: '#007AFF',
    },
    img: { width: 100, height: 100 },
    h1: { fontWeight: '500', fontSize: 36 },
    h2: { fontWeight: '500', fontSize: 30 },
    h3: { fontWeight: '500', fontSize: 24 },
    h4: { fontWeight: '500', fontSize: 18 },
    h5: { fontWeight: '500', fontSize: 14 },
    h6: { fontWeight: '500', fontSize: 12 },
});

const htmlToElementOptKeys = [
    'lineBreak',
    'paragraphBreak',
    'bullet',
    'TextComponent',
    'textComponentProps',
    'NodeComponent',
    'nodeComponentProps',
];

class HTMLView extends React.Component {
    constructor() {
        super();
        this.state = {
            element: null,
        };
    }

    componentDidMount() {
        this.mounted = true;
        const { value, useCustomHtmlView } = this.props;
        if (!useCustomHtmlView) {
            this.startHtmlRender(value);
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        const { value, styleSheet, useCustomHtmlView } = this.props;
        const { element } = this.state;
        if ((value !== nextProps.value || styleSheet !== nextProps.styleSheet) && !useCustomHtmlView) {
            this.startHtmlRender(nextProps.value, nextProps.styleSheet);
            return true;
        }
        if (nextState.element !== element || useCustomHtmlView) return true;
        return false;
    }

    componentWillUnmount() {
        this.mounted = false;
    }

    startHtmlRender = (value, style = {}) => {
        const {
            addLineBreaks,
            onLinkPress,
            onLinkLongPress,
            styleSheet,
            renderNode,
            onError,
        } = this.props;

        if (!value) {
            this.setState({ element: null });
        }

        const opts = {
            addLineBreaks,
            linkHandler: onLinkPress,
            linkLongPressHandler: onLinkLongPress,
            styles: { ...baseStyles, ...styleSheet, ...style },
            customRenderer: renderNode,
        };

        htmlToElementOptKeys.forEach((key) => {
            const { props } = this;
            if (typeof props[key] !== 'undefined') {
                opts[key] = props[key];
            }
        });

        htmlToElement(value, opts, (err, element) => {
            if (err) {
                onError(err);
            }

            if (this.mounted) {
                this.setState({ element });
            }
        });
    }

    render() {
        const {
            RootComponent, style, rootComponentProps, useCustomHtmlView, value, customHtmlViewProps = {}
        } = this.props;
        const { element } = this.state;
        if (useCustomHtmlView) {
            return (
                <CustomHtmlView
                    html={value}
                    {...customHtmlViewProps}
                />
            );
        }
        if (element) {
            return (
                <RootComponent
                    {...rootComponentProps}
                    style={style}
                >
                    {element}
                </RootComponent>
            );
        }
        return (
            <RootComponent
                {...rootComponentProps}
                style={style}
            />
        );
    }
}

HTMLView.propTypes = {
    addLineBreaks: PropTypes.bool,
    bullet: PropTypes.string,
    lineBreak: PropTypes.string,
    NodeComponent: PropTypes.func,
    nodeComponentProps: PropTypes.object,
    onError: PropTypes.func,
    onLinkPress: PropTypes.func,
    onLinkLongPress: PropTypes.func,
    paragraphBreak: PropTypes.string,
    renderNode: PropTypes.func,
    RootComponent: PropTypes.any,
    rootComponentProps: PropTypes.object,
    style: PropTypes.object,
    styleSheet: PropTypes.object,
    TextComponent: PropTypes.func,
    textComponentProps: PropTypes.object,
    value: PropTypes.string,
    useCustomHtmlView: PropTypes.bool,
    customHtmlViewProps: PropTypes.object
};

HTMLView.defaultProps = {
    addLineBreaks: true,
    onLinkPress: (url) => Linking.openURL(url),
    onLinkLongPress: null,
    onError: console.error.bind(console),
    RootComponent: View,
    useCustomHtmlView: false,
    customHtmlViewProps: {}
};

export default HTMLView;

/* eslint-disable indent */
/* eslint-disable array-callback-return */
import React from 'react';
import { Platform, StyleSheet, Text } from 'react-native';
import { HtmlParser as htmlparser, Entities as entities } from '@momo-kits/core';

import AutoSizedImage from './AutoSizedImage';

const defaultOpts = {
    lineBreak: '\n',
    paragraphBreak: '\n\n',
    bullet: '\u2022 ',
    TextComponent: Text,
    textComponentProps: null,
    NodeComponent: Text,
    nodeComponentProps: null,
};

const Img = (props) => {
    let keyWidth = 'data-width';
    let keyHeight = 'data-height';
    const { attribs } = props;
    if (Platform.OS === 'ios') {
        if (props.attribs['data-width-ios']) {
            keyWidth = 'data-width-ios';
        }
        if (props.attribs['data-height-ios']) {
            keyHeight = 'data-height-ios';
        }
    }
    const width = parseInt(attribs[keyWidth], 10) || parseInt(attribs.width, 10) || 0;
    const height = parseInt(attribs[keyHeight], 10) || parseInt(attribs.height, 10) || 0;

    const imgStyle = {
        width,
        height,
    };

    const source = {
        uri: attribs.src,
        width,
        height,
    };

    return <AutoSizedImage source={source} style={imgStyle} />;
};

export default function htmlToElement(rawHtml, customOpts = {}, done) {
    const opts = {
        ...defaultOpts,
        ...customOpts,
    };

    function inheritedStyle(parent) {
        if (!parent) return null;
        const style = StyleSheet.flatten(opts.styles[parent.name]) || {};
        const parentStyle = inheritedStyle(parent.parent) || {};
        return { ...parentStyle, ...style };
    }

    function domToElement(dom, parent) {
        if (!dom) return null;

        const renderNode = opts.customRenderer;
        let orderedListCounter = 1;

        return dom.map((node, index, list) => {
            if (renderNode) {
                const rendered = renderNode(
                    node,
                    index,
                    list,
                    parent,
                    domToElement
                );
                if (rendered || rendered === null) return rendered;
            }

            const { TextComponent } = opts;

            if (node.type === 'text') {
                const defaultStyle = opts.textComponentProps ? opts.textComponentProps.style : null;
                const customStyle = inheritedStyle(parent);

                return (
                    <TextComponent
                        selectable
                        {...opts.textComponentProps}
                        key={parseInt(index).toString()}
                        style={[defaultStyle, customStyle]}
                    >
                        {entities.decodeHTML(node.data)}
                    </TextComponent>
                );
            }

            if (node.type === 'tag') {
                if (node.name === 'img') {
                    const customStyle = inheritedStyle(node);
                    return <Img key={parseInt(index).toString()} attribs={{ ...node.attribs, ...customStyle }} />;
                }

                let linkPressHandler = null;
                let linkLongPressHandler = null;
                if (node.name === 'a' && node.attribs && node.attribs.href) {
                    linkPressHandler = () => opts.linkHandler(entities.decodeHTML(node.attribs.href));
                    if (opts.linkLongPressHandler) {
                        linkLongPressHandler = () => opts.linkLongPressHandler(entities.decodeHTML(node.attribs.href));
                    }
                }

                let linebreakBefore = null;
                let linebreakAfter = null;
                if (opts.addLineBreaks) {
                    switch (node.name) {
                        case 'pre':
                            linebreakBefore = opts.lineBreak;
                            break;
                        case 'p':
                            if (index < list.length - 1) {
                                linebreakAfter = opts.paragraphBreak;
                            }
                            break;
                        case 'br':
                        case 'h1':
                        case 'h2':
                        case 'h3':
                        case 'h4':
                        case 'h5':
                            linebreakAfter = opts.lineBreak;
                            break;
                        default:
                            break;
                    }
                }

                let listItemPrefix = null;
                if (node.name === 'li') {
                    const defaultStyle = opts.textComponentProps ? opts.textComponentProps.style : null;
                    const customStyle = inheritedStyle(parent);
                    if (parent.name === 'ol') {
                        listItemPrefix = (
                            <TextComponent style={[defaultStyle, customStyle]}>
                                {`${orderedListCounter}. `}
                            </TextComponent>
                        );
                    } else if (parent.name === 'ul') {
                        listItemPrefix = (
                            <TextComponent style={[defaultStyle, customStyle]}>
                                {opts.bullet}
                            </TextComponent>
                        );
                    }
                    if (opts.addLineBreaks && index < list.length - 1) {
                        linebreakAfter = opts.lineBreak;
                    }
                    orderedListCounter += 1;
                }

                const { NodeComponent, styles } = opts;

                return (
                    <NodeComponent
                        {...opts.nodeComponentProps}
                        key={parseInt(index).toString()}
                        onPress={linkPressHandler}
                        style={!node.parent ? styles[node.name] : null}
                        onLongPress={linkLongPressHandler}
                    >
                        {linebreakBefore}
                        {listItemPrefix}
                        {domToElement(node.children, node)}
                        {linebreakAfter}
                    </NodeComponent>
                );
            }
        });
    }

    const handler = new htmlparser.DomHandler(((err, dom) => {
        if (err) done(err);
        done(null, domToElement(dom));
    }));
    const parser = new htmlparser.Parser(handler);
    parser.write(rawHtml);
    parser.done();
}

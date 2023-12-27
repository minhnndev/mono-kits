import React, { PureComponent } from 'react';
import { Dimensions } from 'react-native';
import { get } from 'lodash';
import { Image } from '@momo-kits/core';

const { width: screenWidth } = Dimensions.get('window');

const baseStyle = {
    backgroundColor: 'transparent',
};

export default class AutoSizedImage extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            // set width 1 is for preventing the warning
            // You must specify a width and height for the image %s
            width: props.style.width || 1,
            height: props.style.height || 1,
        };
    }

    componentDidMount() {
    // avoid repaint if width/height is given
        const { style, source } = this.props;
        const styleWidth = get(style, 'width');
        const styleHeight = get(style, 'height');
        if (styleWidth || styleHeight) {
            return;
        }
        if (source.uri) {
            Image.getSize(source.uri, (w, h) => {
                this.setState({ width: w, height: h });
            });
        }
    }

    render() {
        const finalSize = {};
        const { style, source } = this.props;
        const { width, height } = this.state;
        if (width > screenWidth) {
            finalSize.width = screenWidth;
            const ratio = screenWidth / width;
            finalSize.height = height * ratio;
        }
        const imageStyle = Object.assign(
            baseStyle,
            style,
            this.state,
            finalSize
        );
        let imageSource = {};
        if (!finalSize.width || !finalSize.height) {
            imageSource = Object.assign(source, source, this.state);
        } else {
            imageSource = Object.assign(source, source, finalSize);
        }

        return <Image style={imageStyle} source={imageSource} />;
    }
}

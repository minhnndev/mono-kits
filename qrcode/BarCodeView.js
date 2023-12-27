import React from 'react';
import PropTypes from 'prop-types';
import { ViewPropTypes, PixelRatio } from 'react-native';
import { RCTBarCode } from '@momo-kits/core';

const ratio = PixelRatio.get();
function BarCodeView(props) {
    return (
        <RCTBarCode ratio={ratio} {...props} />
    );
}

BarCodeView.propTypes = {
    code: PropTypes.string,
    width: PropTypes.number,
    height: PropTypes.number,
    ratio: PropTypes.number,
    ...ViewPropTypes,
};

export default BarCodeView;

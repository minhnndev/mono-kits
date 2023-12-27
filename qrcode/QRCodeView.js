import React from 'react';
import PropTypes from 'prop-types';
import { ViewPropTypes, PixelRatio, Image } from 'react-native';
import { RCTQRCode } from '@momo-kits/core';

const ratio = PixelRatio.get();
const ic_logo = 'https://img.mservice.io/momo_app_v2/new_version/img/appx_image/ic_momo.png';

function QRCodeView(props) {
    const { showLogo, size = 0 } = props || {};
    return (
        <>
            <RCTQRCode ratio={ratio} {...props} />
            {showLogo
                ? (
                    <Image
                        source={{ uri: ic_logo }}
                        style={{
                            width: size / 6,
                            height: size / 6,
                            position: 'absolute',
                            marginTop: size / 2 - size / 12,
                            marginLeft: size / 2 - size / 12
                        }}
                    />
                ) : null}
        </>

    );
}

QRCodeView.propTypes = {
    code: PropTypes.string,
    size: PropTypes.number,
    ratio: PropTypes.number,
    showLogo: PropTypes.bool,
    ...ViewPropTypes,
};

export default QRCodeView;

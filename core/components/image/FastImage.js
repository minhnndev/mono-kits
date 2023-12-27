/* eslint-disable no-param-reassign */
/* eslint-disable react/display-name */
/* eslint-disable react/jsx-props-no-spreading */
import PropTypes from 'prop-types';
import React, { memo, useMemo, useRef } from 'react';
import { StyleSheet, View, Animated } from 'react-native';
import FastImage from 'react-native-fast-image';
import { isEqual } from 'lodash';
import {
    getTintColor,
    getResizeMode,
    getDefaultSize,
    getWidthHeight,
    getUrl,
    generatePreLoad,
    getImageSource,
    verifyUrl,
    isScale
} from './utils';

const AnimatedImage = Animated.createAnimatedComponent(FastImage);

const TIME_OUT = 350;

const styles = StyleSheet.create({
    img: {
        overflow: 'visible',
    },
    imgs: {
        overflow: 'hidden',
    },
    image: {
        position: 'absolute',
        overflow: 'hidden',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
    },
});

const Image = memo(React.forwardRef(({
    onLoad, onError, thumbDuration, sourceDuration, thumbnail, source, loading, timeCache, placeholder, cached, resizeMode, isShowLoading, tintColor, ...restProps
}, ref) => {
    const { url, isLocalImage } = useMemo(() => getUrl(source, timeCache), [source]);

    if (url === null) return <View />;

    return loading || isShowLoading
        ? (
            <ProgressSiveImage
                progressRef={ref}
                onLoad={onLoad}
                onError={onError}
                thumbDuration={thumbDuration}
                sourceDuration={sourceDuration}
                thumbnail={thumbnail}
                source={source}
                loading={loading}
                timeCache={timeCache}
                placeholder={placeholder}
                cached={cached}
                resizeMode={resizeMode}
                tintColor={tintColor}
                {...restProps}
            />
        )
        : (
            <AnimatedImage
                {...restProps}
                ref={ref}
                style={StyleSheet.flatten([isLocalImage && getDefaultSize(url), restProps.style])}
                fallback={!cached}
                resizeMode={getResizeMode(restProps.style, resizeMode)}
                tintColor={getTintColor(restProps.style, tintColor)}
                source={url}
                onError={onError}
                onLoad={onLoad}
            >
                {restProps.children ? restProps.children : null}
            </AnimatedImage>
        );
}));

const ProgressSiveImage = ({
    progressRef, onLoad, onError, thumbDuration, sourceDuration, thumbnail, source, loading, timeCache, placeholder, cached, resizeMode, isShowLoading, tintColor, ...restProps
}) => {
    const [skeleton, setSkeleton] = React.useState(true);

    const cacheSource = useRef(source);

    const timeOut = useRef(null);

    const { original = '', thumb = '', scale = '' } = verifyUrl(source) || {};

    const { url, isLocalImage } = useMemo(() => getUrl(isScale ? scale : original, timeCache), [source]);

    const [image, setImage] = React.useState(url);

    const imgOpacity = useRef(new Animated.Value(0)).current;

    const thumbOpacity = useRef(new Animated.Value(0)).current;

    React.useEffect(() => {
        if (!isEqual(cacheSource.current, source)) {
            cacheSource.current = source;
            setImage(url);
        }
    }, [JSON.stringify(source)]);

    const onLoadThumbnail = () => {
        Animated.timing(thumbOpacity, {
            toValue: 1,
            duration: thumbDuration || TIME_OUT,
            useNativeDriver: true
        }).start();
    };

    const onLoadImage = () => {
        onLoad?.();
        if (timeOut.current) clearTimeout(timeOut.current);
        timeOut.current = setTimeout(() => {
            setSkeleton(false);
        }, sourceDuration || TIME_OUT);
        Animated.timing(imgOpacity, {
            toValue: 1,
            duration: sourceDuration || TIME_OUT,
            useNativeDriver: true
        }).start();
    };

    const onErrorImage = () => {
        onError?.();
        if (isScale) {
            const { url: originalImg } = getUrl(source, timeCache);
            setImage(originalImg);
        }
    };

    if (image === null) return <View />;

    const placeholderSource = placeholder ? getImageSource(placeholder) : null;

    const thumbnailholder = thumbnail ? getImageSource(thumbnail) : getImageSource(thumb);

    return (
        <View style={StyleSheet.flatten([styles.img])}>
            {
                placeholderSource ? (
                    <Animated.Image
                        resizeMode={getResizeMode(restProps.style, resizeMode)}
                        style={[styles.image, restProps.style]}
                        source={placeholderSource}
                    />
                ) : skeleton ? <View style={[{ ...StyleSheet.absoluteFillObject, overflow: 'hidden', backgroundColor: '#efefef' }, getWidthHeight(restProps.style)]} /> : null
            }

            {
                isLocalImage ? null : skeleton ? (
                    <Animated.Image
                        resizeMode={getResizeMode(restProps.style, resizeMode)}
                        style={[styles.image, { opacity: thumbOpacity }, restProps.style]}
                        source={thumbnailholder}
                        onLoad={onLoadThumbnail}
                        blurRadius={5}
                    />
                ) : null
            }

            <AnimatedImage
                {...restProps}
                ref={progressRef}
                style={StyleSheet.flatten([{ opacity: imgOpacity }, isLocalImage && getDefaultSize(url), restProps.style])}
                fallback={!cached}
                onProgress={() => (!skeleton) && setSkeleton(true)}
                onLoadEnd={() => (skeleton) && setSkeleton(false)}
                onLoad={onLoadImage}
                onError={onErrorImage}
                resizeMode={getResizeMode(restProps.style, resizeMode)}
                tintColor={getTintColor(restProps.style, tintColor)}
                source={image}
            >
                {restProps.children ? restProps.children : null}
            </AnimatedImage>
        </View>
    );
};

Image.preload = (source) => FastImage.preload(generatePreLoad(source));

Image.propTypes = {
    style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
    source: PropTypes.oneOfType([PropTypes.node, PropTypes.shape({
        uri: PropTypes.string,
        cache: PropTypes.oneOf(['immutable', 'web', 'cacheOnly']),
        priority: PropTypes.oneOf(['low', 'normal', 'high']),
        headers: PropTypes.object,
        timeCache: PropTypes.number
    })]),
    resizeMode: PropTypes.oneOf(['contain', 'cover', 'stretch', 'center']),
    onLoadStart: PropTypes.func,
    onProgress: PropTypes.func,
    onLoad: PropTypes.func,
    onError: PropTypes.func,
    onLoadEnd: PropTypes.func,
    cached: PropTypes.bool,
    timeCache: PropTypes.number,
    tintColor: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    children: PropTypes.node,
    loading: PropTypes.bool,
    thumbDuration: PropTypes.number,
    sourceDuration: PropTypes.number,
    thumbnail: PropTypes.any,
    placeholder: PropTypes.any
};

Image.defaultProps = {
    cached: true,
    resizeMode: 'cover'
};

export default Image;

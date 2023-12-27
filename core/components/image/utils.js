import { Image as RNImage, Dimensions } from 'react-native';
import { get, isEmpty } from 'lodash';

const { width } = Dimensions.get('window');
export const setUrlByTime = (uri, time) => `${uri}?time=${time}`;

export const isScale = width < 375;

export const mergeStyle = (style) => (Array.isArray(style) ? style.reduce((obj, item) => {
    if (Array.isArray(item)) return obj = { ...obj, ...mergeStyle(item) };
    return obj = { ...obj, ...item };
}, {}) : style);

export const getUrlByTime = (uri, time) => {
    if (!time) return uri;
    const date = new Date().getTime();
    const miniSecondOfOneDay = 86400000;
    const timeCache = miniSecondOfOneDay * time;
    const avgDate = Math.round((date) / timeCache);
    return setUrlByTime(uri, avgDate);
};

export const getTintColor = (style, tintColor) => get(mergeStyle(style), 'tintColor', tintColor);

export const getResizeMode = (style, resizeMode) => get(mergeStyle(style), 'resizeMode', resizeMode);

export const getDefaultSize = (source) => {
    const size = RNImage.resolveAssetSource(source) || {};
    return { height: get(size, 'height', 30), width: get(size, 'width', 30) };
};

export const getWidthHeight = (style) => ({ ...mergeStyle(style), width: get(mergeStyle(style), 'width', 30), height: get(mergeStyle(style), 'height', 30) });

export const getImageSource = (source, defaultSource) => {
    if (source && typeof source === 'string' && source.startsWith('http')) return { uri: source };
    if (source && (typeof source === 'number' || typeof source === 'object' && typeof source?.uri === 'string' && source?.uri?.startsWith('http'))) return source;
    if (defaultSource) return defaultSource;
    return {};
};

export const checkLocalImage = (source) => typeof source === 'number' || (typeof source?.uri === 'string' && !source?.uri?.startsWith('http'));

export const getUrl = (source, timeCache) => {
    const isLocalImage = checkLocalImage(source);
    let url = null;
    if (isLocalImage) {
        url = source;
    } else if (typeof source?.uri === 'string' && source?.uri?.startsWith('http')) {
        url = { ...source, uri: getUrlByTime(source?.uri, source?.timeCache || timeCache || 7) };
    } else if (typeof source === 'string' && source?.startsWith('http')) {
        url = { uri: getUrlByTime(source, timeCache || 7) };
    } else {
        console.warn('FastImage: Source is not string or object {uri: }', url);
    }
    return { url, isLocalImage };
};

export const getLink = (url) => {
    if (url && typeof url === 'string' && url.startsWith('http')) return url;
    if (url && (typeof url === 'object' && typeof url?.uri === 'string' && url?.uri?.startsWith('http'))) return url.uri;
    return '';
};

export const verifyUrl = (url) => {
    const isLocalImage = checkLocalImage(url);
    if (isLocalImage) {
        return {
            original: url,
            thumb: url,
            scale: url
        };
    }
    const data = {
        original: getLink(url),
        thumb: '',
        scale: ''
    };
    if (isEmpty(url)) return data;
    const link = getLink(url);
    if (isEmpty(link)) return data;
    const nameReg = link?.match(/([^?\/]+)(png|jpg|jpeg)(?=\/?|$)/)?.[0];
    if (isEmpty(nameReg)) return data;
    const spiltName = nameReg.split('.');
    return {
        original: link,
        thumb: link.replace(nameReg, generateLink(spiltName, 'thumbnail')),
        scale: link.replace(nameReg, generateLink(spiltName, '2x'))
    };
};

export const generateLink = (data, key) => {
    const link = [...data];
    link.splice(link.length - 1, 0, key);
    return link.join('.');
};

export const generatePreLoad = (source) => source.map((item) => ({ ...item, uri: getUrlByTime(item.uri, 7) }));

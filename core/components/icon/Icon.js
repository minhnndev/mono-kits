/* eslint-disable no-param-reassign */
/* eslint-disable import/named */
/* eslint-disable react/jsx-props-no-spreading */
import PropTypes from 'prop-types';
import React, {
    memo, useState, useEffect, useRef
} from 'react';
import { StyleSheet, Platform, View } from 'react-native';
import { get, isEqual } from 'lodash';
import Image from '../image/FastImage';
import ResourceManager from '../../resources/ResourceManager';
import { getIconExistedInApp } from './utils';
import { DynamicSize } from '../../utils/ScreenUtils';

const loading = require('./ic_logo_loading.png');

ResourceManager.loadResource('icon');

const styles = StyleSheet.create({
    img: { height: DynamicSize(30), width: DynamicSize(30) },
});
const LOOP = Platform.OS === 'ios' ? 8 : 15;

const useSource = (name) => {
    const [source, setSource] = useState(getIconExistedInApp(name));
    const isRendered = useRef(false);
    const isUnMount = useRef(false);

    useEffect(() => () => {
        isUnMount.current = true;
    }, []);

    useEffect(() => {
        const reloadResource = (count = 0) => {
            if (source === loading && !isUnMount.current) {
                ResourceManager.loadResource('icon');
                if (getIconExistedInApp(name) === loading && count < LOOP) {
                    setTimeout(() => {
                        reloadResource(++count);
                    }, 500);
                } else if (getIconExistedInApp(name) !== loading) {
                    setSource(getIconExistedInApp(name));
                }
            }
        };
        if (!isUnMount.current) reloadResource();
    }, [source]);

    useEffect(() => {
        isRendered.current = true;
        if (isRendered.current && !isEqual(source, getIconExistedInApp(name)) && !isUnMount.current) {
            setSource(getIconExistedInApp(name));
        }
    }, [name]);

    return source;
};

const getWidthHeight = (style) => {
    const mergeStyle = Array.isArray(style) ? style.reduce((obj, item) => obj = { ...obj, ...item }, {}) : style;
    return { width: get(mergeStyle, 'width', DynamicSize(30)), height: get(mergeStyle, 'height', DynamicSize(30)), marginBottom: 0 };
};

const Icon = ({ name, style, ...props }) => {
    const source = useSource(name);
    let tintColor = {};
    if (style && style.tintColor) {
        tintColor = {
            tintColor: style.tintColor
        };
    }
    return source === loading ? <View style={[{ backgroundColor: '#efefef' }, getWidthHeight(style)]} /> : (
        <Image
            {...props}
            {...tintColor}
            style={[styles.img, style]}
            source={source}
        />
    );
};

Icon.propTypes = {
    name: PropTypes.string.isRequired,
    style: PropTypes.oneOfType([PropTypes.object, PropTypes.array])
};

Icon.defaultProps = {
    style: { height: DynamicSize(30), width: DynamicSize(30) }
};

export default memo(Icon);

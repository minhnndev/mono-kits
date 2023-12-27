
/* eslint class-methods-use-this: ["error", { "exceptMethods": ["in", "out", "getAnimations"] }] */
/* eslint no-unused-vars: ["error", { "argsIgnorePattern": "onFinished" }] */

import { Animated } from 'react-native';

// Base Animation class
export default class Animation {
    constructor({
        initialValue = 0,
        useNativeDriver = true,
    }) {
        this.animate = new Animated.Value(initialValue);
        this.useNativeDriver = useNativeDriver;
    }

    in(onFinished) {
        throw Error('not implemented yet');
    }

    out(onFinished) {
        throw Error('not implemented yet');
    }

    getAnimations() {
        throw Error('not implemented yet');
    }
}

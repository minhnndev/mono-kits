/* eslint-disable react/jsx-props-no-spreading */

import React, { Component } from 'react';
import {
    Platform, UIManager, AppState, TextInput
} from 'react-native';
import { MomoTextInputCalculator } from '@momo-kits/core';

const { State: TextInputState } = TextInput;

class CalculatorTextInputBase extends Component {
    constructor(props) {
        super(props);
        this.isFocus = false;
        this._inputRef = null;
    }

    // isFocused() {
    //     return (
    //         TextInputState && TextInputState.currentlyFocusedInput
    //         === findNodeHandle(this._inputRef)
    //     );
    // }

    componentDidUpdate() {
        // This is necessary in case native updates the text and JS decides
        // that the update should be ignored and we should stick with the value
        // that we have in JS.
        const nativeProps = {};
        const { value, selection, selectionState } = this.props;
        if (
            this._lastNativeText !== value
            && typeof value === 'string'
        ) {
            nativeProps.text = value;
        }

        // Selection is also a controlled prop, if the native value doesn't match
        // JS, update to the JS value.

        if (
            this._lastNativeSelection
            && selection
            && (this._lastNativeSelection.start !== selection.start
                || this._lastNativeSelection.end !== selection.end)
        ) {
            nativeProps.selection = selection;
        }

        if (
            Object.keys(nativeProps).length > 0
            && this._inputRef
            && this._inputRef.setNativeProps
        ) {
            this._inputRef.setNativeProps(nativeProps);
        }

        if (selectionState && selection) {
            selectionState.update(selection.start, selection.end);
        }
    }

    componentDidMount() {
        const { value } = this.props;
        this._lastNativeText = value;
        AppState.addEventListener('change', this._handleAppStateChange);
    }

    _handleAppStateChange = (nextAppState) => {
        if (nextAppState === 'background' && Platform.OS === 'android') {
            this.blur();
        }
    };

    componentWillUnmount() {
        if (this._focusSubscription) this._focusSubscription.remove();
        if (this.isFocus) {
            this.blur();
        }
        const tag = this._inputRef;
        if (tag != null && TextInputState && typeof TextInputState.unregisterInput === 'function') {
            TextInputState.unregisterInput(tag);
        }
        if (this._rafId != null) {
            // cancelAnimationFrame(this._rafId);
        }
        AppState.addEventListener('change', this._handleAppStateChange);
    }

    onFocus = (event) => {
        const { onFocus } = this.props;
        this.isFocus = true
        if (onFocus) {
            onFocus(event);
        }
        const tag = this._inputRef;
        if (tag != null && TextInputState) {
            TextInputState.focusTextInput(tag);
        }
    }

    onBlur = (event) => {
        const { onBlur } = this.props;
        this.isFocus = false
        if (onBlur) {
            onBlur(event);
        }
        const tag = this._inputRef;
        if (tag != null && TextInputState) {
            TextInputState.blurTextInput(tag);
        }
    }

    requestFocus = () => {
        this.focus();
        const tag = this._inputRef;
        if (tag != null && TextInputState) {
            TextInputState.focusTextInput(tag);
        }
    }

    onChange = (event) => {
        if (this._inputRef && this._inputRef.setNativeProps) {
            this._inputRef.setNativeProps({
                mostRecentEventCount: event.nativeEvent.eventCount
            });
        }

        const { text } = event.nativeEvent;
        const { onChange, onChangeText } = this.props;
        if (onChange) {
            onChange(event);
        }
        if (onChangeText) {
            onChangeText(text);
        }

        if (!this._inputRef) {
            // calling `this.props.onChange` or `this.props.onChangeText`
            // may clean up the input itself. Exits here.
            return;
        }

        this._lastNativeText = text;
        this.forceUpdate();
    }

    blur() {
        if (this._inputRef && typeof this._inputRef.blur === 'function') {
            this._inputRef.blur();
        }
    }

    focus() {
        if (this._inputRef && typeof this._inputRef.focus === 'function') {
            this._inputRef.focus();
        }
    }

    clear() {
        if (this._inputRef && this._inputRef.setNativeProps) {
            this._inputRef.setNativeProps({ text: '' });
        }
    }

    getText = () => {
        const { value, defaultValue } = this.props;
        if (typeof value === 'string') {
            return value;
        }
        if (typeof defaultValue === 'string') {
            return defaultValue;
        }
        return '';
    }

    render() {
        const props = { ...this.props };
        const { style } = this.props;

        if (Platform.OS === 'android') {
            props.style = [style];
            props.autoCapitalize = UIManager.getViewManagerConfig(
                'AndroidTextInput',
            ).Constants.AutoCapitalizationType[props.autoCapitalize || 'sentences'];
        }

        return (
            <MomoTextInputCalculator
                {...props}
                ref={(ref) => this._inputRef = ref}
                onFocus={this.onFocus}
                onBlur={this.onBlur}
                onChange={this.onChange}
                text={this.getText()}
            />
        );
    }
}

export default CalculatorTextInputBase;

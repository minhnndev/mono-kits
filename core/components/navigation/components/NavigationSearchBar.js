import React, {
    memo, forwardRef, useImperativeHandle, useRef, useEffect, useState
} from 'react';
import {
    Dimensions, View, StyleSheet, Platform
} from 'react-native';
import SearchInput from '../../textInput/searchInput/SearchInput';
import Colors from '../../../colors';
import { isIphoneX } from '../../../utils/ScreenUtils';

const useDimensions = () => {
    const [dimensions, setDimensions] = useState(() => {
        const width = Dimensions.get('window').width;
        if(width > 0) return width;
        return 375
    });

    useEffect(() => {
        const subscription = Dimensions.addEventListener(
            'change',
            ({ window }) => {
                if(window?.width > 0 && Platform.OS === 'android') {
                    setDimensions(window?.width);
                }
            }
        );
        return () => subscription?.remove();
    });
    return dimensions;
};

const NavigationSearchBar = ({
    onChangeText, onFocus, onBlur, onCancel, onSubmitEditing, style, searchStyle, defaultOptions, navigation, textCancel, textCancelStyle, isShowLeft, ...props
}, ref) => {
    const inputRef = useRef(null);
    const width = useDimensions();

    const onCloseAction = () => {
        navigation && navigation.setOptions(defaultOptions);
        onCancel && onCancel({ navigation, defaultOptions });
    };

    useImperativeHandle(ref, () => inputRef.current);

    return (
        <View style={[styles.container, { width }, isShowLeft && { width: width - 40 }, style]}>
            <SearchInput
                ref={inputRef}
                {...props}
                style={[styles.input, searchStyle]}
                iconStyle={styles.iconStyle}
                onSubmitEditing={onSubmitEditing}
                onChangeText={onChangeText}
                onFocus={onFocus}
                onBlur={onBlur}
                onCancel={onCancel && !isShowLeft ? onCloseAction : null}
                textCancelStyle={textCancelStyle}
                textCancel={textCancel}
            />
        </View>
    );
};

export default memo(forwardRef(NavigationSearchBar));

const styles = StyleSheet.create({
    iconStyle: {
        height: isIphoneX() ? 20 : Platform === 'ios' ? 18 : 24,
        width: isIphoneX() ? 20 : Platform === 'ios' ? 18 : 24,
    },
    input: {
        flex: 1,
        height: isIphoneX() ? 32 : Platform === 'ios' ? 30 : 36,
        backgroundColor: 'white',
        borderRadius: 18,
        borderWidth: 0.5,
        borderColor: Colors.borders,
    },
    btnClose: { marginLeft: 16, },
    txtClose: { color: 'white' },
    container: {
        flex: 1,
        // flexDirection: 'row',
        paddingHorizontal: 16,
        alignItems: 'center',
        justifyContent: 'center'
    },
});

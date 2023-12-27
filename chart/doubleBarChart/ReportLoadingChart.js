import React from 'react';
import { StyleSheet, ActivityIndicator } from 'react-native';
import { ScaleSize } from '@momo-kits/core';

const ReportLoadingChart = (props, ref) => {
    const { style } = props || {};
    return (
        <ActivityIndicator
            ref={ref}
            style={[style, styles.container]}
            size={'large'}
        />
    );
};

export default React.memo(React.forwardRef(ReportLoadingChart));

const styles = StyleSheet.create({
    container: {
        height: ScaleSize(300),
    },
});

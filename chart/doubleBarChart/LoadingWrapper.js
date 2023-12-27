import React from 'react';
import { View } from 'react-native';
import ReportEmptyChart from './ReportEmptyChart';
import ReportLoadingChart from './ReportLoadingChart.js';

const LoadingWrapper = (
    {
        onLayout,
        style,
        dataSource,
        isEmpty,
        children,
        viewRef,
        EmptyComponent = ReportEmptyChart,
        LoadingComponent = ReportLoadingChart,
    },
    ref,
) => {
    if (dataSource === null || dataSource === undefined) {
        return <LoadingComponent onLayout={onLayout} ref={ref} />;
    } else if (dataSource?.length == 0 || isEmpty === true) {
        return <EmptyComponent onLayout={onLayout} ref={ref} />;
    } else if (onLayout || style) {
        return (
            <View style={style} onLayout={onLayout} ref={ref}>
                {children}
            </View>
        );
    } else {
        return children;
    }
};
export default React.memo(React.forwardRef(LoadingWrapper));

import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Text, Spacing } from '@momo-kits/core';
import ChartContainer from './ChartContainer';
import DotChart from './DotChart';
import PropTypes from 'prop-types';

const ComparisonChart = props => {
    const {
        data = [],
        onPressColumn = () => null,
        styleChartContainer = {},
        showSuffix = true,
        suffix = '',
        unit = 1,
        keyRenderValueUp = '',
        keyRenderValueDown = '',
        keyRenderTitle = '',
        colorUp = '',
        colorDown = '',
        nameValueUp= '',
        nameValueDown= '',
        titleChart='',
        isShowDots,
        styleTitleChart,
        styleDots,
        activeIndex
    } = props || {};

    const [arrUp, setArrUp] = useState([]);
    const [arrDown, setArrDown] = useState([]);

    useEffect(() => {
        let valuesUpByKey = [];
        let valuesDownByKey = [];

        for (let i = 0; i < data?.length; i++) {
            const valueUp = data?.[i]?.[keyRenderValueUp] || 0;
            const valueDown = data?.[i]?.[keyRenderValueDown] || 0;
            const valueTitle = data?.[i]?.[keyRenderTitle] || '';
            // const selected = data?.[i]?.selected || false ;
            valuesUpByKey.push({
                title: valueTitle,
                number: valueUp,
                // selected
            });
            valuesDownByKey.push({
                title: valueTitle,
                number: valueDown,
                // selected
            });
        }
        setArrUp(valuesUpByKey);
        setArrDown(valuesDownByKey);
    }, [data]);

    const handleColumnPress = (value) => {
        const {list1 = [], list2 = [], index = -1} = value || {};
        onPressColumn(data?.[index], index);
    }

    return (
        <View>
            { titleChart ? (
                <Text.Title style={[styles.titleChart, styleTitleChart]} weight="bold">
                    {titleChart}
                </Text.Title>
            ) : null }

            { isShowDots ? (
                <View style={[styles.dotsContainer, styleDots]}> 
                    <DotChart dotColor={colorUp} name={nameValueUp} />
                    <DotChart dotColor={colorDown} name={nameValueDown} />
                </View>
            ): null }
            
            <ChartContainer
                activeIndex={activeIndex}
                colorUp={colorUp}
                colorDown={colorDown}
                showSuffix={showSuffix}
                data={arrUp}
                data2={arrDown}
                style={[styles.chartContainer, styleChartContainer]}
                suffix={suffix}
                unit={unit}
                onPressColumn={handleColumnPress}
            />
        </View>
    );
};


const styles = StyleSheet.create({
    chartContainer: {
        // marginBottom: Spacing.L,
    },
    titleChart: {
        fontWeight: 'bold',
        marginVertical: Spacing.S,
    },
    dotsContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        flexWrap: 'wrap'
    },
    
});

ComparisonChart.propTypes = {
    data : PropTypes.array,
    onPressColumn :PropTypes.func,
    styleChartContainer :PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
    showSuffix:PropTypes.bool,
    suffix :PropTypes.string,
    unit:PropTypes.number,
    keyRenderValueUp :PropTypes.string,
    keyRenderValueDown :PropTypes.string,
    keyRenderTitle :PropTypes.string,
    colorUp :PropTypes.string,
    colorDown :PropTypes.string,
    nameValueUp: PropTypes.string,
    nameValueDown: PropTypes.string,
    titleChart: PropTypes.string,
    isShowDots: PropTypes.bool,
    styleTitleChart: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
    styleDots: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
    activeIndex: PropTypes.number,
};

ComparisonChart.defaultProps = {
    data : [],
    showSuffix : true,
    unit :1,
    isShowDots :  true,
};


export default ComparisonChart;
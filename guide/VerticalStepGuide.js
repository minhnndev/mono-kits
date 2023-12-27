import PropTypes from 'prop-types';
import React from 'react';
import {
    View, StyleSheet, FlatList
} from 'react-native';
import StepGuideItem from './StepGuideItem';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10
    },
    guideItem: {
        paddingBottom: 8
    }
});

export default class VerticalStepGuide extends React.PureComponent {
    renderItem = ({ item, index }) => {
        const {
            data, itemProps, lineType, directionLine, renderCustomIcon, type, activeIndex, lineProps, useNativeImage, onLinkPress
        } = this.props;
        const lastItem = index === data.length - 1;
        let renderCustomIconItem = () => { };
        if (typeof renderCustomIcon === 'function') {
            renderCustomIconItem = () => renderCustomIcon(itemProps, index);
        }

        return (
            <StepGuideItem
                lineProps={lineProps}
                activeIndex={activeIndex}
                style={styles.guideItem}
                renderCustomIcon={renderCustomIconItem}
                onLinkPress={onLinkPress}
                {...itemProps}
                useNativeImage={useNativeImage}
                itemIndex={index}
                lineType={lineType}
                type={type}
                hideLine={lastItem}
                source={item.source}
                title={item.title}
                contents={item.contents}
                directionLine={directionLine}
            />
        );
    }

    keyEx = (_, index) => `vertical-guideline-${index}`

    render() {
        const {
            data, containerStyle, itemProps, ...rest
        } = this.props;
        if (!Array.isArray(data)) return <View />;
        return (
            <View style={[styles.container, containerStyle]}>
                <FlatList
                    {...rest}
                    data={data}
                    renderItem={this.renderItem}
                    keyExtractor={this.keyEx}
                />
            </View>
        );
    }
}

VerticalStepGuide.defaultProps = {
    scrollEnabled: false,
    showsVerticalScrollIndicator: false,
    activeIndex: -1,
    lineProps: {}
};

VerticalStepGuide.propTypes = {
    activeIndex: PropTypes.number,
    data: PropTypes.arrayOf(
        PropTypes.shape({
            contents: PropTypes.array,
            source: PropTypes.shape({
                uri: PropTypes.string
            }),
            title: PropTypes.string
        })
    ),
    type: PropTypes.oneOf(['number', 'default']),
    itemProps: PropTypes.object,
    showsVerticalScrollIndicator: PropTypes.bool,
    scrollEnabled: PropTypes.bool,
    lineProps: PropTypes.object,
    lineType: PropTypes.oneOf(['solid', 'dash']),
    directionLine: PropTypes.oneOf(['horizontal', 'vertical'])
};

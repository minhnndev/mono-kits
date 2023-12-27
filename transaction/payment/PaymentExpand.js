import React from 'react';
import {
    LayoutAnimation,
    Platform,
    UIManager,
    StyleSheet,
    TouchableOpacity,
    View,
} from 'react-native';
import {
    Spacing, Colors, Icon, Text
} from '@momo-kits/core';
import Line from '@momo-kits/separator';

import CommonUtils from '../utils/CommonUtils';
import I18n from '../utils/I18n';
import ExtraList from '../components/ExtraList';

const FONT_WEIGHT_BOLD = CommonUtils.getFontWeightMedium();
const ANIMATION_TYPE = LayoutAnimation.Presets.easeInEaseOut;

if (Platform.OS === 'android') {
    if (UIManager.setLayoutAnimationEnabledExperimental) {
        UIManager.setLayoutAnimationEnabledExperimental(true);
    }
}

const PaymentExpand = (props) => {
    const {
        data,
        expanded,
        onChange,
        renderCollapsedContent,
        isLoading
    } = props || {};

    const onPress = () => {
        LayoutAnimation.configureNext(ANIMATION_TYPE);
        typeof onChange === 'function' && onChange(data);
    };

    const getIcon = () => (expanded ? 'arrow_chevron_up_small' : 'arrow_chevron_down_small');

    const getTitle = () => (expanded ? I18n.textExpanded : I18n.textCollaped);

    const _renderCollapsedContent = () => {
        if (!expanded) {
            return (
                <Line
                    color={Colors.black_04}
                    thickness={1}
                    style={styles.divider}
                />
            );
        }

        if (typeof renderCollapsedContent === 'function') {
            return renderCollapsedContent(data);
        }

        return (
            <ExtraList data={data} />
        );
    };

    const renderBtnExpand = () => (!isLoading ? (
        <TouchableOpacity onPress={onPress} style={styles.content} disabled={isLoading}>
            <Text.Title style={styles.title}>{getTitle()}</Text.Title>
            <Icon name={getIcon()} style={styles.icon} />
        </TouchableOpacity>
    ) : <View style={styles.loading} />);

    return (
        <>
            {_renderCollapsedContent()}
            {renderBtnExpand()}
        </>
    );
};

const styles = StyleSheet.create({
    content: {
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        paddingTop: Spacing.ZERO,
        paddingBottom: Spacing.M
    },
    title: {
        color: Colors.pink_05_b,
        fontWeight: FONT_WEIGHT_BOLD,
    },
    icon: {
        height: 24,
        width: 24,
        tintColor: Colors.pink_05_b,
    },
    link: {
        color: Colors.link,
    },
    divider: {
        marginBottom: Spacing.S
    },
    loading: {
        height: Spacing.M * 2
    }
});

export default React.memo(PaymentExpand);

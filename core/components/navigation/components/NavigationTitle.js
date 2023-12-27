import React from 'react';
import { StyleSheet, View } from 'react-native';
import Text from '../../typography';
import Image from '../../image/FastImage';
import Colors from '../../../colors';

const NavigationTitle = ({
    avatar,
    title,
    subTitle,
    titleStyle,
    subTitleStyle,
    ...props
}) => (
    <View style={styles.container}>
        {avatar && <Image style={styles.viewInfo} source={avatar} {...props} />}
        <View>
            <Text.Title
                weight="medium"
                color={Colors.black_17}
                style={titleStyle}>
                {title}
            </Text.Title>
            {subTitle && (
                <Text.SubTitle style={subTitleStyle} color={Colors.black_12}>
                    {subTitle}
                </Text.SubTitle>
            )}
        </View>
    </View>
);

export default NavigationTitle;

const styles = StyleSheet.create({
    viewInfo: {
        marginRight: 12,
        height: 38,
        width: 38,
        borderRadius: 38 / 2,
    },
    container: { flexDirection: 'row', alignItems: 'center' },
});

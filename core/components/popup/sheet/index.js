import PropTypes from 'prop-types';
import React from 'react';
import {
     StyleSheet, Dimensions, View, 
} from 'react-native';
import { ifIphoneX } from '../../../utils/ScreenUtils';
import Colors from '../../../colors';
import Text from '../../typography';
import Image from '../../image/FastImage';
import Spacing from '../../../spacing';
import Icon from '../../icon/Icon';
import Radius from '../../../radius';
import TouchableOpacity from '../../touchableOpacity/TouchableOpacity';
import { serviceFooter, serviceHeader } from './data';
const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
     container: {
          backgroundColor: 'white',
          borderTopLeftRadius: Radius.M,
          borderTopRightRadius: Radius.M,
          paddingVertical: Spacing.S,
          paddingBottom: ifIphoneX(48, 25),
          maxHeight: Dimensions.get('window').height * 0.66,
          minHeight: Dimensions.get('window').height * 0.33
     },

     header: {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingHorizontal: Spacing.L,
          marginBottom: Spacing.S
     },
     headerRow: { flexDirection: 'row', alignItems: 'center' },
     headerIcon: { height: 44, width: 44, resizeMode: 'contain', marginRight: Spacing.M },
     headerClose: { height: 24, width: 24, tintColor: Colors.black_17 },
     title: {
          color: '#222222',
          fontWeight: 'bold'
     },
     body: {
          flexDirection: 'row',
          alignItems: 'center', flexWrap: 'wrap',
          marginHorizontal: Spacing.L,
          paddingTop: Spacing.S,
          marginBottom: Spacing.S
     },
     iconText: {
          width: width / 4 - Spacing.L / 2,
          minHeight: 92,
          marginTop: Spacing.M,
          alignItems: 'center',
          justifyContent:'center'
     },
     iconContainter: {
          width: width / 12 + 5,
          height: width / 12 + 5,
          backgroundColor: Colors.black_02,
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: Radius.S
     },
     title: {
          marginTop: Spacing.XS,
          minHeight: 35,
          maxWidth: width / 5 - Spacing.L / 3,
          textAlign: 'center',
     },
     image: {
          width: width / 12,
          height: width / 12,
     },
});


const Header = ({ title, subTitle, icon, onPressClose }) => {
     return (
          <View style={styles.header}>
               <View style={styles.headerRow}>
                    <Image source={icon}
                         style={styles.headerIcon} />
                    <View style={{ justifyContent: 'center' }}>
                         <Text.Title color={Colors.black_17} weight='bold'>{title}</Text.Title>
                         {
                              subTitle && <Text.SubTitle color={Colors.black_12}>{subTitle}</Text.SubTitle>
                         }
                    </View>
               </View>
               <TouchableOpacity onPress={onPressClose}>
                    <Icon name='24_navigation_close' style={styles.headerClose} />
               </TouchableOpacity>
          </View>
     )
};

const Body = ({ services = [], extendServices = [], onPressClose }) => {
     const serviceDefault = [...serviceHeader, ...extendServices, ...serviceFooter];
     return (
          <View style={styles.body}>
               {
                    serviceDefault.map((item, index) => {
                         const existService = services.find(ser => ser.id === item.id);
                         const existExtend = extendServices.find(ser => ser.id === item.id);
                         return (existService || existExtend) ? (
                              <TouchableOpacity key={`${item.code}-${index}`} style={styles.iconText} onPress={() => {
                                   onPressClose?.();
                                   existService?.callback?.() || existExtend?.callback?.()
                              }}>
                                   <View style={styles.iconContainter}>
                                        <Image style={styles.image} tintColor={Colors.black_12} 
                                        source={item.icon[existService?.status || existExtend?.status || item?.status]} />
                                   </View>

                                   <Text.SubTitle style={styles.title} numberOfLines={3}>
                                        {item.title[existService?.status || existExtend?.status || item?.status]}
                                   </Text.SubTitle>
                              </TouchableOpacity>
                         ) : null
                    })
               }
          </View>
     )
};

const Sheet = ({ title, subTitle, icon, services, onClosed, requestClose, extendServices, style }) => {
     const onPressClose = () => {
          onClosed?.();
          requestClose?.();
     };

     return (
          <View style={[styles.container, style]}>
               <Header title={title} subTitle={subTitle} icon={icon} onPressClose={onPressClose} />
               <View style={{width: '100%', height: 1, backgroundColor: Colors.very_light_pink_two}} />
               <Body services={services} extendServices={extendServices} onPressClose={onPressClose} />
          </View>
     )
}

Sheet.propTypes = {
     title: PropTypes.string,
     subTitle: PropTypes.string,
     icon: PropTypes.any,
     services: PropTypes.array,
     onClosed: PropTypes.func,
     extendServices: PropTypes.array,
     style: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
};

export default Sheet;
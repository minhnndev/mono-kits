import {Platform} from 'react-native';
import Colors from '../colors';

export default {
  Dark: Platform.select({
    ios: {
      shadowColor: Colors.black_17,
      shadowOffset: {
        width: 2,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 10,
    },
    android: {
      shadowColor: Colors.black_20,
      shadowOffset: {
        width: 0,
        height: 3,
      },
      shadowOpacity: 0.29,
      shadowRadius: 4.65,

      elevation: 7,
    },
  }),

  Light: Platform.select({
    ios: {
      shadowColor: Colors.black_17,
      shadowOffset: {
        width: 2,
        height: 2,
      },
      shadowOpacity: 0.07,
      shadowRadius: 10,
    },
    android: {
      shadowColor: Colors.black_10,
      shadowOffset: {
        width: 1,
        height: 3,
      },
      shadowOpacity: 0.29,
      shadowRadius: 4.65,

      elevation: 6,
    },
  }),
};


import { isIphoneX } from '../utils/ScreenUtils';
import Spacing from '../spacing';

export const iphoneXStyle = isIphoneX() ? {
    paddingBottom: Spacing.iphone_X_margin_bottom,
    flex: 1,
} : {
    flex: 1
};

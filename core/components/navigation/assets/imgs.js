import { NativeModules } from 'react-native';
import ResouceManager from '../../../resources/ResourceManager';
import ValueUtil from '../../../utils/ValueUtil';

ResouceManager.loadResource('navigationBar');

const headerBar = NativeModules?.RNResource?.navigationBar
    ? ValueUtil.parseData(NativeModules?.RNResource?.navigationBar)
          ?.headerBar ||
      'https://cdn.mservice.com.vn/app/img/kits/background/header/bg_header.png'
    : 'https://cdn.mservice.com.vn/app/img/kits/background/header/bg_header.png';

const imgs = {
    bg_header: headerBar,
    ic_back_android:
        'https://img.mservice.io/momo_app_v2/new_version/img/appx_icon/ic_back_android.png',
    ic_back_ios:
        'https://img.mservice.com.vn/momo_app_v2/new_version/img/appx_icon/ic_back_ios.png',
};
export default imgs;

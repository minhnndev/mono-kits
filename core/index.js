import { CameraKitCamera } from 'react-native-camera-kit';
import LinearGradient from 'react-native-linear-gradient';
import FastImage from 'react-native-fast-image';
import Progress from 'react-native-progress';
import * as NavigationRouters from '@react-navigation/routers';
import * as NavigationCore from '@react-navigation/core';
import * as NavigationBottomTabs from '@react-navigation/bottom-tabs';
import * as NavigationNative from '@react-navigation/native';
import * as NavigationStack from '@react-navigation/stack';
import MarkerView from '@react-native-community/masked-view';
import Art from '@react-native-community/art';
import * as SafeAreaContext from 'react-native-safe-area-context';
import RNScreen from 'react-native-screens';
import * as RNGestureHandler from 'react-native-gesture-handler';
import ViewPager from 'react-native-pager-view';
import Modal from './components/animationModal/Modal';
import BottomModal from './components/animationModal/BottomModal';
import Colors from './colors';
import Button from './components/button/Button';
import Input from './components/textInput';
import Navigation from './components/navigation';
import {
    NavigationButton,
    NavigationBackButton,
    NavigationBar,
    AnimatedHeaderRight,
} from './components/navigation/components';
import Icon from './components/icon/Icon';
import { Icons as IconSource } from './icons';
import KeyboardCalculator from './components/keyboard';
import Text from './components/typography';
import Flex from './components/layout/flex/Flex';
import Popup from './components/popup/index';
import BottomPopupHeader from './components/popup/header/BottomPopupHeader';
import Image from './components/image/FastImage';
import ResourceManager from './resources/ResourceManager';
import LocalizedStrings from './components/language/Language';
import NumberKeyboard from './components/popup/keyboard/NumberKeyboard';
import TouchableOpacity from './components/touchableOpacity/TouchableOpacity';
import ApplicationStyle from './applicationStyle';
import { RFValueHorizontal as ScaleSize } from './components/typography/reponsiveSize';
import Spacing from './spacing';
import Radius from './radius';
import NumberUtils from './utils/NumberUtils';
import DatetimeUtil from './utils/DatetimeUtil';
import DeviceUtils from './utils/DeviceUtils';
import ScreenUtils from './utils/ScreenUtils';
import StyleConfig from './utils/StyleConfig';
import ValueUtil from './utils/ValueUtil';
import SwitchLanguage from './components/language/SwitchLanguage';
import { Keys } from './components/keyboard/Keys';
import {
    RCTBarCode,
    RCTQRCode,
    RCTCodeScannerConfig,
    RCTCodeScannerConstants,
    RCTCodeScannerCommands,
    RCTCodeScannerView,
    MomoTextInputCalculator,
    FaceDetectNativeView,
    FaceDetectCommands,
    CameraXNativeView,
    CameraXCommands,
    CameraXConstants,
    RCTCocosView,
    RCTCocosViewCommands,
} from './components/native';
import LottieView from 'lottie-react-native';
import * as D3Shape from 'd3-shape';
import * as HtmlParser from 'htmlparser2-without-node-native';
import Entities from 'entities';
import WebView from '@momo-kits/webview';
import ImageZoom from 'react-native-image-pan-zoom';
import Observer from './observer/Observer';
import Modalize from './components/modalize';
import BottomDrawer from './components/popup/sheet';
import BottomTab from './components/bottomTab';

Modal.BottomModal = BottomModal;

export {
    BottomDrawer,
    Modalize,
    Observer,
    ImageZoom,
    WebView,
    Entities,
    HtmlParser,
    LottieView,
    Popup,
    D3Shape,
    Keys,
    CameraKitCamera,
    SwitchLanguage,
    BottomModal,
    BottomPopupHeader,
    Button,
    Colors,
    Flex,
    Icon,
    IconSource,
    Image,
    Input,
    KeyboardCalculator,
    LocalizedStrings,
    Modal,
    Navigation,
    NavigationButton,
    NavigationBackButton,
    NavigationBar,
    NumberKeyboard,
    ResourceManager,
    Text,
    TouchableOpacity,
    ApplicationStyle,
    ScaleSize,
    Spacing,
    Radius,
    LinearGradient,
    NumberUtils,
    DatetimeUtil,
    DeviceUtils,
    ScreenUtils,
    StyleConfig,
    ValueUtil,
    FastImage,
    Progress,
    NavigationRouters,
    NavigationCore,
    NavigationBottomTabs,
    NavigationNative,
    NavigationStack,
    MarkerView,
    Art,
    SafeAreaContext,
    RNScreen,
    RNGestureHandler,
    ViewPager,
    RCTBarCode,
    RCTQRCode,
    RCTCodeScannerConfig,
    RCTCodeScannerConstants,
    RCTCodeScannerCommands,
    RCTCodeScannerView,
    MomoTextInputCalculator,
    AnimatedHeaderRight,
    FaceDetectNativeView,
    FaceDetectCommands,
    CameraXNativeView,
    CameraXCommands,
    CameraXConstants,
    RCTCocosView,
    RCTCocosViewCommands,
    BottomTab,
};

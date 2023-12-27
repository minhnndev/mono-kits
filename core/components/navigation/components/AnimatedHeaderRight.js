import {Icon, Image, Observer} from '../../../index';
import PropTypes from 'prop-types';
import React, {Component} from 'react';
import icons from '../../icon/cached_images.json';
import {Animated, Easing, TouchableOpacity, View} from 'react-native';
import Colors from '../../../colors';
import Spacing from '../../../spacing';

const LIST_TOOL = ['share', 'addFavorite', 'addShortcut'];
const ADD_FAVORITE_SCHEMA = 'observerToolkit_addFavorite';
const REMOVE_FAVORITE_SCHEMA = 'observerToolkit_removeFavorite';

export default class RightHeader extends Component {
  constructor(props) {
    super(props);
    const {appCode} = props;
    const observerToolkitSchemaAddFavorite = `${ADD_FAVORITE_SCHEMA}_${appCode}`;
    const observerToolkitSchemaRemoveFavorite = `${REMOVE_FAVORITE_SCHEMA}_${appCode}`;
    this.animated = new Animated.Value(0);
    this.state = {
      isLoading: false,
      isShowUtilityTool: false,
    };
    this.utilityToolRef = React.createRef();
    this.seeMoreRef = React.createRef();
    this.toolkitObserverAddFavorite = Observer?.getInstance(
      observerToolkitSchemaAddFavorite,
    );
    this.toolkitObserverRemoveFavorite = Observer?.getInstance(
      observerToolkitSchemaRemoveFavorite,
    );
  }

  observerAddFavoriteCallback = data => {
    if (data?.status) {
      this.setState({isShowUtilityTool: false});
    }
  };

  observerRemoveFavoriteCallback = data => {
    if (data?.status) {
      this.setState({isShowUtilityTool: true});
    }
  };

  componentDidMount() {
    const {utilityToolConfig} = this.props;
    if (typeof utilityToolConfig?.hidden === 'boolean') {
      this.setState({isShowUtilityTool: !utilityToolConfig?.hidden});
    }
    if (utilityToolConfig?.type === 'addFavorite') {
      this.toolkitObserverAddFavorite?.attach(this.observerAddFavoriteCallback);
      this.toolkitObserverRemoveFavorite?.attach(
        this.observerRemoveFavoriteCallback,
      );
    }
  }

  runAnimation() {
    if (this.animated) {
      const {isLoading} = this.state;
      this.animated.setValue?.(0);
      Animated.timing(this.animated, {
        toValue: 4,
        duration: 1100,
        easing: Easing.linear,
        useNativeDriver: true,
      }).start(o => {
        if (o.finished && isLoading) {
          this.runAnimation();
        }
      });
    }
  }

  setLoading = isLoading => {
    this.setState(
      {
        isLoading,
      },
      () => this.runAnimation(),
    );
  };

  showMore = () => {
    const {onAction} = this.props;
    onAction?.();
  };

  onClose = () => {
    const {onClose, utilityToolConfig} = this.props;
    if (typeof utilityToolConfig?.onClose === 'function') {
      utilityToolConfig?.onClose(onClose);
    } else {
      onClose?.();
    }
  };

  onUtilityToolPress = () => {
    const {onUtilityToolAction} = this.props;
    onUtilityToolAction?.();
  };

  renderSeeMore() {
    const {tintColor = Colors.white} = this.props;
    return (
      <View style={styles.wrapperDot}>
        <TouchableOpacity
          ref={this.seeMoreRef}
          onPress={this.showMore}
          style={styles.wrapperDotContent}
          hitSlop={{
            top: 10,
            right: 10,
            left: 10,
            bottom: 10,
          }}>
          <Icon
            name="navigation_more_horiz"
            style={[styles.iconDot, {tintColor}]}
          />
        </TouchableOpacity>
      </View>
    );
  }

  renderUtilityTool() {
    const {
      utilityToolConfig = {},
      buttonStyle,
      tintColor = Colors.white,
    } = this.props;
    const {type} = utilityToolConfig;

    if (!this.state.isShowUtilityTool || !LIST_TOOL.includes(type)) {
      return <View />;
    }
    return (
      <TouchableOpacity
        onPress={this.onUtilityToolPress}
        ref={this.utilityToolRef}
        style={[styles.toolWrap, buttonStyle]}>
        <Image
          source={{uri: icons[type].uri}}
          style={[styles.toolIcon, {tintColor}]}
        />
      </TouchableOpacity>
    );
  }

  render() {
    const {style, buttonStyle, tintColor = Colors.white} = this.props;
    return (
      <View style={[styles.container, style]}>
        {this.renderUtilityTool()}
        <View style={[styles.headerRight, buttonStyle]}>
          {this.renderSeeMore()}
          <View style={styles.separator} />
          <TouchableOpacity onPress={this.onClose} style={styles.closeButton}>
            <Icon
              name="16_navigation_close_circle"
              style={[styles.iconClose, {tintColor}]}
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

RightHeader.propTypes = {
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  buttonStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  tintColor: PropTypes.string,
  onAction: PropTypes.func,
  onClose: PropTypes.func,
};

const styles = {
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    marginLeft: 20,
  },
  wrapperDot: {
    width: '50%',
    justifyContent: 'center',
  },
  wrapperDotContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dot: {
    width: 4,
    height: 4,
    marginHorizontal: 1.5,
  },
  headerRight: {
    borderRadius: 14,
    backgroundColor: 'rgba(8, 16, 29, 0.4)',
    flexDirection: 'row',
    alignItems: 'center',
    width: 57,
    height: 28,
    marginRight: Spacing.S,
  },
  closeButton: {
    width: '50%',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  },
  iconClose: {
    width: 20,
    height: 20,
  },
  iconDot: {
    width: 20,
    height: 20,
  },
  toolWrap: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(8, 16, 29, 0.4)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  separator: {
    height: 12,
    width: 0.5,
    backgroundColor: '#fff',
  },
  toolIcon: {
    width: 18,
    height: 18,
  },
};

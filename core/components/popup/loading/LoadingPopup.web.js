import React from 'react';
import {
    StyleSheet,
    Dimensions,
    View,
    Platform,
    Image,
    ActivityIndicator
} from 'react-native';
import PropTypes from 'prop-types';
import { isEmpty } from 'lodash';
import { Icons } from '../../../icons';
import Text from '../../typography';
import SwitchLanguage from '../../language/SwitchLanguage';

const widthScreen = Dimensions.get('window').width;
const heightScreen = Dimensions.get('window').height;
const LOADING_WIDTH = 60;
const ICON_WIDTH = 32;
const DELAY_CLOSE = 600;
export default class LoadingPopup extends React.Component {
    static animated = true

    constructor(props) {
        super(props);
        this.state = {
            doneLoading: false,
        };
    }

    componentDidMount() {
        const { timeout } = this.props;
        if (timeout) {
            this.timeout = setTimeout(() => {
                this.performDoneLoading();
            }, timeout);
        }
    }

    componentWillUnmount() {
        clearTimeout(this.timeout);
    }

    delayClose = (callback) => {
        setTimeout(() => {
            callback();
        }, (DELAY_CLOSE));
    }

    close = () => {
        const { requestClose } = this.props;
        typeof requestClose === 'function' && requestClose();
    }

    hideLoading = () => {
        this.delayClose(() => {
            this.close();
        });
    }

    doneLoading = () => {
        this.delayClose(() => {
            this.performDoneLoading();
        });
    }

    performDoneLoading = () => {
        this.setState({
            doneLoading: true,
        }, () => {
            setTimeout(() => {
                this.close();
            }, Platform.OS === 'ios' ? 400 : 550);
        });
    }

    renderLoading() {
        const {
            icon, color, size, iconStyle
        } = this.props;
        const iconViewStyle = {
            width: size || LOADING_WIDTH,
            height: size || LOADING_WIDTH
        };
        const innerIconStyle = {
            width: (size * ICON_WIDTH) / LOADING_WIDTH,
            height: (size * ICON_WIDTH) / LOADING_WIDTH,
        };
        return (
            <View style={iconViewStyle}>
                <ActivityIndicator
                    size={size || LOADING_WIDTH}
                    spinDuration={2500}
                    indeterminate
                    color={color}
                />
                {
                    icon ? (
                        <View style={[styles.iconVIew, iconViewStyle]}>
                            <Image
                                style={[innerIconStyle, iconStyle]}
                                source={icon}
                            />
                        </View>
                    ) : null
                }
            </View>

        );
    }

    renderText() {
        const { title } = this.props;
        if (isEmpty(title)) return null;
        if (typeof title === 'string' || title?.vi) {
            const text = SwitchLanguage.getLocalize(title);
            return (<Text style={styles.title}>{text}</Text>);
        }
        return title;
    }

    renderSubText() {
        const { subTitle } = this.props;
        if (isEmpty(subTitle)) return null;
        if (typeof subTitle === 'string' || subTitle?.vi) {
            const text = SwitchLanguage.getLocalize(subTitle);
            return (<Text style={styles.subTitle}>{text}</Text>);
        }
        return subTitle;
    }

    render() {
        const { doneLoading } = this.state;
        const { showDone } = this.props;
        return (
            <View style={styles.container}>
                {
                    doneLoading === true && showDone
                        ? (
                            <Image
                                resizeMode="contain"
                                source={Icons.ic_success_process_white}
                            />
                        )
                        : this.renderLoading()
                }
                {
                    this.renderText()
                }
                {
                    this.renderSubText()
                }
            </View>
        );
    }
}

LoadingPopup.propTypes = {
    title: PropTypes.any,
    subTitle: PropTypes.any,
    icon: PropTypes.any,
    showDone: PropTypes.bool,
    timeout: PropTypes.number,
    color: PropTypes.string,
    size: PropTypes.number
};

LoadingPopup.defaultProps = {
    color: 'white',
    showDone: false,
    size: 60
};

let styles = StyleSheet.create({
    container: {
        width: widthScreen,
        height: heightScreen,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'transparent'
    },
    title: {
        color: 'white',
        marginTop: 20,
        textAlign: 'center',
        backgroundColor: 'transparent'
    },
    subTitle: {
        color: 'white',
        marginTop: 20,
        textAlign: 'center',
        backgroundColor: 'transparent'
    },
    innerLoadingIcon: {
        width: ICON_WIDTH,
        height: ICON_WIDTH,
    },
    iconVIew: {
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center'
    }
});

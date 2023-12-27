import React, { Component } from 'react';
import {
    ScrollView
} from 'react-native';

class ScrollCustom extends Component {
    constructor(props) {
        super(props);
        const { scrollEnabled } = this.props;
        this.scrollEnabled = scrollEnabled;
        this.state = {
            scrollEnabled: this.scrollEnabled
        };
    }

    scrollTo(event) {
        if (event && this.ScrollView && this.ScrollView.scrollTo) {
            this.ScrollView.scrollTo(event);
        }
    }

    setScrollEnabled(enable) {
        const { scrollEnabled } = this.state;
        if (enable !== scrollEnabled) {
            this.setState({
                scrollEnabled: enable
            });
        }
    }

    render() {
        const { children } = this.props;
        const { scrollEnabled } = this.state;
        return (
            <ScrollView
                ref={(refName) => {
                    this.ScrollView = refName;
                }}
                // eslint-disable-next-line react/jsx-props-no-spreading
                {...this.props}
                scrollEnabled={scrollEnabled}
            >

                {
                    children
                }
            </ScrollView>
        );
    }
}

ScrollCustom.defaultProps = {
    removeClippedSubviews: false,
    showsHorizontalScrollIndicator: false,
    showsVerticalScrollIndicator: false,
    scrollEventThrottle: 16,
    scrollEnabled: true
};

module.exports = ScrollCustom;

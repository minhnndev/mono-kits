import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import { IconSource, Image, TouchableOpacity } from '@momo-kits/core';

export default class RatingStar extends Component {
    constructor(props) {
        super(props);
        const roundedRating = Math.round(props.rating * 2) / 2;

        this.state = {
            maxStars: props.maxStars,
            rating: roundedRating,
            ownUpdate: false,
        };
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (prevState.ownUpdate) {
            return {
                ownUpdate: false,
            };
        }
        if (nextProps.rating !== prevState.rating) {
            return { rating: nextProps.rating };
        }
        return null;
    }

    pressStarButton = (newRating) => {
        const { rating } = this.state;
        const { onStarChange, disabled } = this.props;
        if (!disabled) {
            if (newRating !== rating) {
                this.setState({
                    rating: newRating,
                    ownUpdate: true,
                });

                if (onStarChange && typeof onStarChange === 'function') {
                    onStarChange(newRating);
                }
            }
        }
    };

    render() {
        const { rating, maxStars } = this.state;
        const {
            starSize,
            starPadding,
            tintColor,
            ratingIcon = IconSource.ic_star,
            ratingIconSelected = IconSource.ic_star_selected,
        } = this.props;
        const starButtons = [];
        for (let i = 0; i < maxStars; i++) {
            const imageSource =
                i + 1 <= rating ? ratingIconSelected : ratingIcon;
            starButtons.push(
                <TouchableOpacity
                    activeOpacity={0.2}
                    key={i + 1}
                    onPress={() => this.pressStarButton(i + 1)}
                    disable>
                    <Image
                        key={i}
                        source={imageSource}
                        style={{
                            width: starSize,
                            height: starSize,
                            marginLeft:
                                i === 0
                                    ? 0
                                    : starPadding === -1
                                    ? starSize / 4
                                    : starPadding,
                            tintColor,
                        }}
                    />
                </TouchableOpacity>,
            );
        }
        return <View style={[styles.starRatingContainer]}>{starButtons}</View>;
    }
}

RatingStar.propTypes = {
    disabled: PropTypes.bool,
    maxStars: PropTypes.number,
    rating: PropTypes.number,
    onStarChange: PropTypes.func,
    starSize: PropTypes.number,
    starPadding: PropTypes.number,
    tintColor: PropTypes.string,
};

RatingStar.defaultProps = {
    disabled: true,
    maxStars: 5,
    rating: 0,
    starPadding: -1,
};
const styles = StyleSheet.create({
    starRatingContainer: {
        flexDirection: 'row',
        // justifyContent: 'space-between',
    },
});

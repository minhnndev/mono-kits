import React from 'react';
import Skeleton from './Skeleton';

const Line = ({ ...restProps }) => <Skeleton type="line" {...restProps} />;
const Media = ({ ...restProps }) => <Skeleton type="media" {...restProps} />;
const Custom = ({ ...restProps }) => <Skeleton type="custom" {...restProps} />;

export default {
    Line, Media, Custom
};

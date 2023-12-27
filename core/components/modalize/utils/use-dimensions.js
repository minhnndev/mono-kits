import * as React from 'react';
import { Dimensions } from 'react-native';

export const useDimensions = () => {
    const [dimensions, setDimensions] = React.useState(Dimensions.get('window'));

    const onChange = ({ window }) => {
        setDimensions(window);
    };

    React.useEffect(() => {
        Dimensions.addEventListener('change', onChange);

        return () => Dimensions.removeEventListener('change', onChange);
    }, []);

    return dimensions;
};

import React from 'react';
import PaymentWidgetList from './PaymentWidgetList';
import PaymentWidgetCarousel from './PaymentWidgetCarousel';

const PaymentWidget = (props) => {
    const {
        type = 'list',
    } = props || {};

    const Widget = (type === 'list') ? PaymentWidgetList : PaymentWidgetCarousel;

    return (
        <Widget
            {...props}
        />
    );
};

export default React.memo(PaymentWidget);

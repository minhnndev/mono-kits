import React from 'react';
import PaymentWidgetList from './PaymentWidgetList';

const PaymentWidgetSkeleton = (props) => (
    <PaymentWidgetList
        {...props}
        data={[]}
    />
);

export default React.memo(PaymentWidgetSkeleton);

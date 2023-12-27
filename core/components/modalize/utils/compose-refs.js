/**
 * Extracted from https://github.com/seznam/compose-react-refs
 * and moved here to avoid to install an extra-dependency
 */
import * as React from 'react';

const composedRefCache = new WeakMap();

export const composeRefs = (
    ref1,
    ref2,
) => {
    if (ref1 && ref2) {
        const ref1Cache = composedRefCache.get(ref1) || new WeakMap();
        composedRefCache.set(ref1, ref1Cache);
        const composedRef = ref1Cache.get(ref2)
      || ((instance) => {
          updateRef(ref1, instance);
          updateRef(ref2, instance);
      });
        ref1Cache.set(ref2, composedRef);

        return composedRef;
    }

    return ref1;
};

const updateRef = (ref, instance) => {
    if (typeof ref === 'function') {
        ref(instance);
    } else {
        // eslint-disable-next-line no-param-reassign
        ref.current = instance;
    }
};

import { NativeModules } from 'react-native';
import { isEmpty } from 'lodash';
import Observer from '../observer/Observer';
import cached_images from '../components/icon/cached_images.json';
import ValueUtil from '../utils/ValueUtil';
import cached_images_v2 from '../components/icon/cached_images_v2.json';

const { RNResource } = NativeModules;
const cached = { ...cached_images, ...cached_images_v2 };

export default class ResourceManager {
    static STICKER = 'sticker';

    static STICKER_PICKER_SOURCE = 'stickerPickerResource';

    static LOTTIE = 'lottie';

    static ICON = 'icon';

    static LANGUAGE = 'language';

    static NAVIGATION_BAR = 'navigationBar';

    static resource = {};

    static isLoadResource = {};

    static getCacheResource = (key = 'icon') =>
        RNResource?.[key] ? ValueUtil.parseData(RNResource?.[key]) : '';

    static getResource = (key = 'icon') =>
        new Promise((resolve, reject) =>
            RNResource.getResource(key)
                .then((resouce) =>
                    isEmpty(resouce)
                        ? reject()
                        : resolve(ValueUtil.parseData(resouce)),
                )
                .catch((e) => reject(e)),
        );

    static setResource = (data, key = 'icon') => {
        let resource = data;
        if (typeof resource !== 'string') resource = JSON.stringify(resource);
        ResourceManager.resource[key] = ValueUtil.parseData(resource);
        const observer = Observer.getInstance(key);
        observer.notify();
        return RNResource.setResource(resource, key);
    };

    static removeResource = (key = 'icon') => RNResource.removeResource(key);

    static loadResource = (key) => {
        if (
            isEmpty(ResourceManager.resource[key]) &&
            !ResourceManager.isLoadResource[key]
        ) {
            ResourceManager.isLoadResource[key] = true;
            try {
                ResourceManager.resource[key] = isEmpty(
                    ValueUtil.parseData(RNResource[key]),
                )
                    ? key === 'icon'
                        ? cached
                        : ''
                    : ValueUtil.parseData(RNResource[key]);
                const observer = Observer.getInstance(key);
                observer.notify();
                ResourceManager.isLoadResource[key] = false;
            } catch (error) {
                ResourceManager.isLoadResource[key] = false;
                console.warn(
                    `Get ${key} resource error. Please try again`,
                    error,
                );
            }
        }
    };
}

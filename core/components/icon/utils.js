import _ from 'lodash';
import ResourceManager from '../../resources/ResourceManager';

const loading = require('./ic_logo_loading.png');

const getIconExistedInApp = (source) => {
    if (!_.isEmpty(ResourceManager.resource.icon) && ResourceManager.resource.icon[source]) {
        return ResourceManager.resource.icon[source];
    }
    return loading;
};

const getImageSource = (source) => {
    if (source && typeof source === 'string') {
        if (source.startsWith('http')) {
            return { uri: source };
        }
    }
    return source;
};

const JSON_DEV = 'http://172.16.13.40:81/momo_app_v2/new_version/img/appx_icon/cached_images.json';
const JSON_PRO = 'https://img.mservice.io/momo_app_v2/new_version/img/appx_icon/cached_images.json';

module.exports = {
    getIconExistedInApp, getImageSource, JSON_DEV, JSON_PRO
};

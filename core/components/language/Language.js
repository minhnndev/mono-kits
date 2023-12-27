import {NativeModules} from 'react-native';

import ResourceManager from '../../resources/ResourceManager';
import Observer from '../../observer/Observer';
import StringChecker from './StringChecker';
import ValueUtil from '../../utils/ValueUtil';
import {isEmpty} from 'lodash';

const LANGUAGE_VI = 'vi';
const LANGUAGE_EN = 'en';

ResourceManager.loadResource('language');

class LocalizedStrings {
  // TODO: Test instance class
  static instance;

  static defaultLanguage = '';

  static defaultSource = {};

  constructor(props) {
    // TODO: Test instance class
    // if (LocalizedStrings.instance) {
    //     return LocalizedStrings.instance;
    // }
    // LocalizedStrings.instance = this;

    this.props = props;

    if (process?.env?.NODE_ENV === 'development') StringChecker.check(props);

    Observer.getInstance('language').attach(() => {
      this.setLanguage(this.getLanguage());
    });

    const nativeLanguage = NativeModules?.RNResource?.language
      ? this.formatLanguage(
          ValueUtil.parseData(NativeModules?.RNResource?.language),
        )
      : '';

    this.setLanguage(nativeLanguage || this.getDefaultLanguage());
  }

  getLanguageResource = () => {
    if (!isEmpty(ResourceManager.resource.language)) {
      return ResourceManager.resource.language;
    }
    return LANGUAGE_VI;
  };

  // TODO: Test instance class
  static getInstance(props, language = LANGUAGE_VI) {
    if (LocalizedStrings.instance) {
      return LocalizedStrings.instance;
    }
    LocalizedStrings.instance = new LocalizedStrings(
      props || LocalizedStrings?.defaultSource,
      language.replace(/[", ']/g, ''),
    );
    return LocalizedStrings.instance;
  }

  static getLocalize(key) {
    try {
      if (!key) {
        return '';
      }
      const language = this.getDefaultLanguage();
      const resource = LocalizedStrings?.defaultSource;
      if (typeof key === 'string') {
        return (
          resource?.[language]?.[key] ||
          resource?.[LANGUAGE_EN]?.[key] ||
          resource?.[LANGUAGE_VI]?.[key] ||
          String(key)
        );
      }
      if (typeof key === 'object') {
        if (!!key?.[language])
          return (
            key?.[language] ||
            key?.[LANGUAGE_EN] ||
            key?.[LANGUAGE_VI] ||
            String(key)
          );
        else return '';
      }
      return String(key);
    } catch (error) {
      console.warn('Get localize is error', error);
      return String(key);
    }
  }

  static getLanguage() {
    return LocalizedStrings?.getDefaultLanguage();
  }

  addLanguage(newLanguage) {
    try {
      if (process?.env?.NODE_ENV === 'development')
        StringChecker.check(newLanguage);

      const language = LocalizedStrings?.defaultLanguage || LANGUAGE_VI;

      const localizedStrings = newLanguage?.[language];

      for (const key in localizedStrings) {
        if (
          typeof localizedStrings === 'object' &&
          localizedStrings?.hasOwnProperty(key)
        ) {
          this[key] = localizedStrings?.[key] || '';
        } else {
          this[key] = key;
        }
      }

      const keys = Object.keys(newLanguage);

      const newProps = {...this.props};

      for (let i = 0; i < keys.length; i++) {
        newProps[keys[i]] = {
          ...newProps[keys[i]],
          ...newLanguage[keys[i]],
        };
      }

      this.props = newProps;

      LocalizedStrings.defaultSource = newProps;
    } catch (e) {
      console.warn('Add language is error', e);
    }
  }

  setLanguage(language = LANGUAGE_VI) {
    try {
      const localizedStrings = this.props[language];
      LocalizedStrings.defaultLanguage = this.formatLanguage(language);
      LocalizedStrings.defaultSource = this.props;
      for (const key in localizedStrings) {
        if (
          typeof localizedStrings === 'object' &&
          localizedStrings.hasOwnProperty(key)
        ) {
          this[key] = localizedStrings?.[key] || '';
        } else {
          this[key] = key;
        }
      }
    } catch (error) {
      console.warn('Set language is error', error);
    }
  }

  formatLanguage = (language = '') =>
    language ? language.replace(/[", ']/g, '') : LANGUAGE_VI;

  getDefaultLanguage = () =>
    LocalizedStrings?.defaultLanguage.replace(/[", ']/g, '') || LANGUAGE_VI;

  static getDefaultLanguage = () =>
    LocalizedStrings?.defaultLanguage.replace(/[", ']/g, '') || LANGUAGE_VI;

  getLanguage() {
    return this.getDefaultLanguage();
  }

  getLocalize(key) {
    try {
      if (!key) {
        return '';
      }
      const language = this.getDefaultLanguage();
      // const resource = LocalizedStrings?.defaultSource;
      const resource = this.props;
      if (typeof key === 'string') {
        return (
          resource?.[language]?.[key] ||
          resource?.[LANGUAGE_EN]?.[key] ||
          resource?.[LANGUAGE_VI]?.[key] ||
          String(key)
        );
      }
      if (typeof key === 'object') {
        if (!!key?.[language])
          return (
            key?.[language] ||
            key?.[LANGUAGE_EN] ||
            key?.[LANGUAGE_VI] ||
            String(key)
          );
        else return '';
      }
      return String(key);
    } catch (error) {
      console.warn('Get localize is error', error);
      return String(key);
    }
  }

  getString(language, key) {
    if (this.props[language] && this.props[language][key]) {
      return this.props[language][key];
    }
    return '';
  }

  getObject(key) {
    try {
      if (!key) {
        return '';
      }
      const resource = this.props;
      return Object.keys(resource).reduce((acc, next) => {
        acc[next] = resource?.[next]?.[key] || '';
        return acc;
      }, {});
    } catch (error) {
      console.warn('Get object localize is error', error);
      return key;
    }
  }
}

export default LocalizedStrings;

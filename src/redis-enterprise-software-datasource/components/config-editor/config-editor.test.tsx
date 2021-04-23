import { shallow } from 'enzyme';
import React from 'react';
import { DataSourceSettings } from '@grafana/data';
import { DataSourceOptions } from '../../types';
import { ConfigEditor } from './config-editor';

/**
 * Override Options
 */
interface OverrideOptions {
  [key: string]: unknown;
  jsonData?: object;
  secureJsonData?: object | null;
}

/**
 * Configuration Options
 */
const getOptions = ({
  jsonData = {},
  secureJsonData = {},
  ...overrideOptions
}: OverrideOptions = {}): DataSourceSettings<DataSourceOptions, any> => ({
  id: 1,
  orgId: 2,
  name: '',
  typeLogoUrl: '',
  type: '',
  typeName: '',
  access: '',
  url: '',
  password: '',
  user: '',
  database: '',
  basicAuth: false,
  basicAuthPassword: '',
  basicAuthUser: '',
  isDefault: false,
  secureJsonFields: {},
  readOnly: false,
  withCredentials: false,
  ...overrideOptions,
  jsonData: {
    host: '',
    tlsSkipVerify: false,
  },
  secureJsonData: {
    password: '',
    tlsClientCert: '',
    tlsClientKey: '',
    tlsCACert: '',
    ...secureJsonData,
  },
});

/**
 * ConfigEditor
 */
describe('ConfigEditor', () => {
  /**
   * ClusterURL
   */
  describe('ClusterURL', () => {
    it('Should apply host value and change options if field was changed', () => {
      const options = getOptions({ jsonData: { host: 'abc' } });
      const onOptionsChange = jest.fn();
      const wrapper = shallow<ConfigEditor>(<ConfigEditor options={options} onOptionsChange={onOptionsChange} />);
      const testedComponent = wrapper.findWhere((node) => node.prop('label') === 'Cluster URL');
      expect(testedComponent.prop('value')).toEqual(options.jsonData.host);
      testedComponent.simulate('change', { target: { value: 'newHost' } });
      expect(onOptionsChange).toHaveBeenCalledWith({
        ...options,
        jsonData: {
          ...options.jsonData,
          host: 'newHost',
        },
      });
    });
  });

  /**
   * User
   */
  describe('User', () => {
    it('Should apply basicAuthUser value and change options if field was changed', () => {
      const options = getOptions({ basicAuthUser: 'myUser' });
      const onOptionsChange = jest.fn();
      const wrapper = shallow<ConfigEditor>(<ConfigEditor options={options} onOptionsChange={onOptionsChange} />);
      const testedComponent = wrapper.findWhere((node) => node.prop('label') === 'User');
      expect(testedComponent.prop('value')).toEqual(options.basicAuthUser);
      testedComponent.simulate('change', { target: { value: 'newUser' } });
      expect(onOptionsChange).toHaveBeenCalledWith({
        ...options,
        basicAuth: true,
        basicAuthUser: 'newUser',
      });
    });
  });

  /**
   * Password
   */
  describe('Password', () => {
    it('Should apply basicAuthPassword value and change options if field was changed', () => {
      const options = getOptions({
        secureJsonFields: { basicAuthPassword: true },
        secureJsonData: { basicAuthPassword: '123' },
      });
      const onOptionsChange = jest.fn();
      const wrapper = shallow<ConfigEditor>(<ConfigEditor options={options} onOptionsChange={onOptionsChange} />);
      const testedComponent = wrapper.findWhere((node) => node.prop('label') === 'Password');
      expect(testedComponent.prop('value')).toEqual(options.secureJsonData.basicAuthPassword);
      expect(testedComponent.prop('isConfigured')).toBeTruthy();
      testedComponent.simulate('change', { target: { value: 'newPassword' } });
      expect(onOptionsChange).toHaveBeenCalledWith({
        ...options,
        secureJsonData: {
          ...options.secureJsonData,
          basicAuthPassword: 'newPassword',
        },
      });
    });

    it('Should reset basicAuthPassword', () => {
      const options = getOptions({
        secureJsonFields: { basicAuthPassword: true },
      });
      options.secureJsonData = null;
      const onOptionsChange = jest.fn();
      const wrapper = shallow<ConfigEditor>(<ConfigEditor options={options} onOptionsChange={onOptionsChange} />);
      const testedComponent = wrapper.findWhere((node) => node.prop('label') === 'Password');
      expect(testedComponent.prop('isConfigured')).toBeTruthy();
      testedComponent.simulate('reset');
      expect(onOptionsChange).toHaveBeenCalledWith({
        ...options,
        secureJsonFields: {
          ...options.secureJsonFields,
          basicAuthPassword: false,
        },
        secureJsonData: {
          ...options.secureJsonData,
          basicAuthPassword: '',
        },
      });
    });
  });

  /**
   * SkipTLSVerify
   */
  describe('SkipTLSVerify', () => {
    it('Should apply tlsSkipVerify value and change options if field was changed', () => {
      const options = getOptions({
        jsonData: {
          tlsSkipVerify: true,
        },
      });
      const onOptionsChange = jest.fn();
      const wrapper = shallow<ConfigEditor>(<ConfigEditor options={options} onOptionsChange={onOptionsChange} />);
      const testedComponent = wrapper.findWhere((node) => node.prop('label') === 'Skip TLS Verify');
      expect(testedComponent.prop('checked')).toEqual(options.jsonData.tlsSkipVerify);
      testedComponent.simulate('change', { currentTarget: { checked: false } });
      expect(onOptionsChange).toHaveBeenCalledWith({
        ...options,
        jsonData: {
          ...options.jsonData,
          tlsSkipVerify: false,
        },
      });
    });
  });
});

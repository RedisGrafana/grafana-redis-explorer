import { shallow } from 'enzyme';
import React from 'react';
import { config, setLocationSrv } from '@grafana/runtime';
import { ApplicationRoot, DataSourceType } from '../../constants';
import { Config } from './Config';

/**
 * Plugin
 */
const getPlugin = (overridePlugin: any = { meta: {} }) => ({
  ...overridePlugin,
  meta: {
    enabled: true,
    ...overridePlugin.meta,
  },
});

/**
 * Config
 */
describe('Config', () => {
  let initialDataSources = config.datasources;

  beforeAll(() => {
    jest.spyOn(Config, 'getLocation').mockImplementation((): any => ({
      assign: jest.fn(),
      reload: jest.fn(),
    }));
  });

  /**
   * Initialization
   */
  describe('Initialization', () => {
    it('If plugin is not enabled, state should have isEnabled = false', () => {
      const plugin = getPlugin({ meta: { enabled: false } });
      config.datasources = {
        redis: {
          type: DataSourceType.SOFTWARE,
        } as any,
      };
      const wrapper = shallow<Config>(<Config plugin={plugin} query={null as any} />);
      expect(wrapper.state().isEnabled).toBeFalsy();
    });

    it('If no plugin.meta, state should have isEnabled = false', () => {
      const plugin = getPlugin();
      plugin.meta = null;
      config.datasources = {
        redis: {
          type: DataSourceType.SOFTWARE,
        } as any,
      };
      const wrapper = shallow<Config>(<Config plugin={plugin} query={null as any} />);
      expect(wrapper.state().isEnabled).toBeFalsy();
    });

    it('If plugin is enabled but config does not have needed datasources, state should have isEnabled = true', () => {
      const plugin = getPlugin({ meta: { enabled: true } });
      config.datasources = {};
      const wrapper = shallow<Config>(<Config plugin={plugin} query={null as any} />);
      expect(wrapper.state().isEnabled).toBeTruthy();
    });

    it('If plugin is enabled and config has needed datasources, state should have isEnabled = true', () => {
      const plugin = getPlugin({ meta: { enabled: true } });
      config.datasources = {
        redis: {
          type: DataSourceType.SOFTWARE,
        } as any,
      };
      const wrapper = shallow<Config>(<Config plugin={plugin} query={null as any} />);
      expect(wrapper.state().isEnabled).toBeTruthy();
    });
  });

  /**
   * Rendering
   */
  describe('rendering', () => {
    beforeAll(() => {
      config.datasources = {
        redis: {
          type: DataSourceType.SOFTWARE,
        } as any,
      };
    });

    it('If plugin is not configured, should show only enable button', () => {
      const plugin = getPlugin({ meta: { enabled: false } });
      const wrapper = shallow<Config>(<Config plugin={plugin} query={null as any} />);
      const enableButton = wrapper.findWhere((node) => node.name() === 'Button' && node.text() === 'Enable');
      expect(enableButton.exists()).toBeTruthy();
    });

    it('If plugin is configured, should show update and disable buttons', () => {
      const plugin = getPlugin({ meta: { enabled: true } });
      const wrapper = shallow<Config>(<Config plugin={plugin} query={null as any} />);
      const disableButton = wrapper.findWhere((node) => node.name() === 'Button' && node.text() === 'Disable');
      expect(disableButton.exists()).toBeTruthy();
    });

    it('Enable button should call onEnable method', () => {
      const plugin = getPlugin({ meta: { enabled: false } });
      const wrapper = shallow<Config>(<Config plugin={plugin} query={null as any} />);
      const testedMethod = jest.spyOn(wrapper.instance(), 'onEnable').mockImplementation(() => null);
      wrapper.instance().forceUpdate();
      const enableButton = wrapper.findWhere((node) => node.name() === 'Button' && node.text() === 'Enable');
      enableButton.simulate('click');
      expect(testedMethod).toHaveBeenCalled();
    });

    it('Disable button should call onDisable method', () => {
      const plugin = getPlugin({ meta: { enabled: true } });
      const wrapper = shallow<Config>(<Config plugin={plugin} query={null as any} />);
      const testedMethod = jest.spyOn(wrapper.instance(), 'onDisable').mockImplementation(() => null);
      wrapper.instance().forceUpdate();
      const disableButton = wrapper.findWhere((node) => node.name() === 'Button' && node.text() === 'Disable');
      disableButton.simulate('click');
      expect(testedMethod).toHaveBeenCalled();
    });
  });

  /**
   * Methods
   */
  describe('Methods', () => {
    it('onDisable should call updatePluginSettings method', () => {
      const plugin = getPlugin({ meta: { enabled: true } });
      const wrapper = shallow<Config>(<Config plugin={plugin} query={null as any} />);
      const testedMethod = jest
        .spyOn(wrapper.instance(), 'updatePluginSettings')
        .mockImplementation(() => Promise.resolve(null as any));
      wrapper.instance().onDisable();
      expect(testedMethod).toHaveBeenCalledWith({ enabled: false, jsonData: {}, pinned: false });
    });

    it('onEnable should call updatePluginSettings method', () => {
      const plugin = getPlugin({ meta: { enabled: true } });
      const wrapper = shallow<Config>(<Config plugin={plugin} query={null as any} />);
      const testedMethod = jest
        .spyOn(wrapper.instance(), 'updatePluginSettings')
        .mockImplementation(() => Promise.resolve(null as any));
      wrapper.instance().onEnable();
      expect(testedMethod).toHaveBeenCalledWith({ enabled: true, jsonData: {}, pinned: true });
    });

    it('updatePluginSettings should make post request', () => {
      const plugin = getPlugin({ meta: { enabled: true, id: 'app' } });
      const wrapper = shallow<Config>(<Config plugin={plugin} query={null as any} />);
      const postRequestMock = jest.fn();
      wrapper.instance()['backendSrv'] = {
        post: postRequestMock,
      } as any;
      const settings = { enabled: true, jsonData: {}, pinned: true };
      wrapper.instance().updatePluginSettings(settings);
      expect(postRequestMock).toHaveBeenCalledWith(`api/plugins/${plugin.meta.id}/settings`, settings);
    });

    it('goHome should redirect on home page', () => {
      const updateLocationMock = jest.fn();
      setLocationSrv({
        update: updateLocationMock,
      });
      const plugin = getPlugin({ meta: { enabled: true } });
      const wrapper = shallow<Config>(<Config plugin={plugin} query={null as any} />);
      wrapper.instance().goHome();
      expect(updateLocationMock).toHaveBeenCalledWith({
        path: ApplicationRoot,
        partial: false,
      });
    });
  });

  afterAll(() => {
    config.datasources = initialDataSources;
    jest.resetAllMocks();
  });
});

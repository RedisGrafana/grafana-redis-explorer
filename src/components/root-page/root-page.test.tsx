import { shallow } from 'enzyme';
import React from 'react';
import { AppPluginMeta, FieldType, PluginType, toDataFrame } from '@grafana/data';
import { config } from '@grafana/runtime';
import { InfoBox } from '@grafana/ui';
import { DataSourceType } from '../../constants';
import { QueryTypeValue } from '../../redis-enterprise-software-datasource/api';
import { DataSourceList } from '../data-source-list';
import { RootPage } from './root-page';

/**
 * Meta
 */
const getMeta = (): AppPluginMeta => ({
  id: '',
  name: '',
  type: PluginType.app,
  module: '',
  baseUrl: '',
  info: {
    author: {} as any,
    description: '',
    logos: {
      large: '',
      small: '',
    },
    links: [],
    screenshots: [],
    updated: '',
    version: '',
  },
});

/**
 * DataSourceMock
 */
const getDataSourceMock = jest.fn().mockImplementation(() => Promise.resolve([]));

/**
 * RedisMock
 */
const redisMock = {
  query: jest.fn().mockImplementation(() =>
    Promise.resolve({
      data: [
        toDataFrame({
          name: 'redis',
          fields: [
            {
              type: FieldType.string,
              name: 'command',
              values: ['info'],
            },
          ],
        }),
      ],
    })
  ),
};
/**
 * GetRedisMock
 */
const getRedisMock = jest.fn().mockImplementation(() => Promise.resolve(redisMock));

/**
 * Mock @grafana/runtime
 */
jest.mock('@grafana/runtime', () => ({
  getBackendSrv: () => ({
    get: getDataSourceMock,
  }),
  getDataSourceSrv: () => ({
    get: getRedisMock,
  }),
  config: {},
}));

/**
 * RootPage
 */
describe('RootPage', () => {
  const meta = getMeta();
  const path = '/app';
  const onNavChangedMock = jest.fn();

  beforeAll(() => {
    // runtime.config = bootConfig;
  });

  beforeEach(() => {
    onNavChangedMock.mockClear();
    getDataSourceMock.mockClear();
    getRedisMock.mockClear();
    redisMock.query.mockClear();
    config.datasources = undefined as any;
    config.defaultDatasource = undefined as any;
  });

  /**
   * Mounting
   */
  describe('Mounting', () => {
    it('Should update navigation', () => {
      const wrapper = shallow<RootPage>(
        <RootPage basename="" meta={meta} path={path} query={null as any} onNavChanged={onNavChangedMock} />
      );
      const testedMethod = jest.spyOn(wrapper.instance(), 'updateNav');
      wrapper.instance().componentDidMount();
      expect(testedMethod).toHaveBeenCalledTimes(1);
    });

    it('Should make get /api/datasources request', () => {
      const wrapper = shallow<RootPage>(
        <RootPage basename="" meta={meta} path={path} query={null as any} onNavChanged={onNavChangedMock} />
      );
      wrapper.instance().componentDidMount();
      expect(getDataSourceMock).toHaveBeenCalledWith('/api/datasources');
    });

    it('Should update bootConfig', async () => {
      const dataSource = {
        type: DataSourceType.SOFTWARE,
        name: 'redis',
      };
      getDataSourceMock
        .mockImplementationOnce(() => Promise.resolve([dataSource]))
        .mockImplementationOnce(() =>
          Promise.resolve({
            datasources: [dataSource],
            defaultDatasource: dataSource,
          })
        );
      expect(config.datasources).not.toBeDefined();
      expect(config.defaultDatasource).not.toBeDefined();
      const wrapper = shallow<RootPage>(
        <RootPage basename="" meta={meta} path={path} query={null as any} onNavChanged={onNavChangedMock} />,
        {
          disableLifecycleMethods: true,
        }
      );
      await wrapper.instance().componentDidMount();
      expect(getDataSourceMock).toHaveBeenCalledWith('/api/datasources');
      expect(getDataSourceMock).toHaveBeenCalledWith('/api/frontend/settings');
      expect(config.datasources).toEqual([dataSource]);
      expect(config.defaultDatasource).toEqual(dataSource);
    });

    it('Should retrieve cluster name', (done) => {
      getDataSourceMock.mockImplementationOnce(() =>
        Promise.resolve([
          {
            type: DataSourceType.SOFTWARE,
            name: 'redis',
          },
        ])
      );
      const wrapper = shallow<RootPage>(
        <RootPage basename="" meta={meta} path={path} query={null as any} onNavChanged={onNavChangedMock} />
      );
      wrapper.instance().componentDidMount();
      setImmediate(() => {
        expect(getRedisMock).toHaveBeenCalledWith('redis');
        expect(redisMock.query).toHaveBeenCalledWith({ targets: [{ queryType: QueryTypeValue.CLUSTER }] });
        expect(wrapper.state().loading).toBeFalsy();
        expect(wrapper.state().dataSources).toEqual([
          {
            type: DataSourceType.SOFTWARE,
            name: 'redis',
            fields: {
              command: 'info',
            },
          },
        ]);
        done();
      });
    });
  });

  /**
   * updateNav
   */
  describe('updateNav', () => {
    it('Should call onNavChanged prop', () => {
      const wrapper = shallow<RootPage>(
        <RootPage basename="" meta={meta} path={path} query={null as any} onNavChanged={onNavChangedMock} />
      );
      wrapper.instance().updateNav();
      const node = {
        text: 'Redis Explorer',
        img: meta.info.logos.large,
        subTitle: 'Redis Enterprise clusters',
        url: path,
        children: [
          {
            text: 'Home',
            url: path,
            id: 'home',
            icon: 'fa fa-fw fa-database',
            active: true,
          },
        ],
      };
      expect(onNavChangedMock).toHaveBeenCalledWith({
        node: node,
        main: node,
      });
    });
  });

  /**
   * rendering
   */
  describe('rendering', () => {
    it('Should show message if loading=true', (done) => {
      const wrapper = shallow<RootPage>(
        <RootPage basename="" meta={meta} path={path} query={null as any} onNavChanged={onNavChangedMock} />
      );

      const loadingMessageComponent = wrapper.findWhere(
        (node) => node.is(InfoBox) && node.prop('title') === 'Loading...'
      );
      expect(loadingMessageComponent.exists()).toBeTruthy();

      wrapper.instance().componentDidMount();
      setImmediate(() => {
        const dataSourceListComponent = wrapper.findWhere((node) => node.is(DataSourceList));
        const loadingMessageComponent = wrapper.findWhere(
          (node) => node.is(InfoBox) && node.prop('title') === 'Loading...'
        );
        expect(loadingMessageComponent.exists()).not.toBeTruthy();
        expect(dataSourceListComponent.exists()).toBeTruthy();
        expect(dataSourceListComponent.prop('dataSources')).toEqual(wrapper.state().dataSources);
        done();
      });
    });

    it('If dataSource is unable to make query, should work correctly', async () => {
      const wrapper = shallow<RootPage>(
        <RootPage basename="" meta={meta} path={path} query={null as any} onNavChanged={onNavChangedMock} />,
        { disableLifecycleMethods: true }
      );

      getDataSourceMock.mockImplementationOnce(() =>
        Promise.resolve([{ name: 'my-redis', type: DataSourceType.SOFTWARE }])
      );
      redisMock.query.mockImplementationOnce(() => Promise.reject());
      await wrapper.instance().componentDidMount();

      const dataSourceListComponent = wrapper.findWhere((node) => node.is(DataSourceList));
      const loadingMessageComponent = wrapper.findWhere(
        (node) => node.is(InfoBox) && node.prop('title') === 'Loading...'
      );
      expect(loadingMessageComponent.exists()).not.toBeTruthy();
      expect(dataSourceListComponent.exists()).toBeTruthy();
    });
  });

  afterAll(() => {
    jest.resetAllMocks();
  });
});

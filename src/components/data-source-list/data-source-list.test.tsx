import { shallow, ShallowWrapper } from 'enzyme';
import { RedisEnterpriseSoftware } from 'icons';
import React from 'react';
import { Alert } from '@grafana/ui';
import { DataSourceName, DataSourceType } from '../../constants';
import { ClusterDatabases } from '../cluster-databases';
import { DataSourceList } from './data-source-list';

type ShallowComponent = ShallowWrapper<typeof DataSourceList>;

const backendSrvMock = {
  post: jest.fn(),
};

jest.mock('@grafana/runtime', () => ({
  getBackendSrv: () => backendSrvMock,
  locationService: {
    push: () => jest.fn(),
  },
}));

/**
 * Data Source List
 */
describe('DataSourceList', () => {
  const FILLS = {
    success: '#DC382D',
    error: '#A7A7A7',
  };

  const TITLES = {
    success: 'Working as expected',
    error: `Can't connect`,
  };

  beforeEach(() => {
    Object.values(backendSrvMock).forEach((mock) => mock.mockClear());
  });

  it('If dataSources.length=0 should show no items message', () => {
    const wrapper = shallow<ShallowComponent>(<DataSourceList dataSources={[]} />);
    const testedComponent = wrapper.findWhere((node) => node.is(Alert));
    expect(testedComponent.exists()).toBeTruthy();
  });

  /**
   * Rendering dataSources list
   */
  describe('Rendering dataSources list', () => {
    it('Should render dataSources list', () => {
      const dataSources = [
        {
          id: '1',
          name: 'redis1',
          fields: {
            name: 'Redis',
          },
          jsonData: {
            host: '1234',
          },
        },
        {
          id: '2',
          name: 'redis2',
          fields: null,
        },
      ];

      const wrapper = shallow<ShallowComponent>(<DataSourceList dataSources={dataSources as any} />);
      const dataSourceElement = wrapper.find('.card-item-wrapper');

      dataSources.forEach((dataSource, index) => {
        const currentItem = dataSourceElement.at(index);
        expect(currentItem.exists()).toBeTruthy();
        expect(currentItem.find('.card-item').prop('href')).toEqual(
          `d/viroIzSGz/cluster-overview?var-cluster=${dataSource.name}`
        );
        expect(currentItem.find(RedisEnterpriseSoftware).prop('fill')).toEqual(
          dataSource.fields ? FILLS.success : FILLS.error
        );
        expect(currentItem.find(RedisEnterpriseSoftware).prop('title')).toEqual(
          dataSource.fields ? TITLES.success : TITLES.error
        );
        expect(currentItem.find('.card-item-name').text()).toEqual(dataSource.name);
        expect(currentItem.find('.card-item-sub-name').text()).toEqual(dataSource.jsonData?.host || 'Not provided');
      });
    });

    it('If query.datasource is filled, should show active data source', () => {
      const dataSources = [
        {
          id: 1,
          name: 'redis1',
          fields: {
            name: 'Redis',
          },
          jsonData: {
            host: '1234',
          },
        },
        {
          id: 2,
          name: 'redis2',
          fields: null,
        },
      ];

      const wrapper = shallow<ShallowComponent>(
        <DataSourceList dataSources={dataSources as any} query={{ datasource: '1' }} />
      );
      const dataSourceComponents = wrapper.find('.card-list').find('.card-item-wrapper');
      expect(dataSourceComponents.length).toEqual(1);
      expect(wrapper.find(ClusterDatabases).exists()).toBeTruthy();
    });
  });

  /**
   * addNewDataSource
   */
  describe('addNewDataSource', () => {
    it('Should add new datasource and redirect on edit page', (done) => {
      const dataSources = [
        {
          id: 1,
          name: 'Redis Data Source',
        },
      ];

      const wrapper = shallow<ShallowComponent>(
        <DataSourceList dataSources={dataSources as any} query={{ datasource: '1' }} />
      );
      const addDataSourceButton = wrapper.findWhere((node) => node.text() === 'Add Redis Enterprise Software').at(0);

      backendSrvMock.post.mockImplementationOnce(() => Promise.resolve({ datasource: { uid: 123 } }));
      addDataSourceButton.simulate('click');
      setImmediate(() => {
        expect(backendSrvMock.post).toHaveBeenCalledWith('/api/datasources', {
          name: DataSourceName.SOFTWARE,
          type: DataSourceType.SOFTWARE,
          access: 'proxy',
        });
        done();
      });
    });

    it('Should calc new name', (done) => {
      const dataSources = [
        {
          id: 1,
          name: 'Redis Enterprise Software',
        },
        {
          id: 2,
          name: 'Redis Enterprise Software-1',
        },
      ];

      const wrapper = shallow<ShallowComponent>(
        <DataSourceList dataSources={dataSources as any} query={{ datasource: '1' }} />
      );
      const addDataSourceButton = wrapper.findWhere((node) => node.text() === 'Add Redis Enterprise Software').at(0);

      backendSrvMock.post.mockImplementationOnce(() => Promise.resolve({ datasource: { uid: 123 } }));
      addDataSourceButton.simulate('click');
      setImmediate(() => {
        expect(backendSrvMock.post).toHaveBeenCalledWith('/api/datasources', {
          name: `${DataSourceName.SOFTWARE}-2`,
          type: DataSourceType.SOFTWARE,
          access: 'proxy',
        });
        done();
      });
    });
  });
});

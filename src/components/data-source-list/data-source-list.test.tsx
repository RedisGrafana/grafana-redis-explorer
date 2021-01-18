import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import { InfoBox } from '@grafana/ui';
import { RedisEnterpriseSoftware } from 'icons';
import { ClusterDatabases } from '../cluster-databases';
import { DataSourceList } from './data-source-list';

type ShallowComponent = ShallowWrapper<typeof DataSourceList>;

/**
 * DataSourceList
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

  it('If dataSources.length=0 should show no items message', () => {
    const wrapper = shallow<ShallowComponent>(<DataSourceList dataSources={[]} />);
    const testedComponent = wrapper.findWhere((node) => node.is(InfoBox));
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
          commands: [],
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
        expect(currentItem.find('.card-item').prop('href')).toEqual(`datasources/edit/${dataSource.id}`);
        expect(currentItem.find(RedisEnterpriseSoftware).prop('fill')).toEqual(
          dataSource.fields ? FILLS.success : FILLS.error
        );
        expect(currentItem.find(RedisEnterpriseSoftware).prop('title')).toEqual(
          dataSource.fields ? TITLES.success : TITLES.error
        );
        expect(currentItem.find('.card-item-name').text()).toEqual(dataSource.name);
        expect(currentItem.find('.card-item-sub-name').text()).toEqual(dataSource.jsonData?.host || '');
        if (!dataSource.commands || dataSource.commands.length === 0) {
          expect(currentItem.find('.card-item-type').text()).toEqual(dataSource.fields?.name || '');
        }
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
          commands: [],
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
});

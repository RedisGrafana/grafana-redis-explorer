import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import { InfoBox } from '@grafana/ui';
import { RedisEnterpriseSoftware } from 'icons';
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

  it('If datasources.length=0 should show no items message', () => {
    const wrapper = shallow<ShallowComponent>(<DataSourceList datasources={[]} />);
    const testedComponent = wrapper.findWhere((node) => node.is(InfoBox));
    expect(testedComponent.exists()).toBeTruthy();
  });

  /**
   * Rendering datasource list
   */
  describe('Rendering datasource list', () => {
    it('Should render datasources list', () => {
      const datasources = [
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
      const wrapper = shallow<ShallowComponent>(<DataSourceList datasources={datasources} />);
      const dataSourceElement = wrapper.find('.card-item-wrapper');
      datasources.forEach((datasource, index) => {
        const currentItem = dataSourceElement.at(index);
        expect(currentItem.exists()).toBeTruthy();
        expect(currentItem.find('.card-item').prop('href')).toEqual(`datasources/edit/${datasource.id}`);
        expect(currentItem.find(RedisEnterpriseSoftware).prop('fill')).toEqual(
          datasource.fields ? FILLS.success : FILLS.error
        );
        expect(currentItem.find(RedisEnterpriseSoftware).prop('title')).toEqual(
          datasource.fields ? TITLES.success : TITLES.error
        );
        expect(currentItem.find('.card-item-name').text()).toEqual(datasource.name);
        expect(currentItem.find('.card-item-sub-name').text()).toEqual(datasource.jsonData?.host || '');
        if (!datasource.commands || datasource.commands.length === 0) {
          expect(currentItem.find('.card-item-type').text()).toEqual(datasource.fields?.name || '');
        }
      });
    });

    it('If datasources=undefined no items should be rendered', () => {
      const wrapper = shallow<ShallowComponent>(<DataSourceList datasources={void 0} />);
      const dataSourceElement = wrapper.find('.card-item-wrapper');
      expect(dataSourceElement.exists()).not.toBeTruthy();
    });
  });
});

import { shallow, ShallowWrapper } from 'enzyme';
import React from 'react';
import { QueryTypeValue } from '../../api';
import { VariableQueryEditor } from './VariableEditor';

type ShallowComponent = ShallowWrapper<VariableQueryEditor['props'], VariableQueryEditor['state'], VariableQueryEditor>;

/**
 * Variable Query Editor
 */
describe('VariableQueryEditor', () => {
  const onChange = jest.fn();

  /**
   * VariableQueryType
   */
  describe('VariableQueryType', () => {
    const getComponent = (wrapper: ShallowComponent) =>
      wrapper.findWhere((node) => {
        return node.prop('onChange') === wrapper.instance().onChangeType;
      });

    it('Should apply and change queryType', async () => {
      const values = [{ text: '1' }, { text: '2' }];
      const datasource = {
        metricFindQuery: jest.fn().mockImplementation(() => Promise.resolve(values)),
      };
      const wrapper = shallow<VariableQueryEditor>(
        <VariableQueryEditor
          query={{ queryType: QueryTypeValue.BDBS }}
          onChange={onChange}
          datasource={datasource as any}
        />
      );

      const testedComponent = getComponent(wrapper);
      expect(testedComponent.prop('value')).toEqual(QueryTypeValue.BDBS);
      await testedComponent.simulate('change', { value: QueryTypeValue.NODES });

      expect(datasource.metricFindQuery).toHaveBeenCalled();
      expect(onChange).toHaveBeenCalledWith(
        {
          queryType: QueryTypeValue.NODES,
        },
        values.map(({ text }) => text).join(',')
      );
    });

    it('Should set default definition if no values', async () => {
      const datasource = {
        metricFindQuery: jest.fn().mockImplementation(() => Promise.resolve([])),
      };

      const wrapper = shallow<VariableQueryEditor>(
        <VariableQueryEditor
          query={{ queryType: QueryTypeValue.NODES }}
          onChange={onChange}
          datasource={datasource as any}
        />
      );

      const testedComponent = getComponent(wrapper);
      await testedComponent.simulate('change', { value: QueryTypeValue.BDBS });
      expect(onChange).toHaveBeenCalledWith(
        {
          queryType: QueryTypeValue.BDBS,
        },
        'Database ids'
      );
    });
  });
});

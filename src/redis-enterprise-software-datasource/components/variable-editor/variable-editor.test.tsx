import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import { VariableQueryEditor } from './variable-editor';
import { QueryTypeValue } from '../../api';

type ShallowComponent = ShallowWrapper<VariableQueryEditor['props'], VariableQueryEditor['state'], VariableQueryEditor>;

/**
 * VariableQueryEditor
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

    it('Should apply and change queryType', async (done) => {
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
      done();
    });
  });
});

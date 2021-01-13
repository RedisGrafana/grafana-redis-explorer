import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import { QueryEditor } from './query-editor';
import { REQuery } from '../types';
import { QueryTypeValue, QUERY_TYPE, ALERT_TYPE, STATS_TYPE, STATS_INTERVAL } from '../api';

type ShallowComponent = ShallowWrapper<QueryEditor['props'], QueryEditor['state'], QueryEditor>;

/**
 * getQuery
 * @param overrideQuery
 */
export const getQuery = (overrideQuery: object = {}): REQuery => ({
  queryType: QueryTypeValue.ALERTS,
  refId: 'A',
  ...overrideQuery,
});

/**
 * QueryEditor
 */
describe('QueryEditor', () => {
  const onRunQuery = jest.fn();
  const onChange = jest.fn();

  beforeEach(() => {
    onRunQuery.mockReset();
    onChange.mockReset();
  });

  /**
   * QueryType
   */
  describe('QueryType', () => {
    const getComponent = (wrapper: ShallowComponent) =>
      wrapper.findWhere((node) => {
        return node.prop('onChange') === wrapper.instance().onQueryTypeChange;
      });

    it('Should apply queryType value and change', () => {
      const query = getQuery();
      const wrapper = shallow<QueryEditor>(
        <QueryEditor datasource={[] as any} query={query} onRunQuery={onRunQuery} onChange={onChange} />
      );
      const testedComponent = getComponent(wrapper);
      expect(testedComponent.prop('value')).toEqual(QUERY_TYPE.find((type) => type.value === query.queryType));
      const newValue = QUERY_TYPE.find((type) => type.value === QueryTypeValue.NODES);
      testedComponent.simulate('change', newValue);
      expect(onChange).toHaveBeenCalledWith({
        ...query,
        queryType: newValue?.value,
      });
    });
  });

  /**
   * AlertType
   */
  describe('AlertType', () => {
    const getComponent = (wrapper: ShallowComponent) =>
      wrapper.findWhere((node) => {
        return node.prop('onChange') === wrapper.instance().onAlertTypeChange;
      });

    it('Should be shown if queryType=Alerts', () => {
      const query = getQuery({ queryType: QueryTypeValue.ALERTS });
      const wrapper = shallow<QueryEditor>(
        <QueryEditor datasource={[] as any} query={query} onRunQuery={onRunQuery} onChange={onChange} />
      );
      const testedComponent = getComponent(wrapper);
      expect(testedComponent.exists()).toBeTruthy();
    });

    it('Should not be shown if queryType!=Alerts', () => {
      const query = getQuery({ queryType: QueryTypeValue.NODES });
      const wrapper = shallow<QueryEditor>(
        <QueryEditor datasource={[] as any} query={query} onRunQuery={onRunQuery} onChange={onChange} />
      );
      const testedComponent = getComponent(wrapper);
      expect(testedComponent.exists()).not.toBeTruthy();
    });

    it('Should apply alertType value and change', () => {
      const query = getQuery({ queryType: QueryTypeValue.ALERTS, alertType: QueryTypeValue.NODES });
      const wrapper = shallow<QueryEditor>(
        <QueryEditor datasource={[] as any} query={query} onRunQuery={onRunQuery} onChange={onChange} />
      );
      const testedComponent = getComponent(wrapper);
      expect(testedComponent.prop('value')).toEqual(ALERT_TYPE.find((type) => type.value === query.alertType));
      const newValue = ALERT_TYPE.find((type) => type.value === QueryTypeValue.BDBS);
      testedComponent.simulate('change', newValue);
      expect(onChange).toHaveBeenCalledWith({
        ...query,
        alertType: newValue?.value,
      });
    });
  });

  /**
   * Alert DatabaseId
   */
  describe('Alert DatabaseId', () => {
    const getComponent = (wrapper: ShallowComponent) =>
      wrapper.findWhere((node) => {
        return node.prop('onChange') === wrapper.instance().onDatabaseChange;
      });

    it('Should be shown if alertType=BDBS', () => {
      const query = getQuery({ queryType: QueryTypeValue.ALERTS, alertType: QueryTypeValue.BDBS });
      const wrapper = shallow<QueryEditor>(
        <QueryEditor datasource={[] as any} query={query} onRunQuery={onRunQuery} onChange={onChange} />
      );
      const testedComponent = getComponent(wrapper);
      expect(testedComponent.exists()).toBeTruthy();
    });

    it('Should not be shown if alertType!=BDBS', () => {
      const query = getQuery({ queryType: QueryTypeValue.ALERTS, alertType: QueryTypeValue.NODES });
      const wrapper = shallow<QueryEditor>(
        <QueryEditor datasource={[] as any} query={query} onRunQuery={onRunQuery} onChange={onChange} />
      );
      const testedComponent = getComponent(wrapper);
      expect(testedComponent.exists()).not.toBeTruthy();
    });

    it('Should apply bdb value and change', () => {
      const query = getQuery({ queryType: QueryTypeValue.ALERTS, alertType: QueryTypeValue.BDBS, bdb: 'my-bdb' });
      const wrapper = shallow<QueryEditor>(
        <QueryEditor datasource={[] as any} query={query} onRunQuery={onRunQuery} onChange={onChange} />
      );
      const testedComponent = getComponent(wrapper);
      expect(testedComponent.prop('value')).toEqual(query.bdb);
      const newValue = 'new';
      testedComponent.simulate('change', { target: { value: newValue } });
      expect(onChange).toHaveBeenCalledWith({
        ...query,
        bdb: newValue,
      });
    });
  });

  /**
   * Alert NodeId
   */
  describe('Alert NodeId', () => {
    const getComponent = (wrapper: ShallowComponent) =>
      wrapper.findWhere((node) => {
        return node.prop('onChange') === wrapper.instance().onNodeChange;
      });

    it('Should be shown if alertType=NODES', () => {
      const query = getQuery({ queryType: QueryTypeValue.ALERTS, alertType: QueryTypeValue.NODES });
      const wrapper = shallow<QueryEditor>(
        <QueryEditor datasource={[] as any} query={query} onRunQuery={onRunQuery} onChange={onChange} />
      );
      const testedComponent = getComponent(wrapper);
      expect(testedComponent.exists()).toBeTruthy();
    });

    it('Should not be shown if alertType!=NODES', () => {
      const query = getQuery({ queryType: QueryTypeValue.ALERTS, alertType: QueryTypeValue.BDBS });
      const wrapper = shallow<QueryEditor>(
        <QueryEditor datasource={[] as any} query={query} onRunQuery={onRunQuery} onChange={onChange} />
      );
      const testedComponent = getComponent(wrapper);
      expect(testedComponent.exists()).not.toBeTruthy();
    });

    it('Should apply node value and change', () => {
      const query = getQuery({ queryType: QueryTypeValue.ALERTS, alertType: QueryTypeValue.NODES, node: 'my-node' });
      const wrapper = shallow<QueryEditor>(
        <QueryEditor datasource={[] as any} query={query} onRunQuery={onRunQuery} onChange={onChange} />
      );
      const testedComponent = getComponent(wrapper);
      expect(testedComponent.prop('value')).toEqual(query.node);
      const newValue = 'new';
      testedComponent.simulate('change', { target: { value: newValue } });
      expect(onChange).toHaveBeenCalledWith({
        ...query,
        node: newValue,
      });
    });
  });

  /**
   * StatsType
   */
  describe('StatsType', () => {
    const getComponent = (wrapper: ShallowComponent) =>
      wrapper.findWhere((node) => {
        return node.prop('onChange') === wrapper.instance().onStatsTypeChange;
      });

    it('Should be shown if queryType=Stats', () => {
      const query = getQuery({ queryType: QueryTypeValue.STATS });
      const wrapper = shallow<QueryEditor>(
        <QueryEditor datasource={[] as any} query={query} onRunQuery={onRunQuery} onChange={onChange} />
      );
      const testedComponent = getComponent(wrapper);
      expect(testedComponent.exists()).toBeTruthy();
    });

    it('Should not be shown if queryType!=Stats', () => {
      const query = getQuery({ queryType: QueryTypeValue.ALERTS });
      const wrapper = shallow<QueryEditor>(
        <QueryEditor datasource={[] as any} query={query} onRunQuery={onRunQuery} onChange={onChange} />
      );
      const testedComponent = getComponent(wrapper);
      expect(testedComponent.exists()).not.toBeTruthy();
    });

    it('Should apply statsType value and change', () => {
      const query = getQuery({ queryType: QueryTypeValue.STATS, statsType: QueryTypeValue.CLUSTER });
      const wrapper = shallow<QueryEditor>(
        <QueryEditor datasource={[] as any} query={query} onRunQuery={onRunQuery} onChange={onChange} />
      );
      const testedComponent = getComponent(wrapper);
      expect(testedComponent.prop('value')).toEqual(STATS_TYPE.find((type) => type.value === query.statsType));
      const newValue = STATS_TYPE.find((type) => type.value === QueryTypeValue.BDBS);
      testedComponent.simulate('change', newValue);
      expect(onChange).toHaveBeenCalledWith({
        ...query,
        statsType: newValue?.value,
      });
    });
  });

  /**
   * DatabaseId
   */
  describe('DatabaseId', () => {
    const getComponent = (wrapper: ShallowComponent) =>
      wrapper.findWhere((node) => {
        return node.prop('onChange') === wrapper.instance().onDatabaseChange;
      });

    it('Should be shown if queryType=BDBS', () => {
      const query = getQuery({ queryType: QueryTypeValue.BDBS });
      const wrapper = shallow<QueryEditor>(
        <QueryEditor datasource={[] as any} query={query} onRunQuery={onRunQuery} onChange={onChange} />
      );
      const testedComponent = getComponent(wrapper);
      expect(testedComponent.exists()).toBeTruthy();
    });

    it('Should not be shown if queryType!=BDBS', () => {
      const query = getQuery({ queryType: QueryTypeValue.ALERTS });
      const wrapper = shallow<QueryEditor>(
        <QueryEditor datasource={[] as any} query={query} onRunQuery={onRunQuery} onChange={onChange} />
      );
      const testedComponent = getComponent(wrapper);
      expect(testedComponent.exists()).not.toBeTruthy();
    });

    it('Should apply bdb value and change', () => {
      const query = getQuery({ queryType: QueryTypeValue.BDBS, bdb: 'my-bdb' });
      const wrapper = shallow<QueryEditor>(
        <QueryEditor datasource={[] as any} query={query} onRunQuery={onRunQuery} onChange={onChange} />
      );
      const testedComponent = getComponent(wrapper);
      expect(testedComponent.prop('value')).toEqual(query.bdb);
      const newValue = 'new';
      testedComponent.simulate('change', { target: { value: newValue } });
      expect(onChange).toHaveBeenCalledWith({
        ...query,
        bdb: newValue,
      });
    });
  });

  /**
   * NodeId
   */
  describe('NodeId', () => {
    const getComponent = (wrapper: ShallowComponent) =>
      wrapper.findWhere((node) => {
        return node.prop('onChange') === wrapper.instance().onNodeChange;
      });

    it('Should be shown if queryType=NODES', () => {
      const query = getQuery({ queryType: QueryTypeValue.NODES });
      const wrapper = shallow<QueryEditor>(
        <QueryEditor datasource={[] as any} query={query} onRunQuery={onRunQuery} onChange={onChange} />
      );
      const testedComponent = getComponent(wrapper);
      expect(testedComponent.exists()).toBeTruthy();
    });

    it('Should not be shown if queryType!=NODES', () => {
      const query = getQuery({ queryType: QueryTypeValue.ALERTS });
      const wrapper = shallow<QueryEditor>(
        <QueryEditor datasource={[] as any} query={query} onRunQuery={onRunQuery} onChange={onChange} />
      );
      const testedComponent = getComponent(wrapper);
      expect(testedComponent.exists()).not.toBeTruthy();
    });

    it('Should apply node value and change', () => {
      const query = getQuery({ queryType: QueryTypeValue.NODES, node: 'my-node' });
      const wrapper = shallow<QueryEditor>(
        <QueryEditor datasource={[] as any} query={query} onRunQuery={onRunQuery} onChange={onChange} />
      );
      const testedComponent = getComponent(wrapper);
      expect(testedComponent.prop('value')).toEqual(query.node);
      const newValue = 'new';
      testedComponent.simulate('change', { target: { value: newValue } });
      expect(onChange).toHaveBeenCalledWith({
        ...query,
        node: newValue,
      });
    });
  });

  /**
   * ModuleId
   */
  describe('ModuleId', () => {
    const getComponent = (wrapper: ShallowComponent) =>
      wrapper.findWhere((node) => {
        return node.prop('onChange') === wrapper.instance().onModuleChange;
      });

    it('Should be shown if queryType=MODULES', () => {
      const query = getQuery({ queryType: QueryTypeValue.MODULES });
      const wrapper = shallow<QueryEditor>(
        <QueryEditor datasource={[] as any} query={query} onRunQuery={onRunQuery} onChange={onChange} />
      );
      const testedComponent = getComponent(wrapper);
      expect(testedComponent.exists()).toBeTruthy();
    });

    it('Should not be shown if queryType!=MODULES', () => {
      const query = getQuery({ queryType: QueryTypeValue.ALERTS });
      const wrapper = shallow<QueryEditor>(
        <QueryEditor datasource={[] as any} query={query} onRunQuery={onRunQuery} onChange={onChange} />
      );
      const testedComponent = getComponent(wrapper);
      expect(testedComponent.exists()).not.toBeTruthy();
    });

    it('Should apply module value and change', () => {
      const query = getQuery({ queryType: QueryTypeValue.MODULES, module: 'my-module' });
      const wrapper = shallow<QueryEditor>(
        <QueryEditor datasource={[] as any} query={query} onRunQuery={onRunQuery} onChange={onChange} />
      );
      const testedComponent = getComponent(wrapper);
      expect(testedComponent.prop('value')).toEqual(query.module);
      const newValue = 'new';
      testedComponent.simulate('change', { target: { value: newValue } });
      expect(onChange).toHaveBeenCalledWith({
        ...query,
        module: newValue,
      });
    });
  });

  /**
   * UserId
   */
  describe('UserId', () => {
    const getComponent = (wrapper: ShallowComponent) =>
      wrapper.findWhere((node) => {
        return node.prop('onChange') === wrapper.instance().onUserChange;
      });

    it('Should be shown if queryType=USERS', () => {
      const query = getQuery({ queryType: QueryTypeValue.USERS });
      const wrapper = shallow<QueryEditor>(
        <QueryEditor datasource={[] as any} query={query} onRunQuery={onRunQuery} onChange={onChange} />
      );
      const testedComponent = getComponent(wrapper);
      expect(testedComponent.exists()).toBeTruthy();
    });

    it('Should not be shown if queryType!=USERS', () => {
      const query = getQuery({ queryType: QueryTypeValue.ALERTS });
      const wrapper = shallow<QueryEditor>(
        <QueryEditor datasource={[] as any} query={query} onRunQuery={onRunQuery} onChange={onChange} />
      );
      const testedComponent = getComponent(wrapper);
      expect(testedComponent.exists()).not.toBeTruthy();
    });

    it('Should apply user value and change', () => {
      const query = getQuery({ queryType: QueryTypeValue.USERS, user: 'my-user' });
      const wrapper = shallow<QueryEditor>(
        <QueryEditor datasource={[] as any} query={query} onRunQuery={onRunQuery} onChange={onChange} />
      );
      const testedComponent = getComponent(wrapper);
      expect(testedComponent.prop('value')).toEqual(query.user);
      const newValue = 'new';
      testedComponent.simulate('change', { target: { value: newValue } });
      expect(onChange).toHaveBeenCalledWith({
        ...query,
        user: newValue,
      });
    });
  });

  /**
   * Stats fields
   */
  describe('Stats fields', () => {
    /**
     * StatsInterval
     */
    describe('StatsInterval', () => {
      const getComponent = (wrapper: ShallowComponent) =>
        wrapper.findWhere((node) => {
          return node.prop('onChange') === wrapper.instance().onStatsIntervalChange;
        });

      it('Should be shown if queryType=Stats and statsType is filled', () => {
        const query = getQuery({ queryType: QueryTypeValue.STATS, statsType: QueryTypeValue.CLUSTER });
        const wrapper = shallow<QueryEditor>(
          <QueryEditor datasource={[] as any} query={query} onRunQuery={onRunQuery} onChange={onChange} />
        );
        const testedComponent = getComponent(wrapper);
        expect(testedComponent.exists()).toBeTruthy();
      });

      it('Should not be shown if statsType is empty', () => {
        const query = getQuery({ queryType: QueryTypeValue.STATS, statsType: '' });
        const wrapper = shallow<QueryEditor>(
          <QueryEditor datasource={[] as any} query={query} onRunQuery={onRunQuery} onChange={onChange} />
        );
        const testedComponent = getComponent(wrapper);
        expect(testedComponent.exists()).not.toBeTruthy();
      });

      it('Should apply statsInterval value and change', () => {
        const query = getQuery({
          queryType: QueryTypeValue.STATS,
          statsType: QueryTypeValue.CLUSTER,
          statsInterval: '1sec',
        });
        const wrapper = shallow<QueryEditor>(
          <QueryEditor datasource={[] as any} query={query} onRunQuery={onRunQuery} onChange={onChange} />
        );
        const testedComponent = getComponent(wrapper);
        expect(testedComponent.prop('value')).toEqual(
          STATS_INTERVAL.find((type) => type.value === query.statsInterval)
        );
        const newValue = STATS_INTERVAL.find((type) => type.value === '10sec');
        testedComponent.simulate('change', newValue);
        expect(onChange).toHaveBeenCalledWith({
          ...query,
          statsInterval: newValue?.value,
        });
      });
    });

    /**
     * Stats DatabaseId
     */
    describe('Stats DatabaseId', () => {
      const getComponent = (wrapper: ShallowComponent) =>
        wrapper.findWhere((node) => {
          return node.prop('onChange') === wrapper.instance().onDatabaseChange;
        });

      it('Should be shown if queryType=STATS and statsType=DBS', () => {
        const query = getQuery({ queryType: QueryTypeValue.STATS, statsType: QueryTypeValue.BDBS });
        const wrapper = shallow<QueryEditor>(
          <QueryEditor datasource={[] as any} query={query} onRunQuery={onRunQuery} onChange={onChange} />
        );
        const testedComponent = getComponent(wrapper);
        expect(testedComponent.exists()).toBeTruthy();
      });

      it('Should not be shown if queryType=STATS and statsType!=BDBS', () => {
        const query = getQuery({ queryType: QueryTypeValue.STATS, statsType: QueryTypeValue.NODES });
        const wrapper = shallow<QueryEditor>(
          <QueryEditor datasource={[] as any} query={query} onRunQuery={onRunQuery} onChange={onChange} />
        );
        const testedComponent = getComponent(wrapper);
        expect(testedComponent.exists()).not.toBeTruthy();
      });

      it('Should apply bdb value and change', () => {
        const query = getQuery({
          queryType: QueryTypeValue.STATS,
          statsType: QueryTypeValue.BDBS,
          bdb: 'my-bdb',
        });
        const wrapper = shallow<QueryEditor>(
          <QueryEditor datasource={[] as any} query={query} onRunQuery={onRunQuery} onChange={onChange} />
        );
        const testedComponent = getComponent(wrapper);
        expect(testedComponent.prop('value')).toEqual(query.bdb);
        const newValue = 'new';
        testedComponent.simulate('change', { target: { value: newValue } });
        expect(onChange).toHaveBeenCalledWith({
          ...query,
          bdb: newValue,
        });
      });
    });

    /**
     * Stats NodeId
     */
    describe('Stats NodeId', () => {
      const getComponent = (wrapper: ShallowComponent) =>
        wrapper.findWhere((node) => {
          return node.prop('onChange') === wrapper.instance().onNodeChange;
        });

      it('Should be shown if queryType=STATS and statsType=NODES', () => {
        const query = getQuery({ queryType: QueryTypeValue.STATS, statsType: QueryTypeValue.NODES });
        const wrapper = shallow<QueryEditor>(
          <QueryEditor datasource={[] as any} query={query} onRunQuery={onRunQuery} onChange={onChange} />
        );
        const testedComponent = getComponent(wrapper);
        expect(testedComponent.exists()).toBeTruthy();
      });

      it('Should not be shown if queryType=STATS and statsType!=NODES', () => {
        const query = getQuery({ queryType: QueryTypeValue.STATS, statsType: QueryTypeValue.BDBS });
        const wrapper = shallow<QueryEditor>(
          <QueryEditor datasource={[] as any} query={query} onRunQuery={onRunQuery} onChange={onChange} />
        );
        const testedComponent = getComponent(wrapper);
        expect(testedComponent.exists()).not.toBeTruthy();
      });

      it('Should apply node value and change', () => {
        const query = getQuery({
          queryType: QueryTypeValue.STATS,
          statsType: QueryTypeValue.NODES,
          node: 'my-node',
        });
        const wrapper = shallow<QueryEditor>(
          <QueryEditor datasource={[] as any} query={query} onRunQuery={onRunQuery} onChange={onChange} />
        );
        const testedComponent = getComponent(wrapper);
        expect(testedComponent.prop('value')).toEqual(query.node);
        const newValue = 'new';
        testedComponent.simulate('change', { target: { value: newValue } });
        expect(onChange).toHaveBeenCalledWith({
          ...query,
          node: newValue,
        });
      });
    });
  });

  /**
   * executeQuery
   */
  describe('executeQuery', () => {
    const getComponent = (wrapper: ShallowComponent) =>
      wrapper.findWhere((node) => {
        return node.prop('onClick') === wrapper.instance().executeQuery;
      });
    it('Should run query', () => {
      const query = getQuery();
      const wrapper = shallow<QueryEditor>(
        <QueryEditor datasource={[] as any} query={query} onRunQuery={onRunQuery} onChange={onChange} />
      );
      const testedComponent = getComponent(wrapper);
      testedComponent.simulate('click');
      expect(onRunQuery).toHaveBeenCalledTimes(1);
    });
  });
});

import { shallow, ShallowWrapper } from 'enzyme';
import React from 'react';
import {
  HighAvailability,
  MultiLayerSecurity,
  RedisAI,
  RedisBloom,
  RedisGears,
  RedisGraph,
  RedisJSON,
  RedisSearch,
  RedisTimeSeries,
} from '../../icons';
import { Bdb, BdbEndpoint } from '../../redis-enterprise-software-datasource/api';
import { ClusterDatabase } from './cluster-database';

type ShallowComponent = ShallowWrapper<ClusterDatabase['props'], ClusterDatabase['state'], ClusterDatabase>;

/**
 * getEndpoint
 * @param endpointOptions
 */
const getEndpoint = (endpointOptions: { [key: keyof BdbEndpoint]: any } = {}): BdbEndpoint => ({
  dns_name: 'my-dns',
  port: 1234,
  addr_type: 'internal',
  addr: [],
  oss_cluster_api_preferred_ip_type: 'internal',
  proxy_policy: 'single',
  uid: '123',
  ...endpointOptions,
});

/**
 * getDb
 * @param dbOptions
 */
const getDb = (dbOptions: { [K in keyof Bdb]?: any } = {}): any => ({
  name: '',
  module_list: [],
  endpoints: [],
  ...dbOptions,
});

/**
 * Cluster Database
 */
describe('ClusterDatabase', () => {
  const onAdd = jest.fn();

  beforeEach(() => {
    onAdd.mockClear();
  });

  /**
   * getBdbUrl
   */
  describe('getBdbUrl', () => {
    it('Should return correct url', () => {
      const endpoint = getEndpoint({ dns_name: 'my-dns', port: 1234 });
      expect(ClusterDatabase.getBdbUrl(endpoint)).toEqual(`redis://${endpoint.dns_name}:${endpoint.port}`);
    });
  });

  /**
   * convertEndpointToSelectableValue
   */
  describe('convertEndpointToSelectableValue', () => {
    it('Should convert endpoint to the selectableValue', () => {
      const endpoint = getEndpoint({ dns_name: 'my-dns2', port: 1235 });
      expect(ClusterDatabase.convertEndpointToSelectableValue(endpoint)).toEqual({
        value: ClusterDatabase.getBdbUrl(endpoint),
        label: endpoint.addr_type,
      });
    });
  });

  /**
   * Rendering info
   */
  describe('Rendering info', () => {
    it('Should show database name', () => {
      const db = getDb({ name: 'my-db' });
      const wrapper = shallow(<ClusterDatabase db={db} onAdd={onAdd} isCanAdd={false} />);
      const testedComponent = wrapper.findWhere((node) => node.text() === db.name);
      expect(testedComponent.exists()).toBeTruthy();
    });

    /**
     * Showing using modules
     */
    describe('Showing using modules', () => {
      /**
       * MultiLayerSecurity
       */
      describe('MultiLayerSecurity', () => {
        const getTestedComponent = (wrapper: ShallowComponent) => wrapper.find(MultiLayerSecurity);

        it('Should be shown if tls_mode!=disabled', () => {
          const db = getDb({ tls_mode: 'enabled' });
          const wrapper = shallow<ClusterDatabase>(<ClusterDatabase db={db} onAdd={onAdd} isCanAdd={false} />);
          const testedComponent = getTestedComponent(wrapper);
          expect(testedComponent.exists()).toBeTruthy();
        });

        it('Should be shown if acl.length>0', () => {
          const db = getDb({ acl: ['test'] });
          const wrapper = shallow<ClusterDatabase>(<ClusterDatabase db={db} onAdd={onAdd} isCanAdd={false} />);
          const testedComponent = getTestedComponent(wrapper);
          expect(testedComponent.exists()).toBeTruthy();
        });

        it('Should not be shown', () => {
          const db = getDb({ acl: [], tls_mode: 'disabled' });
          const wrapper = shallow<ClusterDatabase>(<ClusterDatabase db={db} onAdd={onAdd} isCanAdd={false} />);
          const testedComponent = getTestedComponent(wrapper);
          expect(testedComponent.exists()).not.toBeTruthy();
        });
      });

      /**
       * HighAvailability
       */
      describe('HighAvailability', () => {
        const getTestedComponent = (wrapper: ShallowComponent) => wrapper.find(HighAvailability);

        it('Should be shown if oss_cluster=true', () => {
          const db = getDb({ oss_cluster: true });
          const wrapper = shallow<ClusterDatabase>(<ClusterDatabase db={db} onAdd={onAdd} isCanAdd={false} />);
          const testedComponent = getTestedComponent(wrapper);
          expect(testedComponent.exists()).toBeTruthy();
        });

        it('Should not be shown', () => {
          const db = getDb({ oss_cluster: false });
          const wrapper = shallow<ClusterDatabase>(<ClusterDatabase db={db} onAdd={onAdd} isCanAdd={false} />);
          const testedComponent = getTestedComponent(wrapper);
          expect(testedComponent.exists()).not.toBeTruthy();
        });
      });

      [
        {
          component: RedisSearch,
          moduleName: 'search',
        },
        {
          component: RedisSearch,
          moduleName: 'ft',
        },
        {
          component: RedisBloom,
          moduleName: 'bloom',
        },
        {
          component: RedisJSON,
          moduleName: 'json',
        },
        {
          component: RedisGraph,
          moduleName: 'graph',
        },
        {
          component: RedisAI,
          moduleName: 'ai',
        },
        {
          component: RedisGears,
          moduleName: 'rg',
        },
        {
          component: RedisTimeSeries,
          moduleName: 'timeseries',
        },
      ].forEach(({ component, moduleName }) => {
        describe(moduleName, () => {
          const getTestedComponent = (wrapper: ShallowComponent) => wrapper.find(component);

          it(`Should be shown if module_name=${moduleName}`, () => {
            const db = getDb({
              module_list: [
                {
                  module_id: '1',
                  module_name: moduleName,
                },
              ],
            });
            const wrapper = shallow<ClusterDatabase>(<ClusterDatabase db={db} onAdd={onAdd} isCanAdd={false} />);
            const testedComponent = getTestedComponent(wrapper);
            expect(testedComponent.exists()).toBeTruthy();
          });

          it('Should not be shown', () => {
            const db = getDb({ module_list: [] });
            const wrapper = shallow<ClusterDatabase>(<ClusterDatabase db={db} onAdd={onAdd} isCanAdd={false} />);
            const testedComponent = getTestedComponent(wrapper);
            expect(testedComponent.exists()).not.toBeTruthy();
          });
        });
      });
    });
  });

  /**
   * Add a data source
   */
  describe('Add a data source', () => {
    /**
     * initialization
     */
    describe('initialization', () => {
      it('Should transform endpoints to endpointOptions', () => {
        const db = getDb({
          endpoints: [
            getEndpoint({ dns_name: 'my-dns', port: 123, addr_type: 'internal' }),
            getEndpoint({ dns_name: 'my-dns2', port: 111, addr_type: 'external' }),
          ],
        });
        const wrapper = shallow<ClusterDatabase>(<ClusterDatabase db={db} onAdd={onAdd} isCanAdd={false} />);
        const expectedEndpointOptions = db.endpoints.map((endpoint: BdbEndpoint) =>
          ClusterDatabase.convertEndpointToSelectableValue(endpoint)
        );
        expect(wrapper.state().endpointOptions).toEqual(expectedEndpointOptions);
        expect(wrapper.state().selectedEndpointValue).toEqual(expectedEndpointOptions[0].value);
      });

      it('Should work correctly if no endpoints', () => {
        const db = getDb({
          endpoints: [],
        });
        const wrapper = shallow<ClusterDatabase>(<ClusterDatabase db={db} onAdd={onAdd} isCanAdd={false} />);
        expect(wrapper.state().endpointOptions).toEqual([]);
        expect(wrapper.state().selectedEndpointValue).toBeUndefined();
      });
    });

    /**
     * Add Form
     */
    describe('Add Form', () => {
      it('Should be shown if isCanAdd=true', () => {
        const db = getDb();
        const wrapper = shallow<ClusterDatabase>(<ClusterDatabase db={db} onAdd={onAdd} isCanAdd />);
        const testedComponent = wrapper.findWhere((node) => node.prop('onClick') === wrapper.instance().onAdd);
        expect(testedComponent.exists()).toBeTruthy();
      });

      it('Should not be shown if isCanAdd=false', () => {
        const db = getDb();
        const wrapper = shallow<ClusterDatabase>(<ClusterDatabase db={db} onAdd={onAdd} isCanAdd={false} />);
        const testedComponent = wrapper.findWhere((node) => node.prop('onClick') === wrapper.instance().onAdd);
        expect(testedComponent.exists()).not.toBeTruthy();
      });

      /**
       * Select Endpoint
       */
      describe('Select Endpoint', () => {
        const getTestedComponent = (wrapper: ShallowComponent) =>
          wrapper.findWhere((node) => node.prop('onChange') === wrapper.instance().onChangeEndpoint);

        it('Should be shown if endpoints.length > 1', () => {
          const db = getDb({
            endpoints: [
              getEndpoint({ dns_name: 'my-dns', port: 123, addr_type: 'internal' }),
              getEndpoint({ dns_name: 'my-dns2', port: 111, addr_type: 'external' }),
            ],
          });
          const wrapper = shallow<ClusterDatabase>(<ClusterDatabase db={db} onAdd={onAdd} isCanAdd />);
          const testedComponent = getTestedComponent(wrapper);
          expect(testedComponent.exists()).toBeTruthy();
          expect(testedComponent.prop('value')).toEqual(wrapper.state().selectedEndpointValue);
          expect(testedComponent.prop('options')).toEqual(wrapper.state().endpointOptions);
        });

        it('Should not be shown if endpoints.length <= 1', () => {
          const db = getDb({
            endpoints: [getEndpoint({ dns_name: 'my-dns', port: 123, addr_type: 'internal' })],
          });
          const wrapper = shallow<ClusterDatabase>(<ClusterDatabase db={db} onAdd={onAdd} isCanAdd />);
          const testedComponent = getTestedComponent(wrapper);
          expect(testedComponent.exists()).not.toBeTruthy();
        });

        it('Should update selectedEndpointValue value', () => {
          const db = getDb({
            endpoints: [
              getEndpoint({ dns_name: 'my-dns', port: 123, addr_type: 'internal' }),
              getEndpoint({ dns_name: 'my-dns2', port: 111, addr_type: 'external' }),
            ],
          });
          const wrapper = shallow<ClusterDatabase>(<ClusterDatabase db={db} onAdd={onAdd} isCanAdd />);
          const testedComponent = getTestedComponent(wrapper);
          expect(wrapper.state().selectedEndpointValue).toEqual(wrapper.state().endpointOptions[0].value);
          testedComponent.simulate('change', wrapper.state().endpointOptions[1]);
          expect(wrapper.state().selectedEndpointValue).toEqual(wrapper.state().endpointOptions[1].value);
        });
      });

      /**
       * Add button
       */
      describe('Add button', () => {
        it('Should call onAdd prop and pass correct options from state', () => {
          const db = getDb({
            endpoints: [
              getEndpoint({ dns_name: 'my-dns', port: 123, addr_type: 'internal' }),
              getEndpoint({ dns_name: 'my-dns2', port: 111, addr_type: 'external' }),
            ],
          });
          const wrapper = shallow<ClusterDatabase>(<ClusterDatabase db={db} onAdd={onAdd} isCanAdd />);
          const testedComponent = wrapper.findWhere((node) => node.prop('onClick') === wrapper.instance().onAdd);
          testedComponent.simulate('click');
          expect(onAdd).toHaveBeenCalledWith(db, { url: wrapper.state().selectedEndpointValue });
        });
      });
    });
  });
});

import { shallow } from 'enzyme';
import React from 'react';
import { Bdb, QueryTypeValue } from '../../redis-enterprise-software-datasource/api';
import { ClusterDatabase } from '../ClusterDatabase';
import { ClusterDatabases } from './ClusterDatabases';

/**
 * Backend Service
 */
const backendSrvMock = {
  post: jest.fn(),
  get: jest.fn(),
};

/**
 * Data Source
 */
const dataSourceMock = {
  api: {
    getBdbs: jest.fn(),
  },
};

const dataSourceSrvMock = {
  get: jest.fn().mockImplementation(() => dataSourceMock),
  getList: jest.fn(),
};

jest.mock('@grafana/runtime', () => ({
  getBackendSrv: () => backendSrvMock,
  getDataSourceSrv: () => dataSourceSrvMock,
}));

/**
 * getDb
 *
 * @param dbOptions
 */
const getDb = (dbOptions: { [K in keyof Bdb]?: any } = {}): any => ({
  name: '',
  module_list: [],
  endpoints: [],
  ...dbOptions,
});

/**
 * getDataSource
 *
 * @param dsOptions
 */
const getDataSource = (dsOptions: any = {}) => ({
  name: 'data-source-name',
  fields: {
    name: 'data-source-name',
  },
  ...dsOptions,
});

/**
 * ClusterDatabases
 */
describe('ClusterDatabases', () => {
  beforeEach(() => {
    Object.values(backendSrvMock).forEach((item) => item.mockClear());
    Object.values(dataSourceSrvMock).forEach((item) => item.mockClear());
    dataSourceMock.api.getBdbs.mockClear();
  });

  /**
   * Initialization
   */
  describe('Initialization', () => {
    it('Should request all data sources and databases', (done) => {
      const dataSources = [
        {
          name: 1,
        },
      ];
      dataSourceSrvMock.getList.mockImplementationOnce(() => Promise.resolve(dataSources));
      const bdbs = [
        {
          name: 'db-name',
        },
        {
          name: 'db-name2',
        },
      ];
      dataSourceMock.api.getBdbs.mockImplementationOnce(() => Promise.resolve(bdbs));
      const dataSource = getDataSource();
      const wrapper = shallow<ClusterDatabases>(<ClusterDatabases dataSource={dataSource as any} />);
      expect(wrapper.text()).toEqual('Loading Databases...');
      setImmediate(() => {
        expect(dataSourceSrvMock.getList).toHaveBeenCalled();
        expect(dataSourceSrvMock.get).toHaveBeenCalledWith(dataSource.name);
        expect(dataSourceMock.api.getBdbs).toHaveBeenCalledWith({ queryType: QueryTypeValue.BDBS, refId: '' });
        expect(wrapper.state()).toEqual({
          dataSources,
          bdbs,
          isLoading: false,
        });
        done();
      });
    });
  });

  /**
   * loadBdbs
   */
  describe('loadBdbs', () => {
    it('Should loadBdbs for current dataSource', async () => {
      const dataSource = getDataSource();
      const wrapper = shallow<ClusterDatabases>(<ClusterDatabases dataSource={dataSource as any} />, {
        disableLifecycleMethods: true,
      });
      const bdbs = [
        {
          name: 'db-name',
        },
        {
          name: 'db-name2',
        },
      ];
      dataSourceSrvMock.get.mockImplementationOnce(() => Promise.resolve(dataSourceMock));
      dataSourceMock.api.getBdbs.mockImplementationOnce(() => Promise.resolve(bdbs));
      const result = await wrapper.instance().loadBdbs();
      expect(dataSourceSrvMock.get).toHaveBeenCalledWith(dataSource.name);
      await Promise.resolve();
      expect(dataSourceMock.api.getBdbs).toHaveBeenCalled();
      expect(result).toEqual(bdbs);
    });

    it('Should return empty array if no dataSource', async () => {
      const dataSource = getDataSource();
      dataSourceSrvMock.get.mockImplementationOnce(() => Promise.resolve(null));
      const wrapper = shallow<ClusterDatabases>(<ClusterDatabases dataSource={dataSource as any} />, {
        disableLifecycleMethods: true,
      });
      const result = await wrapper.instance().loadBdbs();
      expect(dataSourceSrvMock.get).toHaveBeenCalledWith(dataSource.name);
      expect(dataSourceMock.api.getBdbs).not.toHaveBeenCalled();
      expect(result).toEqual([]);
    });
  });

  /**
   * getDataSourceRequestData
   */
  describe('getDataSourceRequestData', () => {
    /**
     * name
     */
    describe('name', () => {
      it('Should return correct', () => {
        const dataSource = getDataSource();
        const wrapper = shallow<ClusterDatabases>(<ClusterDatabases dataSource={dataSource as any} />, {
          disableLifecycleMethods: true,
        });
        const db = getDb({ name: 'my-db' });
        const result = wrapper.instance().getDataSourceRequestData(db, { url: '' });
        expect(result.name).toEqual(`${dataSource.fields.name}:${db.name}`);
      });
    });

    /**
     * url
     */
    describe('url', () => {
      it('Should return correct', () => {
        const dataSource = getDataSource();
        const wrapper = shallow<ClusterDatabases>(<ClusterDatabases dataSource={dataSource as any} />, {
          disableLifecycleMethods: true,
        });
        const db = getDb({ name: 'my-db' });
        const result = wrapper.instance().getDataSourceRequestData(db, { url: '123' });
        expect(result.url).toEqual('123');
      });
    });

    /**
     * type
     */
    describe('type', () => {
      it('Should return correct', () => {
        const dataSource = getDataSource();
        const wrapper = shallow<ClusterDatabases>(<ClusterDatabases dataSource={dataSource as any} />, {
          disableLifecycleMethods: true,
        });
        const db = getDb({ name: 'my-db' });
        const result = wrapper.instance().getDataSourceRequestData(db, { url: '123' });
        expect(result.type).toEqual('redis-datasource');
      });
    });

    /**
     * access
     */
    describe('access', () => {
      it('Should return correct', () => {
        const dataSource = getDataSource();
        const wrapper = shallow<ClusterDatabases>(<ClusterDatabases dataSource={dataSource as any} />, {
          disableLifecycleMethods: true,
        });
        const db = getDb({ name: 'my-db' });
        const result = wrapper.instance().getDataSourceRequestData(db, { url: '123' });
        expect(result.access).toEqual('proxy');
      });
    });

    /**
     * ssl
     */
    describe('ssl', () => {
      it('If ssl=false should return correct', () => {
        const dataSource = getDataSource();
        const wrapper = shallow<ClusterDatabases>(<ClusterDatabases dataSource={dataSource as any} />, {
          disableLifecycleMethods: true,
        });
        const db = getDb({ ssl: false });
        const result = wrapper.instance().getDataSourceRequestData(db, { url: '123' });
        expect(result.jsonData.tlsSkipVerify).toBeFalsy();
        expect(result.jsonData.tlsAuth).toBeFalsy();
        expect(result.jsonData.acl).toBeFalsy();
        expect(result.secureJsonData.tlsClientCert).toEqual('');
        expect(result.secureJsonData.tlsClientKey).toEqual('');
        expect(result.secureJsonData.tlsCACert).toEqual('');
        expect(result.secureJsonFields.tlsClientCert).toBeFalsy();
        expect(result.secureJsonFields.tlsClientKey).toBeFalsy();
        expect(result.secureJsonFields.tlsCACert).toBeFalsy();
      });

      it('If ssl=true should return correct', () => {
        const dataSource = getDataSource({ fields: { proxy_certificate: 'proxy-cert' } });
        const wrapper = shallow<ClusterDatabases>(<ClusterDatabases dataSource={dataSource as any} />, {
          disableLifecycleMethods: true,
        });
        const db = getDb({
          ssl: true,
          authentication_ssl_client_certs: ['client-cert'],
          authentication_ssl_crdt_certs: ['crdt-cert'],
        });
        const result = wrapper.instance().getDataSourceRequestData(db, { url: '123' });
        expect(result.jsonData.tlsSkipVerify).toBeTruthy();
        expect(result.jsonData.tlsAuth).toBeTruthy();
        expect(result.jsonData.acl).toBeFalsy();
        expect(result.secureJsonData.tlsClientCert).toEqual(db.authentication_ssl_client_certs[0]);
        expect(result.secureJsonData.tlsClientKey).toEqual(db.authentication_ssl_crdt_certs[0]);
        expect(result.secureJsonData.tlsCACert).toEqual(dataSource.fields.proxy_certificate);
        expect(result.secureJsonFields.tlsClientCert).toBeTruthy();
        expect(result.secureJsonFields.tlsClientKey).toBeTruthy();
        expect(result.secureJsonFields.tlsCACert).toBeTruthy();
      });
    });

    /**
     * password
     */
    describe('password', () => {
      it('Should return correct', () => {
        const dataSource = getDataSource();
        const wrapper = shallow<ClusterDatabases>(<ClusterDatabases dataSource={dataSource as any} />, {
          disableLifecycleMethods: true,
        });
        const db = getDb({ authentication_redis_pass: 'password' });
        const result = wrapper.instance().getDataSourceRequestData(db, { url: '123' });
        expect(result.secureJsonData.password).toEqual(db.authentication_redis_pass);
      });
    });
  });

  /**
   * onAddDataSource
   */
  describe('onAddDataSource', () => {
    it('Should create a dataSource and update all dataSources', (done) => {
      const dataSource = getDataSource();
      const wrapper = shallow<ClusterDatabases>(<ClusterDatabases dataSource={dataSource as any} />, {
        disableLifecycleMethods: true,
      });
      expect(wrapper.state().dataSources).toEqual([]);
      const db = getDb({ authentication_redis_pass: 'password' });
      const getDataSourceRequestDataMock = jest.spyOn(wrapper.instance(), 'getDataSourceRequestData');
      const updatedDataSources = [{ name: 'dataSource-name', fields: { name: dataSource } }];
      backendSrvMock.get.mockImplementationOnce(() => Promise.resolve(updatedDataSources));
      const options = { url: 'my-url' };
      wrapper.instance().onAddDataSource(db, options);
      setImmediate(() => {
        expect(getDataSourceRequestDataMock).toHaveBeenCalledWith(db, options);
        expect(backendSrvMock.post).toHaveBeenCalledWith(
          'api/datasources',
          wrapper.instance().getDataSourceRequestData(db, options)
        );
        expect(backendSrvMock.get).toHaveBeenCalledWith('api/datasources');
        expect(wrapper.state().dataSources).toEqual(updatedDataSources);
        done();
      });
    });
  });

  /**
   * isCanAdd calculation
   */
  describe('isCanAdd calculation', () => {
    it('If dataSources already have item with the same name, should set isCanAdd=false', () => {
      const dataSource = getDataSource();
      const wrapper = shallow<ClusterDatabases>(<ClusterDatabases dataSource={dataSource as any} />, {
        disableLifecycleMethods: true,
      });
      wrapper.setState({
        dataSources: [
          {
            name: `${dataSource.fields.name}:db-name`,
          },
        ],
        bdbs: [
          getDb({
            name: 'db-name',
          }),
        ],
        isLoading: false,
      } as any);
      wrapper.update();
      const testedComponent = wrapper.find(ClusterDatabase).at(0);
      expect(testedComponent.exists()).toBeTruthy();
      expect(testedComponent.prop('isCanAdd')).not.toBeTruthy();
      wrapper.setState({
        bdbs: [
          getDb({
            name: 'new-name',
          }),
        ],
      } as any);
      wrapper.update();
      const testedComponent2 = wrapper.find(ClusterDatabase).at(0);
      expect(testedComponent2.exists()).toBeTruthy();
      expect(testedComponent2.prop('isCanAdd')).toBeTruthy();
    });
  });

  afterEach(() => {
    jest.resetAllMocks();
  });
});

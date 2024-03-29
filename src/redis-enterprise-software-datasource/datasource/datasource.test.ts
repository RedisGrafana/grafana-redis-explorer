import { DataQueryRequest, DataQueryResponse, DateTime, dateTime, MutableDataFrame } from '@grafana/data';
import { LogItem, QueryTypeValue } from '../api';
import { DataSourceTestStatus } from '../constants';
import { RedisEnterpriseQuery } from '../types';
import { DataSource } from './datasource';

/**
 * Override Request
 */
interface OverrideRequest {
  [key: string]: unknown;
  targets?: RedisEnterpriseQuery[];
}

/**
 * Request
 */
const getRequest = (overrideRequest: OverrideRequest = {}): DataQueryRequest<RedisEnterpriseQuery> => ({
  requestId: '',
  interval: '',
  intervalMs: 0,
  range: {} as any,
  scopedVars: {},
  timezone: '',
  app: '',
  startTime: 0,
  ...overrideRequest,
  targets: overrideRequest.targets ? overrideRequest.targets : [],
});

const apiMock = {
  getCluster: jest.fn().mockImplementation(() => Promise.resolve({})),
  getLogs: jest.fn().mockImplementation(() => Promise.resolve([])),
  getNodes: jest.fn().mockImplementation(() => Promise.resolve([])),
  getBdbs: jest.fn().mockImplementation(() => Promise.resolve([])),
};

jest.mock('../api/api', () => ({
  Api: jest.fn().mockImplementation(() => apiMock),
}));

const replaceTemplateSrvMock = jest.fn().mockImplementation((value: string) => value);

jest.mock('@grafana/runtime', () => ({
  getTemplateSrv: jest.fn().mockImplementation(() => ({
    replace: replaceTemplateSrvMock,
  })),
}));

/**
 * DataSource
 */
describe('DataSource', () => {
  const instanceSettings = {};
  const dataSource = new DataSource(instanceSettings as any);

  beforeEach(() => {
    Object.values(apiMock).forEach((method) => {
      method.mockClear();
    });
    replaceTemplateSrvMock.mockClear();
  });

  /**
   * Query
   */
  describe('Query', () => {
    it('Should return correct data for ARRAY frame', async () => {
      /**
       * Check result
       * @param result
       */
      const checkResult = (result: DataQueryResponse) => {
        const data = result.data[0];
        expect(data).toMatchObject({
          source: [responseData],
          length: 1,
          refId: 'A',
        });
        expect(data.fields[0].name).toEqual('name');
        expect(data.fields[0].values.toArray()).toEqual([responseData.name]);
        expect(data.fields[1].name).toEqual('created_time');
        expect(data.fields[1].values.toArray().map((date: DateTime) => date.toISOString())).toEqual([
          responseData.created_time,
        ]);
      };
      const request = getRequest({ targets: [{ refId: 'A', queryType: QueryTypeValue.CLUSTER }] });
      const responseData = {
        name: 'cluster-name',
        created_time: dateTime().toISOString(),
      };
      apiMock.getCluster.mockImplementationOnce(() => responseData);
      const result = await dataSource.query(request);
      checkResult(result);
      apiMock.getCluster.mockImplementationOnce(() => [responseData]);
      const result2 = await dataSource.query(request);
      checkResult(result2);
    });

    it('Should return correct data for MUTABLE frame', async () => {
      const checkResult = (result: DataQueryResponse, responseData: any[]) => {
        const data = result.data[0];

        expect(data).toBeInstanceOf(MutableDataFrame);
        const timeField = data.fields[0];
        expect(timeField.name).toEqual('time');
        expect(timeField.values.toArray()).toEqual(responseData.map(({ time }) => time));
        const contentField = data.fields[1];
        expect(contentField.name).toEqual('content');
        expect(contentField.values.toArray()).toEqual(responseData.map(({ content }) => content));
        const levelField = data.fields[2];
        expect(levelField.name).toEqual('level');
        expect(levelField.values.toArray()).toEqual(responseData.map(({ level }) => level));
      };
      const request = getRequest({
        targets: [
          { refId: 'A', queryType: QueryTypeValue.LOGS, bdb: 'my-bdb', node: 'my-node', statsInterval: 'interval' },
        ],
      });
      const responseData: LogItem[] = [
        {
          time: dateTime().toISOString(),
          content: 'High log',
          level: 'high',
        },
        {
          time: dateTime().toISOString(),
          content: 'Low log',
          level: 'low',
        },
      ];
      apiMock.getLogs.mockImplementationOnce(() => Promise.resolve(responseData));
      const result = await dataSource.query(request);
      checkResult(result, responseData);
      apiMock.getLogs.mockImplementationOnce(() => Promise.resolve(responseData[0]));
      const result2 = await dataSource.query(request);
      checkResult(result2, [responseData[0]]);
    });

    it('Should handle empty api result', async () => {
      const request = getRequest({ targets: [{ refId: 'A', queryType: QueryTypeValue.LOGS }] });
      apiMock.getLogs.mockImplementationOnce(() => Promise.resolve(null));
      const result = await dataSource.query(request);
      expect(result).toEqual({ data: [] });
      const request2 = getRequest({ targets: [{ refId: 'A', queryType: QueryTypeValue.LICENSE }] });
      const resultWithNoApiMethod = await dataSource.query(request2);
      expect(resultWithNoApiMethod).toEqual({ data: [] });
    });
  });

  /**
   * testDatasource
   */
  describe('testDatasource', () => {
    it('Should handle Success state', async () => {
      const responseData = {
        name: 'my-cluster',
      };
      apiMock.getCluster.mockImplementationOnce(() => Promise.resolve(responseData));
      const result = await dataSource.testDatasource();
      expect(result).toEqual({
        status: DataSourceTestStatus.SUCCESS,
        message: `Connected. Cluster name is "${responseData.name}".`,
      });
    });

    it('Should handle Error state', async () => {
      const responseData = null;
      apiMock.getCluster.mockImplementationOnce(() => Promise.resolve(responseData));
      const result = await dataSource.testDatasource();
      expect(result).toEqual({
        status: DataSourceTestStatus.ERROR,
        message: "Error. Can't retrieve cluster information.",
      });
    });
  });

  /**
   * metricFindQuery
   */
  describe('metricFindQuery', () => {
    it('Should return values for BDBS', async () => {
      const responseData = [
        {
          uid: '123',
        },
        {
          uid: '222',
        },
      ];
      apiMock.getBdbs.mockImplementationOnce(() => Promise.resolve(responseData));
      const result = await dataSource.metricFindQuery({ queryType: QueryTypeValue.BDBS });
      expect(apiMock.getBdbs).toHaveBeenCalled();
      expect(result).toEqual(responseData.map(({ uid }) => ({ text: uid })));
    });

    it('Should return values for NODES', async () => {
      const responseData = [
        {
          uid: '111',
        },
        {
          uid: '222',
        },
      ];
      apiMock.getNodes.mockImplementationOnce(() => Promise.resolve(responseData));
      const result = await dataSource.metricFindQuery({ queryType: QueryTypeValue.NODES });
      expect(apiMock.getNodes).toHaveBeenCalled();
      expect(result).toEqual(responseData.map(({ uid }) => ({ text: uid })));
    });

    it('Should convert object to Values if was get an object', async () => {
      const responseData = {
        uid: '222',
      };
      apiMock.getNodes.mockImplementationOnce(() => Promise.resolve(responseData));
      const result = await dataSource.metricFindQuery({ queryType: QueryTypeValue.NODES });
      expect(apiMock.getNodes).toHaveBeenCalled();
      expect(result).toEqual([responseData].map(({ uid }) => ({ text: uid })));
    });

    it('Should return empty array if api request rejected', async () => {
      apiMock.getNodes.mockImplementationOnce(() => Promise.reject());
      const result = await dataSource.metricFindQuery({ queryType: QueryTypeValue.NODES });
      expect(apiMock.getNodes).toHaveBeenCalled();
      expect(result).toEqual([]);
    });
  });

  afterAll(() => {
    jest.resetAllMocks();
  });
});

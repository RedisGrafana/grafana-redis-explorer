import { dateTime } from '@grafana/data';
import { Observable } from 'rxjs';
import { Api } from './api';
import { QueryTypeValue } from './types';

const getResponse = (response: any) =>
  new Observable((subscriber) => {
    subscriber.next(response);
    subscriber.complete();
  });

/**
 * DataSourceMock
 */
const fetchRequestMock = jest.fn().mockImplementation(() => getResponse([]));

/**
 * Mock @grafana/runtime
 */
jest.mock('@grafana/runtime', () => ({
  getBackendSrv: () => ({
    fetch: fetchRequestMock,
  }),
}));

describe('Api', () => {
  const instanceSettings = {
    url: 'my-url',
  };
  const api = new Api(instanceSettings as any);

  beforeEach(() => {
    fetchRequestMock.mockClear();
  });

  /**
   * getCluster
   */
  describe('getCluster', () => {
    it('Should make getCluster request', async (done) => {
      const data = [
        {
          name: 'myName',
          created_time: dateTime().valueOf(),
        },
      ];
      fetchRequestMock.mockImplementationOnce(() => getResponse({ data }));
      const result = await api.getCluster({ refId: 'A', queryType: QueryTypeValue.CLUSTER });
      expect(fetchRequestMock).toHaveBeenCalledWith({
        method: 'GET',
        url: `${instanceSettings.url}/cluster`,
      });
      expect(result).toEqual(data);
      done();
    });
  });

  /**
   * getLicense
   */
  describe('getLicense', () => {
    it('Should make getLicense request', async (done) => {
      const data = [
        {
          name: 'my-name',
        },
      ];
      fetchRequestMock.mockImplementationOnce(() => getResponse({ data }));
      const result = await api.getLicense({ refId: 'A', queryType: QueryTypeValue.LICENSE });
      expect(fetchRequestMock).toHaveBeenCalledWith({
        method: 'GET',
        url: `${instanceSettings.url}/license`,
      });
      expect(result).toEqual(data);
      done();
    });
  });

  /**
   * getNodes
   */
  describe('getNodes', () => {
    it('Should make getNodes request', async (done) => {
      const data = [
        {
          uid: 123,
        },
      ];

      fetchRequestMock.mockImplementationOnce(() => getResponse({ data }));
      const result = await api.getNodes({ refId: 'A', queryType: QueryTypeValue.NODES, node: 'my-node' });
      expect(fetchRequestMock).toHaveBeenCalledWith({
        method: 'GET',
        url: `${instanceSettings.url}/nodes/my-node`,
      });
      expect(result).toEqual(data);

      await api.getNodes({ refId: 'A', queryType: QueryTypeValue.NODES });
      expect(fetchRequestMock).toHaveBeenCalledWith({
        method: 'GET',
        url: `${instanceSettings.url}/nodes`,
      });

      done();
    });
  });

  /**
   * getBdbs
   */
  describe('getBdbs', () => {
    it('Should make getBdbs request', async (done) => {
      const data = [
        {
          uid: 123,
          authentication_admin_pass: '123',
          authentication_sasl_pass: '123',
        },
      ];

      fetchRequestMock.mockImplementationOnce(() => getResponse({ data }));
      const result = await api.getBdbs({ refId: 'A', queryType: QueryTypeValue.BDBS, bdb: 'my-bdb' });
      expect(fetchRequestMock).toHaveBeenCalledWith({
        method: 'GET',
        url: `${instanceSettings.url}/bdbs/my-bdb`,
      });
      expect(result).toEqual([{ uid: data[0].uid }]);

      await api.getBdbs({ refId: 'A', queryType: QueryTypeValue.BDBS });
      expect(fetchRequestMock).toHaveBeenCalledWith({
        method: 'GET',
        url: `${instanceSettings.url}/bdbs`,
      });
      done();
    });

    it('Should filter different types of value', async (done) => {
      const data = [
        {
          uid: 123,
          authentication_admin_pass: '123',
          authentication_sasl_pass: '123',
        },
        1234,
      ];

      fetchRequestMock.mockImplementationOnce(() => getResponse({ data }));
      const query = { refId: 'A', queryType: QueryTypeValue.BDBS, bdb: 'my-bdb' };
      const result = await api.getBdbs(query);
      expect(fetchRequestMock).toHaveBeenCalledWith({
        method: 'GET',
        url: `${instanceSettings.url}/bdbs/my-bdb`,
      });
      expect(result).toEqual([{ uid: 123 }, 1234]);

      fetchRequestMock.mockImplementationOnce(() => getResponse({ data: data[0] }));
      const result2 = await api.getBdbs(query);
      expect(fetchRequestMock).toHaveBeenCalledWith({
        method: 'GET',
        url: `${instanceSettings.url}/bdbs/my-bdb`,
      });
      expect(result2).toEqual({ uid: 123 });
      done();
    });
  });

  /**
   * getModules
   */
  describe('getModules', () => {
    it('Should make getModules request', async (done) => {
      const data = [
        {
          uid: 123,
        },
      ];
      fetchRequestMock.mockImplementationOnce(() => getResponse({ data }));
      const result = await api.getModules({ refId: 'A', queryType: QueryTypeValue.MODULES, module: 'my-module' });
      expect(fetchRequestMock).toHaveBeenCalledWith({
        method: 'GET',
        url: `${instanceSettings.url}/modules/my-module`,
      });
      expect(result).toEqual(data);
      await api.getModules({ refId: 'A', queryType: QueryTypeValue.MODULES });
      expect(fetchRequestMock).toHaveBeenCalledWith({
        method: 'GET',
        url: `${instanceSettings.url}/modules`,
      });
      done();
    });
  });

  /**
   * getUsers
   */
  describe('getUsers', () => {
    it('Should make getUsers request', async (done) => {
      const data = [
        {
          uid: 123,
        },
      ];
      fetchRequestMock.mockImplementationOnce(() => getResponse({ data }));
      const result = await api.getUsers({ refId: 'A', queryType: QueryTypeValue.USERS, user: 'my-user' });
      expect(fetchRequestMock).toHaveBeenCalledWith({
        method: 'GET',
        url: `${instanceSettings.url}/users/my-user`,
      });
      expect(result).toEqual(data);
      await api.getUsers({ refId: 'A', queryType: QueryTypeValue.USERS });
      expect(fetchRequestMock).toHaveBeenCalledWith({
        method: 'GET',
        url: `${instanceSettings.url}/users/my-user`,
      });
      done();
    });
  });

  /**
   * getStats
   */
  describe('getStats', () => {
    it('Should make getStats request', async (done) => {
      fetchRequestMock.mockImplementation(() =>
        getResponse({
          data: {
            intervals: [
              {
                etime: 2,
              },
              {
                etime: 1,
              },
            ],
          },
        })
      );
      const query = { refId: 'A', queryType: QueryTypeValue.STATS, bdb: 'my-bdb', statsType: QueryTypeValue.BDBS };
      const result = await api.getStats(query, {} as any);
      expect(fetchRequestMock).toHaveBeenCalledWith({
        method: 'GET',
        url: `${instanceSettings.url}/${QueryTypeValue.BDBS}/stats/my-bdb?`,
      });
      expect(result).toEqual([{ etime: 1 }, { etime: 2 }]);
      fetchRequestMock.mockClear();
      await api.getStats({ refId: 'A', queryType: QueryTypeValue.STATS, statsType: QueryTypeValue.BDBS }, {} as any);
      expect(fetchRequestMock).toHaveBeenCalledWith({
        method: 'GET',
        url: `${instanceSettings.url}/${QueryTypeValue.BDBS}/stats?`,
      });
      fetchRequestMock.mockClear();
      await api.getStats({ refId: 'A', queryType: QueryTypeValue.STATS, statsType: QueryTypeValue.NODES }, {} as any);
      expect(fetchRequestMock).toHaveBeenCalledWith({
        method: 'GET',
        url: `${instanceSettings.url}/${QueryTypeValue.NODES}/stats?`,
      });
      fetchRequestMock.mockReset();
      done();
    });

    it('Should apply all query parameters for getStats request', async (done) => {
      fetchRequestMock.mockImplementationOnce(() =>
        getResponse({
          data: {
            intervals: [
              {
                etime: 2,
              },
              {
                etime: 1,
              },
            ],
          },
        })
      );

      /**
       * Query
       */
      const query = {
        refId: 'A',
        queryType: QueryTypeValue.STATS,
        node: 'my-node',
        statsType: QueryTypeValue.NODES,
        statsInterval: '1000',
      };

      /**
       * Time Range
       */
      const timeRange = {
        from: dateTime(),
        to: dateTime(),
        raw: {
          from: dateTime(),
          to: dateTime(),
        },
      };

      const result = await api.getStats(query, timeRange);
      const params = new URLSearchParams();
      params.set('interval', query.statsInterval);
      params.set('stime', timeRange.from.toISOString().split('.')[0] + 'Z');
      params.set('etime', timeRange.to.toISOString().split('.')[0] + 'Z');
      const requestUrl = `${instanceSettings.url}/${QueryTypeValue.NODES}/stats/my-node?${params.toString()}`;
      expect(fetchRequestMock).toHaveBeenCalledWith({
        method: 'GET',
        url: requestUrl,
      });
      expect(result).toEqual([{ etime: 1 }, { etime: 2 }]);
      done();
    });
  });

  /**
   * getAlerts
   */
  describe('getAlerts', () => {
    it('Should make getAlerts request', async (done) => {
      fetchRequestMock.mockImplementation(() =>
        getResponse({
          data: {
            1: {
              myKey: 'id1',
            },
            2: {
              myKey: 'id2',
            },
          },
        })
      );
      const query = { refId: 'A', queryType: QueryTypeValue.ALERTS, alertType: QueryTypeValue.BDBS, bdb: 'my-bdb' };
      const result = await api.getAlerts(query);
      expect(fetchRequestMock).toHaveBeenCalledWith({
        method: 'GET',
        url: `${instanceSettings.url}/${QueryTypeValue.BDBS}/alerts/my-bdb`,
      });
      expect(result.length).toEqual(2);
      expect(result[0].content).toEqual('id=1 myKey=id1');
      expect(result[1].content).toEqual('id=2 myKey=id2');
      fetchRequestMock.mockClear();
      await api.getAlerts({ refId: 'A', queryType: QueryTypeValue.ALERTS, alertType: QueryTypeValue.BDBS });
      expect(fetchRequestMock).toHaveBeenCalledWith({
        method: 'GET',
        url: `${instanceSettings.url}/${QueryTypeValue.BDBS}/alerts`,
      });
      fetchRequestMock.mockClear();
      await api.getAlerts({ refId: 'A', queryType: QueryTypeValue.ALERTS, alertType: QueryTypeValue.NODES });
      expect(fetchRequestMock).toHaveBeenCalledWith({
        method: 'GET',
        url: `${instanceSettings.url}/${QueryTypeValue.NODES}/alerts`,
      });
      fetchRequestMock.mockReset();
      done();
    });

    it('Should make getAlerts request for no array response', async (done) => {
      fetchRequestMock.mockImplementationOnce(() =>
        getResponse({
          data: {
            key1: {
              myKey: 'id1',
            },
            key2: {
              myKey: 'id2',
            },
          },
        })
      );
      const query = { refId: 'A', queryType: QueryTypeValue.ALERTS, alertType: QueryTypeValue.NODES, node: 'my-node' };
      const result = await api.getAlerts(query);
      expect(fetchRequestMock).toHaveBeenCalledWith({
        method: 'GET',
        url: `${instanceSettings.url}/${QueryTypeValue.NODES}/alerts/my-node`,
      });
      expect(result.length).toEqual(1);
      expect(result[0].content).toEqual('key1:myKey=id1 key2:myKey=id2');
      done();
    });
  });

  /**
   * getLogs
   */
  describe('getLogs', () => {
    it('Should make getLogs request', async (done) => {
      fetchRequestMock.mockImplementationOnce(() =>
        getResponse({
          data: [
            {
              time: 123,
              severity: 'high',
            },
          ],
        })
      );

      /**
       * Time Range
       */
      const timeRange = {
        from: dateTime(),
        to: dateTime(),
        raw: {
          from: dateTime(),
          to: dateTime(),
        },
      };
      const result = await api.getLogs({ refId: 'A', queryType: QueryTypeValue.LOGS }, timeRange);
      const params = new URLSearchParams();
      params.set('stime', timeRange.from.toISOString().split('.')[0] + 'Z');
      params.set('etime', timeRange.to.toISOString().split('.')[0] + 'Z');

      expect(fetchRequestMock).toHaveBeenCalledWith({
        method: 'GET',
        url: `${instanceSettings.url}/logs?${params.toString()}`,
      });
      expect(result).toEqual([
        {
          time: 123,
          level: 'high',
          content: '123 severity=high',
        },
      ]);
      done();
    });

    it('Should make getLogs request without range', async (done) => {
      fetchRequestMock.mockImplementationOnce(() =>
        getResponse({
          data: [
            {
              time: 123,
              severity: 'high',
            },
          ],
        })
      );

      const result = await api.getLogs({ refId: 'A', queryType: QueryTypeValue.LOGS }, {} as any);
      const params = new URLSearchParams();

      expect(fetchRequestMock).toHaveBeenCalledWith({
        method: 'GET',
        url: `${instanceSettings.url}/logs?${params.toString()}`,
      });
      expect(result).toEqual([
        {
          time: 123,
          level: 'high',
          content: '123 severity=high',
        },
      ]);
      done();
    });
  });
});

import { Observable } from 'rxjs';
import { dateTime } from '@grafana/data';
import { Api } from './api';
import { QueryTypeValue } from './types';

/**
 * Response
 *
 * @param response
 */
const getResponse = (response: any) =>
  new Observable((subscriber) => {
    subscriber.next(response);
    subscriber.complete();
  });

/**
 * Fetch request Mock
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

/**
 * API
 */
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
    it('Should make getCluster request', async () => {
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
    });
  });

  /**
   * getLicense
   */
  describe('getLicense', () => {
    it('Should make getLicense request', async () => {
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
    });
  });

  /**
   * getNodes
   */
  describe('getNodes', () => {
    it('Should make getNodes request', async () => {
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
    });
  });

  /**
   * getBdbs
   */
  describe('getBdbs', () => {
    it('Should make getBdbs request', async () => {
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
    });

    it('Should filter different types of value', async () => {
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
    });
  });

  /**
   * getModules
   */
  describe('getModules', () => {
    it('Should make getModules request', async () => {
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
    });
  });

  /**
   * getUsers
   */
  describe('getUsers', () => {
    it('Should make getUsers request', async () => {
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
    });
  });

  /**
   * getStats
   */
  describe('getStats', () => {
    it('Should make getStats request', async () => {
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
    });

    it('Should apply all query parameters for getStats request', async () => {
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
    });
  });

  /**
   * getAlerts
   */
  describe('getAlerts', () => {
    it('Should make getAlerts request', async () => {
      fetchRequestMock.mockImplementation(() =>
        getResponse({
          data: {
            cluster_certs_about_to_expire: {
              change_time: '2021-10-15T22:20:00Z',
              change_value: {
                certs_about_to_expire: [],
                global_threshold: '45',
                state: false,
              },
              enabled: true,
              severity: 'INFO',
              state: false,
            },
            cluster_too_few_nodes_for_replication: {
              change_time: '2021-10-15T22:20:00Z',
              change_value: {
                state: true,
              },
              enabled: false,
              severity: 'WARNING',
              state: true,
            },
          },
        })
      );

      const query = { refId: 'A', queryType: QueryTypeValue.ALERTS, alertType: QueryTypeValue.CLUSTER };
      const result = await api.getAlerts(query);
      expect(fetchRequestMock).toHaveBeenCalledWith({
        method: 'GET',
        url: `${instanceSettings.url}/cluster/alerts`,
      });
      expect(result.length).toEqual(2);
      expect(result[0].content).toEqual(
        '2021-10-15T22:20:00Z id=cluster_certs_about_to_expire change_value:global_threshold=45 change_value:state=false enabled=true severity=INFO state=false'
      );
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
      fetchRequestMock.mockClear();

      await api.getAlerts({ refId: 'A', queryType: QueryTypeValue.ALERTS, alertType: QueryTypeValue.BDBS, bdb: '2' });
      expect(fetchRequestMock).toHaveBeenCalledWith({
        method: 'GET',
        url: `${instanceSettings.url}/${QueryTypeValue.BDBS}/alerts/2`,
      });
      fetchRequestMock.mockReset();
    });

    it('Should make getAlerts request with array for databases', async () => {
      fetchRequestMock.mockImplementation(() =>
        getResponse({
          data: {
            1: {
              cluster_certs_about_to_expire: {
                change_time: '2021-10-15T22:20:00Z',
                change_value: {
                  certs_about_to_expire: [],
                  global_threshold: '45',
                  state: false,
                },
                enabled: true,
                severity: 'INFO',
                state: false,
              },
              cluster_too_few_nodes_for_replication: {
                change_time: '2021-10-15T22:20:00Z',
                change_value: {
                  state: true,
                },
                enabled: false,
                severity: 'WARNING',
                state: true,
              },
              no_change_time: {
                change_value: {
                  state: true,
                },
                enabled: false,
                severity: 'WARNING',
                state: true,
              },
            },
          },
        })
      );

      const query = { refId: 'A', queryType: QueryTypeValue.ALERTS, alertType: QueryTypeValue.BDBS };
      const result = await api.getAlerts(query);
      expect(fetchRequestMock).toHaveBeenCalledWith({
        method: 'GET',
        url: `${instanceSettings.url}/bdbs/alerts`,
      });
      expect(result.length).toEqual(2);
      expect(result[0].content).toEqual(
        '2021-10-15T22:20:00Z id=cluster_certs_about_to_expire database=1 change_value:global_threshold=45 change_value:state=false enabled=true severity=INFO state=false'
      );
      expect(result[0].level).toEqual('INFO');
      expect(result[0].time).toEqual('2021-10-15T22:20:00Z');
      fetchRequestMock.mockClear();
    });

    it('Should make getAlerts request with array for nodes', async () => {
      fetchRequestMock.mockImplementation(() =>
        getResponse({
          data: {
            1: {
              cluster_certs_about_to_expire: {
                change_time: '2021-10-15T22:20:00Z',
                change_value: {
                  certs_about_to_expire: [],
                  global_threshold: '45',
                  state: false,
                },
                enabled: true,
                severity: 'INFO',
                state: false,
              },
              no_change_time: {
                change_value: {
                  state: true,
                },
                enabled: false,
                severity: 'WARNING',
                state: true,
              },
            },
          },
        })
      );

      const query = { refId: 'A', queryType: QueryTypeValue.ALERTS, alertType: QueryTypeValue.NODES };
      const result = await api.getAlerts(query);
      expect(fetchRequestMock).toHaveBeenCalledWith({
        method: 'GET',
        url: `${instanceSettings.url}/nodes/alerts`,
      });
      expect(result.length).toEqual(1);
      expect(result[0].content).toEqual(
        '2021-10-15T22:20:00Z id=cluster_certs_about_to_expire node=1 change_value:global_threshold=45 change_value:state=false enabled=true severity=INFO state=false'
      );
      expect(result[0].level).toEqual('INFO');
      expect(result[0].time).toEqual('2021-10-15T22:20:00Z');
      fetchRequestMock.mockClear();
    });

    it('Should make getAlerts request for no alerts response', async () => {
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
      const query = { refId: 'A', queryType: QueryTypeValue.ALERTS, alertType: QueryTypeValue.NODES, node: '3' };
      const result = await api.getAlerts(query);
      expect(fetchRequestMock).toHaveBeenCalledWith({
        method: 'GET',
        url: `${instanceSettings.url}/${QueryTypeValue.NODES}/alerts/3`,
      });
      expect(result.length).toEqual(1);
      expect(result[0].content).toEqual('No alerts found');
    });
  });

  /**
   * getLogs
   */
  describe('getLogs', () => {
    it('Should make getLogs request', async () => {
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
    });

    it('Should make getLogs request without range', async () => {
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
    });

    it('Should return no events found', async () => {
      fetchRequestMock.mockImplementationOnce(() =>
        getResponse({
          data: [],
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
          content: 'No events found in the specified time range',
        },
      ]);
    });
  });
});

import { assign, defaultTo, isArray, isNaN, isNil, isObject, keys, omit, sortBy, toPairs } from 'lodash';
import { map } from 'rxjs/operators';
import { DataSourceInstanceSettings, TimeRange } from '@grafana/data';
import { getBackendSrv } from '@grafana/runtime';
import { DataSourceOptions, RedisEnterpriseQuery } from '../types';
import { Bdb, Cluster, License, Log, Module, Node, Stat, User } from './models';
import { DATASOURCE_FRAME, LogItem, QueryTypeValue } from './types';

/**
 * Redis Enterprise Software API
 */
export class Api {
  /**
   * Constructor
   *
   * @param {DataSourceInstanceSettings<DataSourceOptions>} instanceSettings Settings
   */
  constructor(public instanceSettings: DataSourceInstanceSettings<DataSourceOptions>) {}

  /**
   * Get cluster info
   *
   * @see https://storage.googleapis.com/rlecrestapi/rest-html/http_rest_api.html#get--v1-cluster
   * @async
   * @param {RedisEnterpriseQuery} query Query
   * @returns {Promise<Cluster>} Cluster info
   */
  async getCluster(query: RedisEnterpriseQuery): Promise<Cluster> {
    return getBackendSrv()
      .fetch({
        method: 'GET',
        url: `${this.instanceSettings.url}/cluster`,
      })
      .pipe(map((res: any) => this.filterData(res.data, query)))
      .toPromise();
  }

  /**
   * Get the license details, including license string, expiration, and supported features
   *
   * @see https://storage.googleapis.com/rlecrestapi/rest-html/http_rest_api.html#get--v1-license
   * @async
   * @param {RedisEnterpriseQuery} query Query
   * @returns {Promise<License>>} License details
   */
  async getLicense(query: RedisEnterpriseQuery): Promise<License> {
    return getBackendSrv()
      .fetch({
        method: 'GET',
        url: `${this.instanceSettings.url}/license`,
      })
      .pipe(map((res: any) => this.filterData(res.data, query)))
      .toPromise();
  }

  /**
   * Get all nodes or specific node
   *
   * @see https://storage.googleapis.com/rlecrestapi/rest-html/http_rest_api.html#get--v1-nodes
   * @async
   * @param {RedisEnterpriseQuery} query Query
   * @returns {Promise<Node[] | Node>} Array with all nodes or node
   */
  async getNodes(query: RedisEnterpriseQuery): Promise<Node[] | Node> {
    let url = `${this.instanceSettings.url}/nodes`;
    if (query.node) {
      url += `/${query.node}`;
    }

    return getBackendSrv()
      .fetch({
        method: 'GET',
        url,
      })
      .pipe(map((res: any) => this.filterData(res.data, query)))
      .toPromise();
  }

  /**
   * Get all databases or specific database
   *
   * @see https://storage.googleapis.com/rlecrestapi/rest-html/http_rest_api.html#get--v1-bdbs
   * @async
   * @param {RedisEnterpriseQuery} query Query
   * @returns {Promise<Bdb[] | Bdb>} Array with all databases or database
   */
  async getBdbs(query: RedisEnterpriseQuery): Promise<Bdb[] | Bdb> {
    let url = `${this.instanceSettings.url}/bdbs`;
    if (query.bdb) {
      url += `/${query.bdb}`;
    }

    return getBackendSrv()
      .fetch({
        method: 'GET',
        url,
      })
      .pipe(map((res: any) => this.filterData(res.data, query)))
      .toPromise();
  }

  /**
   * Get all modules or specific module
   *
   * @see https://storage.googleapis.com/rlecrestapi/rest-html/http_rest_api.html#get--v1-modules
   * @async
   * @param {RedisEnterpriseQuery} query Query
   * @returns {Promise<Module[] | Module>} Array with all modules or module
   */
  async getModules(query: RedisEnterpriseQuery): Promise<Module[] | Module> {
    let url = `${this.instanceSettings.url}/modules`;
    if (query.module) {
      url += `/${query.module}`;
    }

    return getBackendSrv()
      .fetch({
        method: 'GET',
        url,
      })
      .pipe(map((res: any) => this.filterData(res.data, query)))
      .toPromise();
  }

  /**
   * Get all users or specific user
   *
   * @see https://storage.googleapis.com/rlecrestapi/rest-html/http_rest_api.html#get--v1-users
   * @async
   * @param {RedisEnterpriseQuery} query Query
   * @returns {Promise<User[] | User>} Array with all users or user
   */
  async getUsers(query: RedisEnterpriseQuery): Promise<User[] | User> {
    let url = `${this.instanceSettings.url}/users`;
    if (query.user) {
      url += `/${query.user}`;
    }

    return getBackendSrv()
      .fetch({
        method: 'GET',
        url,
      })
      .pipe(map((res: any) => this.filterData(res.data, query)))
      .toPromise();
  }

  /**
   * Get all stats
   *
   * @see https://storage.googleapis.com/rlecrestapi/rest-html/http_rest_api.html#get--v1-cluster-stats
   * @see https://storage.googleapis.com/rlecrestapi/rest-html/http_rest_api.html#get--v1-nodes-stats
   * @see https://storage.googleapis.com/rlecrestapi/rest-html/http_rest_api.html#get--v1-bdbs-stats
   * @async
   * @param {RedisEnterpriseQuery} query Query
   * @param {TimeRange} range Time range
   * @returns {Promise<Stat[]>} Array with all stats
   */
  async getStats(query: RedisEnterpriseQuery, range: TimeRange): Promise<Stat[]> {
    let url = `${this.instanceSettings.url}/${query.statsType}/stats`;
    const params = new URLSearchParams();

    /**
     * Stats Type
     */
    switch (query.statsType) {
      case QueryTypeValue.BDBS:
        if (query.bdb) {
          url += `/${query.bdb}`;
        }
        break;
      case QueryTypeValue.NODES:
        if (query.node) {
          url += `/${query.node}`;
        }
        break;
    }

    /**
     * Interval
     */
    if (query.statsInterval) {
      params.append('interval', query.statsInterval);
    }

    /**
     * Time Range
     */
    if (range.from) {
      params.append('stime', range.from.toISOString().split('.')[0] + 'Z');
    }

    if (range.to) {
      params.append('etime', range.to.toISOString().split('.')[0] + 'Z');
    }

    return getBackendSrv()
      .fetch({
        method: 'GET',
        url: [url, params.toString()].join('?'),
      })
      .pipe(map((res: any) => this.filterData(sortBy(res.data.intervals, 'etime'), query)))
      .toPromise();
  }

  /**
   * Get all alert states
   *
   * @see https://storage.googleapis.com/rlecrestapi/rest-html/http_rest_api.html#get--v1-bdbs-alerts-(int-uid)
   * @see https://storage.googleapis.com/rlecrestapi/rest-html/http_rest_api.html#get--v1-nodes-alerts-(int-uid)
   * @async
   * @returns {Promise<LogItem[]>} Array of alerts
   */
  async getAlerts(query: RedisEnterpriseQuery): Promise<LogItem[]> {
    let url = `${this.instanceSettings.url}/${query.alertType}/alerts`;

    /**
     * Alert Types
     */
    switch (query.alertType) {
      case QueryTypeValue.BDBS:
        if (query.bdb) {
          url += `/${query.bdb}`;
        }
        break;
      case QueryTypeValue.NODES:
        if (query.node) {
          url += `/${query.node}`;
        }
        break;
    }

    /**
     * Get Alerts
     */
    const alerts = await getBackendSrv()
      .fetch({
        method: 'GET',
        url,
      })
      .pipe(
        map((res: Record<string, any>) => {
          const logItems: LogItem[] = [];
          const resKeys = keys(res.data);
          const isArrayRequest = !Boolean(resKeys.filter((key) => isNaN(parseInt(key, 10))).length);

          if (isArrayRequest) {
            resKeys.forEach((i: any) => {
              const instance = res.data[i] as any;

              Object.keys(instance).forEach((key: any) => {
                /**
                 * Skip alerts without time
                 */
                if (!instance[key].change_time) {
                  return;
                }

                logItems.push({
                  time: instance[key].change_time,
                  level: instance[key].severity,
                  content: this.getLogContent(
                    {
                      [query.alertType === QueryTypeValue.NODES ? 'node' : 'database']: i,
                      id: key,
                      ...this.filterData(instance[key], query),
                    },
                    'change_time'
                  ),
                });
              });
            });

            return logItems;
          }

          resKeys.forEach((key) => {
            /**
             * Skip alerts without time
             */
            if (!res.data[key].change_time) {
              return;
            }

            logItems.push({
              time: res.data[key].change_time,
              level: res.data[key].severity,
              content: this.getLogContent({ id: key, ...this.filterData(res.data[key], query) }, 'change_time'),
            });
          });

          return logItems;
        })
      )
      .toPromise();

    return alerts && alerts.length ? alerts : ([{ content: 'No alerts found' }] as LogItem[]);
  }

  /**
   * Get cluster events log
   *
   * @see https://storage.googleapis.com/rlecrestapi/rest-html/http_rest_api.html#get--v1-logs
   * @async
   * @param {RedisEnterpriseQuery} query Query
   * @param {TimeRange} range Time range
   * @returns {LogItem[]} Array of events
   */
  async getLogs(query: RedisEnterpriseQuery, range: TimeRange): Promise<LogItem[]> {
    let url = `${this.instanceSettings.url}/logs`;
    const params = new URLSearchParams();

    /**
     * Time Range
     */
    if (range.from) {
      params.append('stime', range.from.toISOString().split('.')[0] + 'Z');
    }

    if (range.to) {
      params.append('etime', range.to.toISOString().split('.')[0] + 'Z');
    }

    /**
     * Get Events
     */
    const logs = await getBackendSrv()
      .fetch({
        method: 'GET',
        url: [url, params.toString()].join('?'),
      })
      .pipe(
        map((res: any) =>
          this.filterData(res.data, query).map((item: Log) => {
            return {
              time: item.time,
              level: item.severity,
              content: this.getLogContent(item, 'time'),
            };
          })
        )
      )
      .toPromise();

    return logs.length ? logs : ([{ content: 'No events found in the specified time range' }] as LogItem[]);
  }

  /**
   * Filter data
   *
   * @param data Response data
   * @param {RedisEnterpriseQuery} query Query
   */
  private filterData(data: any, query: RedisEnterpriseQuery): any {
    const frameData = DATASOURCE_FRAME[query.queryType];
    if (isNil(frameData) || isNil(frameData.omit)) {
      return data;
    }

    /**
     * Omit fields
     */
    const omitFields = defaultTo(frameData.omit, []);
    return isArray(data)
      ? data.map((item: any) => (isObject(item) ? omit(item, omitFields) : item))
      : omit(data, omitFields);
  }

  /**
   * Get log item content
   *
   * @param {Record<string, any>} item Log item
   * @param {string} timestampField Timestamp field
   * @returns {string} Log item content
   */
  private getLogContent(item: Record<string, any>, timestampField: string): string {
    /**
     * Flatten item
     */
    item = assign(
      {},
      ...(function flatten(bit, path = ''): any {
        return [].concat(
          ...keys(bit).map((key) => {
            const pathKey = path ? `${path}:${key}` : key;
            return isObject(bit[key]) ? flatten(bit[key], pathKey) : { [pathKey]: bit[key] };
          })
        );
      })(item)
    );

    /**
     * Join property and values
     */
    const contentData = toPairs(omit(item, ['id', timestampField]));

    /**
     * Add Id as first item if exists
     */
    if (item.id) {
      contentData.unshift(['id', item.id]);
    }

    return contentData.map((value) => value.join('=')).join(' ');
  }
}

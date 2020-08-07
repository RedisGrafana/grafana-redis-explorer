import { omit, toPairs } from 'lodash';
import { DataSourceInstanceSettings } from '@grafana/data';
import { getBackendSrv } from '@grafana/runtime';
import { REDataSourceOptions, REQuery } from '../types';
import { Bdb, Cluster, License, Log, Module, Node, User } from './models';
import { LogItem } from './types';

/**
 * Redis Enterprise API
 */
export class Api {
  /**
   * Constructor
   *
   * @param {DataSourceInstanceSettings<REDataSourceOptions>} instanceSettings Settings
   */
  constructor(public instanceSettings: DataSourceInstanceSettings<REDataSourceOptions>) {}

  /**
   * Get cluster info
   *
   * @see https://storage.googleapis.com/rlecrestapi/rest-html/http_rest_api.html#get--v1-cluster
   * @async
   * @returns {Promise<Cluster>} Cluster info
   */
  async getCluster(): Promise<Cluster> {
    return getBackendSrv()
      .datasourceRequest({
        method: 'GET',
        url: `${this.instanceSettings.url}/cluster`,
      })
      .then((res: any) => res.data);
  }

  /**
   * Get the license details, including license string, expiration, and supported features
   *
   * @see https://storage.googleapis.com/rlecrestapi/rest-html/http_rest_api.html#get--v1-license
   * @async
   * @returns {Promise<License>>} License details
   */
  async getLicense(): Promise<License> {
    return getBackendSrv()
      .datasourceRequest({
        method: 'GET',
        url: `${this.instanceSettings.url}/license`,
      })
      .then((res: any) => res.data);
  }

  /**
   * Get all nodes or specific node
   *
   * @see https://storage.googleapis.com/rlecrestapi/rest-html/http_rest_api.html#get--v1-nodes
   * @async
   * @param {REQuery} query Query
   * @returns {Promise<Node[] | Node>} Array with all nodes or node
   */
  async getNodes(query: REQuery): Promise<Node[] | Node> {
    let url = `${this.instanceSettings.url}/nodes`;
    if (query.node) {
      url += `/${query.node}`;
    }

    return getBackendSrv()
      .datasourceRequest({
        method: 'GET',
        url: url,
      })
      .then((res: any) => res.data);
  }

  /**
   * Get all databases or specific database
   *
   * @see https://storage.googleapis.com/rlecrestapi/rest-html/http_rest_api.html#get--v1-bdbs
   * @async
   * @param {REQuery} query Query
   * @returns {Promise<Bdb[] | Bdb>} Array with all databases or database
   */
  async getBdbs(query: REQuery): Promise<Bdb[] | Bdb> {
    let url = `${this.instanceSettings.url}/bdbs`;
    if (query.bdb) {
      url += `/${query.bdb}`;
    }

    return getBackendSrv()
      .datasourceRequest({
        method: 'GET',
        url: url,
      })
      .then((res: any) => res.data);
  }

  /**
   * Get all modules or specific module
   *
   * @see https://storage.googleapis.com/rlecrestapi/rest-html/http_rest_api.html#get--v1-modules
   * @async
   * @param {REQuery} query Query
   * @returns {Promise<Module[] | Module>} Array with all modules or module
   */
  async getModules(query: REQuery): Promise<Module[] | Module> {
    let url = `${this.instanceSettings.url}/modules`;
    if (query.module) {
      url += `/${query.module}`;
    }

    return getBackendSrv()
      .datasourceRequest({
        method: 'GET',
        url: url,
      })
      .then((res: any) => res.data);
  }

  /**
   * Get all users or specific user
   *
   * @see https://storage.googleapis.com/rlecrestapi/rest-html/http_rest_api.html#get--v1-users
   * @async
   * @param {REQuery} query Query
   * @returns {Promise<User[] | User>} Array with all users or user
   */
  async getUsers(query: REQuery): Promise<User[] | User> {
    let url = `${this.instanceSettings.url}/users`;
    if (query.user) {
      url += `/${query.user}`;
    }

    return getBackendSrv()
      .datasourceRequest({
        method: 'GET',
        url: url,
      })
      .then((res: any) => res.data);
  }

  /**
   * Get all alert states for bdb
   *
   * @see https://storage.googleapis.com/rlecrestapi/rest-html/http_rest_api.html#get--v1-bdbs-alerts-(int-uid)
   * @async
   * @returns {Promise<Record<string, any>>} Hash of alert objects and their state
   */
  async getBdbAlerts(query: REQuery): Promise<Record<string, any>> {
    return getBackendSrv()
      .datasourceRequest({
        method: 'GET',
        url: `${this.instanceSettings.url}/bdbs/${query.bdb}`,
      })
      .then((res: any) => res.data);
  }

  /**
   * Get cluster events log
   *
   * @see https://storage.googleapis.com/rlecrestapi/rest-html/http_rest_api.html#get--v1-logs
   * @async
   * @param {REQuery} query Query
   * @returns {LogItem[]} Array of events
   */
  async getLogs(query: REQuery): Promise<LogItem[]> {
    return getBackendSrv()
      .datasourceRequest({
        method: 'GET',
        url: `${this.instanceSettings.url}/logs`,
      })
      .then((res: any) =>
        res.data.map((item: Log) => {
          return {
            time: item.time,
            level: item.severity,
            content: this.getLogContent(item, 'time'),
          };
        })
      );
  }

  /**
   * Get log item content
   *
   * @param {Record<string, any>} item Log item
   * @param {string} timestampField Timestamp field
   * @returns {string} Log item content
   */
  private getLogContent(item: Record<string, any>, timestampField: string): string {
    const timestamp = item[timestampField];

    /**
     * Join property and values
     */
    const content = toPairs(omit(item, [timestampField]))
      .map((value) => value.join('='))
      .join(' ');

    return [timestamp, content].join(' ');
  }
}

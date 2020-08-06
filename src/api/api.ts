import { REDataSourceOptions, REQuery } from 'types';
import { DataSourceInstanceSettings } from '@grafana/data';
import { getBackendSrv } from '@grafana/runtime';
import { Bdb, Cluster, License, Node } from './models';

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
   * @returns {Cluster} Cluster info
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
   * @returns {License>} License details
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
   * @returns {Node} Array with all nodes
   */
  async getNodes(query: REQuery): Promise<Node[] | Node> {
    let url = `${this.instanceSettings.url}/nodes`;
    if (query.node) {
      url += `/${query.node}`;
    }

    /**
     * Request
     */
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
   * @returns {Bdb>} Array with all databases
   */
  async getBdbs(query: REQuery): Promise<Bdb[] | Bdb> {
    let url = `${this.instanceSettings.url}/bdbs`;
    if (query.bdb) {
      url += `/${query.bdb}`;
    }

    /**
     * Request
     */
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
}

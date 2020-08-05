import { isArray, upperFirst } from 'lodash';
import {
  ArrayDataFrame,
  DataFrame,
  DataQueryRequest,
  DataQueryResponse,
  DataSourceApi,
  DataSourceInstanceSettings,
} from '@grafana/data';
import { getBackendSrv } from '@grafana/runtime';
import { DATASOURCE_FRAME, DataSourceFrameField, DataSourceTestResult, DataSourceTestStatus } from './api';
import { REDataSourceOptions, REQuery } from './types';

/**
 * Redis Enterprise Datasource
 */
export class DataSource extends DataSourceApi<REQuery, REDataSourceOptions> {
  /**
   * Constructor
   *
   * @param {DataSourceInstanceSettings<REDataSourceOptions>} instanceSettings Settings
   */
  constructor(public instanceSettings: DataSourceInstanceSettings<REDataSourceOptions>) {
    super(instanceSettings);
  }

  /**
   * Query for data
   *
   * @async
   * @returns {Promise<DataQueryResponse>} Response
   */
  async query(options: DataQueryRequest<REQuery>): Promise<DataQueryResponse> {
    const data: DataFrame[] = [];

    await Promise.all(
      options.targets.map(async (query) => {
        const getter = `get${upperFirst(query.queryType)}`;
        const apiData = await (this as any)[getter](query);

        /**
         * No data returned
         */
        if (!apiData) {
          return;
        }

        /**
         * Data Frames from JSON
         */
        const frame = new ArrayDataFrame(isArray(apiData) ? (apiData as any[]) : [apiData]);
        const frameData: DataSourceFrameField[] = DATASOURCE_FRAME[query.queryType];

        /**
         * Set Field Type
         */
        frameData.forEach((field) => frame.setFieldType(field.name, field.type, field.converter));
        frame.refId = query.refId;

        /**
         * Add Data Frame
         */
        data.push(frame);
      })
    );

    return { data };
  }

  /**
   * Test Datasource
   *
   * @async
   * @returns {Promise<DataSourceTestResult>} Test result
   */
  async testDatasource(): Promise<DataSourceTestResult> {
    /**
     * Get cluster information
     */
    const cluster = await this.getCluster();
    const isStatusOk = cluster && cluster.name;

    /**
     * Return Ok if Cluster name defined
     */
    return {
      status: isStatusOk ? DataSourceTestStatus.SUCCESS : DataSourceTestStatus.ERROR,
      message: isStatusOk ? `Success. Cluster name is "${cluster.name}"` : "Error. Can't retrive cluster information.",
    };
  }

  /**
   * Get cluster info
   *
   * @see https://storage.googleapis.com/rlecrestapi/rest-html/http_rest_api.html#get--v1-cluster
   * @async
   * @returns {Promise<Record<string, any>>} Cluster info
   */
  async getCluster(): Promise<Record<string, any>> {
    return getBackendSrv()
      .datasourceRequest({
        url: `${this.instanceSettings.url}/cluster`,
      })
      .then((res: any) => res.data);
  }

  /**
   * Get the license details, including license string, expiration, and supported features
   *
   * @see https://storage.googleapis.com/rlecrestapi/rest-html/http_rest_api.html#get--v1-license
   * @async
   * @returns {Promise<Record<string, any>>} License details
   */
  async getLicense(): Promise<Record<string, any>> {
    return getBackendSrv()
      .datasourceRequest({
        url: `${this.instanceSettings.url}/license`,
      })
      .then((res: any) => res.data);
  }

  /**
   * Get all cluster nodes
   *
   * @see https://storage.googleapis.com/rlecrestapi/rest-html/http_rest_api.html#get--v1-nodes
   * @async
   * @returns {Promise<Record<string, any>[]>} Array with all nodes
   */
  async getNodes(): Promise<Array<Record<string, any>>> {
    return getBackendSrv()
      .datasourceRequest({
        url: `${this.instanceSettings.url}/nodes`,
      })
      .then((res: any) => res.data);
  }

  /**
   * Get all databases in the cluster
   *
   * @see https://storage.googleapis.com/rlecrestapi/rest-html/http_rest_api.html#get--v1-bdbs
   * @async
   * @returns {Promise<Record<string, any>[]>} Array with all databases
   */
  async getBdbs(): Promise<Array<Record<string, any>>> {
    return getBackendSrv()
      .datasourceRequest({
        url: `${this.instanceSettings.url}/bdbs`,
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
    // TODO: find better solution
    return getBackendSrv()
      .datasourceRequest({
        url: `https://${this.instanceSettings.jsonData.host}/v1/bdbs/${query.bdb}`,
      })
      .then((res: any) => res.data);
  }
}

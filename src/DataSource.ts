import { upperFirst, result, isArray } from 'lodash';
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
      options.targets.map(async query => {
        const getter = `get${upperFirst(query.queryType)}`;
        const apiData = await result(this, getter);

        if (apiData) {
          const frame = new ArrayDataFrame(isArray(apiData) ? (apiData as any[]) : [apiData]);
          const frameData: DataSourceFrameField[] = DATASOURCE_FRAME[query.queryType];

          frameData.forEach(field => frame.setFieldType(field.name, field.type, field.converter));
          frame.refId = query.refId;

          data.push(frame);
        }
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
    const cluster = await this.getCluster();
    const isStatusOk = cluster && cluster.name;

    return {
      status: isStatusOk ? DataSourceTestStatus.SUCCESS : DataSourceTestStatus.ERROR,
      message: isStatusOk ? 'Success' : 'Error',
    };
  }

  /**
   * Get cluster info
   *
   * @see https://storage.googleapis.com/rlecrestapi/rest-html/http_rest_api.html#get--v1-cluster
   * @async
   * @returns {Promise<Record<string, any>>} Cluster info
   */
  private async getCluster(): Promise<Record<string, any>> {
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
  // @ts-ignore
  private async getLicense(): Promise<Record<string, any>> {
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
  // @ts-ignore
  private async getNodes(): Promise<Array<Record<string, any>>> {
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
  // @ts-ignore
  private async getBdbs(): Promise<Array<Record<string, any>>> {
    return getBackendSrv()
      .datasourceRequest({
        url: `${this.instanceSettings.url}/bdbs`,
      })
      .then((res: any) => res.data);
  }
}

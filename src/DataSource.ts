import { isArray, upperFirst } from 'lodash';
import {
  ArrayDataFrame,
  DataFrame,
  DataQueryRequest,
  DataQueryResponse,
  DataSourceApi,
  DataSourceInstanceSettings,
} from '@grafana/data';
import { getTemplateSrv } from '@grafana/runtime';
import { Api, DATASOURCE_FRAME } from './api';
import {
  DataSourceFrameField,
  DataSourceTestResult,
  DataSourceTestStatus,
  REDataSourceOptions,
  REQuery,
} from './types';

/**
 * Redis Enterprise Datasource
 */
export class DataSource extends DataSourceApi<REQuery, REDataSourceOptions> {
  /**
   * Redis Enterprise Api
   *
   * @type {Api}
   */
  api: Api;

  /**
   * Constructor
   *
   * @param {DataSourceInstanceSettings<REDataSourceOptions>} instanceSettings Settings
   */
  constructor(public instanceSettings: DataSourceInstanceSettings<REDataSourceOptions>) {
    super(instanceSettings);
    this.api = new Api(instanceSettings);
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

        /**
         * Replace Variables
         * TODO: Research and do globally
         */
        query.bdb = getTemplateSrv().replace(query.bdb ?? '', options.scopedVars);
        query.node = getTemplateSrv().replace(query.node ?? '', options.scopedVars);

        /**
         * Execute request
         */
        const apiData = await (this.api as any)[getter](query);

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
    const cluster = await this.api.getCluster();
    const isStatusOk = cluster && cluster.name;

    /**
     * Return Ok if Cluster name defined
     */
    return {
      status: isStatusOk ? DataSourceTestStatus.SUCCESS : DataSourceTestStatus.ERROR,
      message: isStatusOk
        ? `Connected. Cluster name is "${cluster.name}".`
        : "Error. Can't retrieve cluster information.",
    };
  }
}

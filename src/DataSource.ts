import { isArray, upperFirst } from 'lodash';
import {
  ArrayDataFrame,
  DataFrame,
  DataQueryRequest,
  DataQueryResponse,
  DataSourceApi,
  DataSourceInstanceSettings,
  MutableDataFrame,
} from '@grafana/data';
import { getTemplateSrv } from '@grafana/runtime';
import { Api, DATASOURCE_FRAME } from './api';
import {
  DataSourceArrayFrameField,
  DataSourceFrameType,
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
        const apiData = (this.api as any)[getter] ? await (this.api as any)[getter](query) : undefined;

        /**
         * No data returned
         */
        if (!apiData) {
          return;
        }

        /**
         * Data Frames from JSON
         */
        const frameData = DATASOURCE_FRAME[query.queryType];
        switch (frameData.frame) {
          case DataSourceFrameType.MUTABLE:
            const mutableFrame = new MutableDataFrame({
              fields: frameData.fields,
              refId: query.refId,
            });

            (isArray(apiData) ? apiData : [apiData]).forEach((item) => mutableFrame.add(item));
            data.push(mutableFrame);

            break;
          case DataSourceFrameType.ARRAY:
          default:
            const arrayFrame = new ArrayDataFrame(isArray(apiData) ? (apiData as any[]) : [apiData]);
            frameData.fields.forEach((field: DataSourceArrayFrameField) =>
              arrayFrame.setFieldType(field.name, field.type, field.converter)
            );
            data.push({ ...arrayFrame, refId: query.refId });

            break;
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

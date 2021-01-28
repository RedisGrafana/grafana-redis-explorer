import { isArray, upperFirst } from 'lodash';
import {
  ArrayDataFrame,
  DataFrame,
  DataQueryRequest,
  DataQueryResponse,
  DataSourceApi,
  DataSourceInstanceSettings,
  MetricFindValue,
  MutableDataFrame,
} from '@grafana/data';
import { getTemplateSrv } from '@grafana/runtime';
import { Api, DATASOURCE_FRAME, QueryTypeValue } from './api';
import {
  DataSourceArrayFrameField,
  DataSourceFrameType,
  DataSourceTestResult,
  DataSourceTestStatus,
  REDataSourceOptions,
  REQuery,
  VariableQuery,
} from './types';

/**
 * Redis Enterprise Datasource
 */
export class DataSource extends DataSourceApi<REQuery, REDataSourceOptions> {
  /**
   * Redis Enterprise Software Api
   *
   * @type {Api} api
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
   * Metric Find query
   * @param query
   * @param options
   */
  async metricFindQuery(query: VariableQuery, options?: any): Promise<MetricFindValue[]> {
    const apiQuery = {
      ...query,
      refId: '',
    };

    /**
     * Get Databases or Nodes
     */
    try {
      const response =
        query.queryType === QueryTypeValue.BDBS ? await this.api.getBdbs(apiQuery) : await this.api.getNodes(apiQuery);

      return (Array.isArray(response) ? response : [response]).map((item: any) => ({ text: item.uid }));
    } catch (e) {
      return [];
    }
  }

  /**
   * Query for data
   *
   * @async
   * @param {DataQueryRequest<REQuery>} options Options
   * @returns {Promise<DataQueryResponse>} Response
   */
  async query(options: DataQueryRequest<REQuery>): Promise<DataQueryResponse> {
    const data: DataFrame[] = [];
    const { range } = options;

    await Promise.all(
      options.targets.map(async (query) => {
        /**
         * Replace Variables
         * TODO: Research and do globally
         */
        query.bdb = getTemplateSrv().replace(query.bdb ?? '', options.scopedVars);
        query.node = getTemplateSrv().replace(query.node ?? '', options.scopedVars);
        query.statsInterval = getTemplateSrv().replace(query.statsInterval ?? '', options.scopedVars);

        /**
         * Execute request
         */
        const getter = `get${upperFirst(query.queryType)}`;
        const apiData = (this.api as any)[getter] ? await (this.api as any)[getter](query, range) : undefined;

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
            /**
             * Mutable DataFrame
             */
            const mutableFrame = new MutableDataFrame({
              fields: frameData.fields,
              refId: query.refId,
            });

            /**
             * Add Fields
             */
            (isArray(apiData) ? apiData : [apiData]).forEach((item) => mutableFrame.add(item));

            /**
             * Add Frames
             */
            data.push(mutableFrame);
            break;
          case DataSourceFrameType.ARRAY:
          default:
            /**
             * Array DataFrame
             */
            const arrayFrame = new ArrayDataFrame(isArray(apiData) ? (apiData as any[]) : [apiData]);

            /**
             * Set Field Types
             */
            frameData.fields.forEach((field: DataSourceArrayFrameField) =>
              arrayFrame.setFieldType(field.name, field.type, field.converter)
            );

            /**
             * Add Frames
             */
            data.push({ ...arrayFrame, refId: query.refId });
            break;
        }
      })
    );

    /**
     * Return Frames
     */
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
    const cluster = await this.api.getCluster({
      queryType: QueryTypeValue.CLUSTER,
      refId: '',
    });
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

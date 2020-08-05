import {
  ArrayDataFrame,
  DataFrame,
  DataQueryRequest,
  DataQueryResponse,
  DataSourceApi,
  DataSourceInstanceSettings,
  dateMath,
  FieldType,
} from '@grafana/data';
import { getBackendSrv } from '@grafana/runtime';
import { QueryTypeValue } from './api';
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
   * Query
   */
  async query(options: DataQueryRequest<REQuery>): Promise<DataQueryResponse> {
    const data: DataFrame[] = [];
    for (const query of options.targets) {
      if (query.queryType === QueryTypeValue.CLUSTER) {
        const cluster = await this.getCluster();

        /**
         * Frame
         */
        const frame = new ArrayDataFrame([cluster]);
        frame.setFieldType('name', FieldType.string);
        frame.refId = query.refId;
        data.push(frame);
      } else if (query.queryType === QueryTypeValue.LICENSE) {
        const license = await this.getLicense();

        /**
         * Frame
         */
        const frame = new ArrayDataFrame([license]);
        console.log(license);

        frame.setFieldType('name', FieldType.string);
        frame.setFieldType('expired', FieldType.boolean);
        frame.setFieldType('shards_limit', FieldType.number);
        frame.setFieldType('activation_date', FieldType.time, (s: string) => dateMath.parse(s));
        frame.setFieldType('expiration_date', FieldType.time, (s: string) => dateMath.parse(s));
        frame.refId = query.refId;
        data.push(frame);
      } else if (query.queryType === QueryTypeValue.NODES) {
        const nodes = await this.getNodes();

        /**
         * Frame
         */
        const frame = new ArrayDataFrame(nodes);
        frame.setFieldType('uid', FieldType.number);
        frame.setFieldType('total_memory', FieldType.number);
        frame.refId = query.refId;
        data.push(frame);
      } else if (query.queryType === QueryTypeValue.BDBS) {
        const bdbs = await this.getBdbs();

        /**
         * Frame
         */
        const frame = new ArrayDataFrame(bdbs);
        frame.setFieldType('group_uid', FieldType.number);
        frame.setFieldType('redis_version', FieldType.number);
        frame.setFieldType('port', FieldType.number);
        frame.setFieldType('memory_size', FieldType.number);
        frame.refId = query.refId;
        data.push(frame);
      }
    }
    return { data };
  }

  /**
   * Get Cluster
   */
  async getCluster(): Promise<any[]> {
    return getBackendSrv()
      .datasourceRequest({
        url: `${this.instanceSettings.url}/cluster`,
      })
      .then((res: any) => res.data);
  }

  /**
   * Get License
   */
  async getLicense(): Promise<any[]> {
    return getBackendSrv()
      .datasourceRequest({
        url: `${this.instanceSettings.url}/license`,
      })
      .then((res: any) => res.data);
  }

  /**
   * Get Nodes
   */
  async getNodes(): Promise<any[]> {
    return getBackendSrv()
      .datasourceRequest({
        url: `${this.instanceSettings.url}/nodes`,
      })
      .then((res: any) => res.data);
  }

  /**
   * Get Nodes
   */
  async getBdbs(): Promise<any[]> {
    return getBackendSrv()
      .datasourceRequest({
        url: `${this.instanceSettings.url}/bdbs`,
      })
      .then((res: any) => res.data);
  }

  /**
   * Test Datasource
   */
  async testDatasource() {
    // Implement a health check for your data source.
    return {
      status: 'success',
      message: 'Success',
    };
  }
}

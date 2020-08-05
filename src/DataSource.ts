import {
  ArrayDataFrame,
  DataFrame,
  DataQueryRequest,
  DataQueryResponse,
  DataSourceApi,
  DataSourceInstanceSettings,
} from '@grafana/data';
import { getBackendSrv } from '@grafana/runtime';
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

    await Promise.all(
      options.targets.map(async query => {
        const nodes = await this.getNodes();
        const frame = new ArrayDataFrame(nodes);
        frame.refId = query.refId;

        data.push({
          ...frame,
          fields: frame.fields,
          length: nodes.length,
        });
      })
    );

    return { data };
  }

  /**
   * Get Nodes
   */
  async getNodes(): Promise<any[]> {
    console.log(this.instanceSettings);

    return getBackendSrv()
      .datasourceRequest({
        url: `${this.instanceSettings.url}/nodes`,
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

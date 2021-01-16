import React, { PureComponent } from 'react';
import { css } from 'emotion';
import { getDataSourceSrv, BackendSrv, getBackendSrv, DataSourceSrv } from '@grafana/runtime';
import { DataSourceInstanceSettings } from '@grafana/data';
import { Bdb, QueryTypeValue } from 'redis-enterprise-software-datasource/api';
import { EnterpriseDataSourceInstanceSettings } from 'types';
import { ClusterDatabase, NewDatasourceOptions } from './cluster-database';

interface Props {
  dataSource: EnterpriseDataSourceInstanceSettings;
}

interface State {
  bdbs: Bdb[];
  dataSources: DataSourceInstanceSettings[];
  isLoading: boolean;
}

export class ClusterDatabases extends PureComponent<Props, State> {
  /**
   * Service to communicate via http(s) to a remote backend such as the Grafana backend, a data source etc.
   */
  private backendSrv: BackendSrv = getBackendSrv();

  /**
   * Service for working with data sources
   */
  private dataSourceSrv: DataSourceSrv = getDataSourceSrv();

  state = {
    bdbs: [],
    dataSources: [],
    isLoading: true,
  };

  /**
   * Load databases and all data sources
   */
  async componentDidMount() {
    const dataSources: DataSourceInstanceSettings[] = await this.dataSourceSrv.getAll();
    const bdbs = await this.loadBdbs();

    this.setState({
      bdbs,
      dataSources,
      isLoading: false,
    });
  }

  /**
   * Load databases for current data source
   */
  loadBdbs = async () => {
    const dataSourceApi: any = await this.dataSourceSrv.get(this.props.dataSource.name);

    if (dataSourceApi) {
      return dataSourceApi.api.getBdbs({ queryType: QueryTypeValue.BDBS, refId: '' });
    }
    return Promise.resolve([]);
  };

  /**
   * Get correct config for data source
   * @param db
   * @param options
   */
  getDataSourceRequestData = (db: Bdb, options: NewDatasourceOptions) => {
    return {
      name: `${this.props.dataSource.fields.name}:${db.name}`,
      type: 'redis-datasource',
      url: options.url,
      access: 'proxy',
      jsonData: {
        acl: false,
        tlsSkipVerify: db.ssl,
        tlsAuth: db.ssl,
      },
      secureJsonData: {
        password: db.authentication_redis_pass,
        tlsClientCert: db.ssl ? db.authentication_ssl_client_certs[0] : '',
        tlsClientKey: db.ssl ? db.authentication_ssl_crdt_certs[0] : '',
        tlsCACert: db.ssl ? this.props.dataSource.fields.proxy_certificate : '',
      },
      secureJsonFields: {
        tlsClientCert: db.ssl,
        tlsClientKey: db.ssl,
        tlsCACert: db.ssl,
      },
    };
  };

  /**
   * Add a data source
   * @param db
   * @param options
   */
  onAddDataSource = async (db: Bdb, options: NewDatasourceOptions) => {
    await this.backendSrv.post('api/datasources', this.getDataSourceRequestData(db, options));
    const updatedDataSources = await this.backendSrv.get('api/datasources');

    this.setState({
      dataSources: updatedDataSources,
    });
  };

  /**
   * Render databases
   */
  render() {
    const { bdbs, dataSources, isLoading } = this.state;

    if (isLoading) {
      return 'Loading Databases...';
    }

    return (
      <>
        {bdbs.map((db: Bdb) => (
          <div key={db.name} className={css(`margin: 12px 0;`)}>
            <ClusterDatabase
              isCanAdd={
                !dataSources.find(
                  (item: DataSourceInstanceSettings) => item.name === `${this.props.dataSource.fields.name}:${db.name}`
                )
              }
              db={db}
              onAdd={this.onAddDataSource}
            />
          </div>
        ))}
      </>
    );
  }
}

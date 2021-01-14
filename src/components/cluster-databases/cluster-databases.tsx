import React, { PureComponent } from 'react';
import { getDataSourceSrv, BackendSrv, getBackendSrv } from '@grafana/runtime';
import { Bdb } from 'redis-enterprise-software-datasource/api';
import { ClusterDatabase, NewDatasourceOptions } from './cluster-database';

interface State {
  bdbs: Bdb[];
}

export class ClusterDatabases extends PureComponent<any, State> {
  /**
   * Service to communicate via http(s) to a remote backend such as the Grafana backend, a datasource etc.
   */
  private backendSrv: BackendSrv = getBackendSrv();

  state = {
    bdbs: [],
  };

  async componentDidMount() {
    const datasource: any = await getDataSourceSrv().get(this.props.datasource.name);
    const bdbs = await datasource.api.getBdbs({} as any);
    this.setState({
      bdbs,
    });
  }

  onAddDatasource = (db: Bdb, options: NewDatasourceOptions) => {
    this.backendSrv.post('api/datasources', {
      name: `${this.props.datasource.fields.name}:${db.name}`,
      type: 'redis-datasource',
      url: options.url,
      access: 'proxy',
      jsonData: {
        acl: true,
        tlsSkipVerify: db.ssl,
        user: 'Admin',
        tlsAuth: db.ssl,
      },
      secureJsonData: {
        password: db.authentication_redis_pass,
        tlsClientCert: db.authentication_ssl_client_certs[0],
      },
    });
  };

  render() {
    return this.state.bdbs.map((db: Bdb) => <ClusterDatabase key={db.name} db={db} onAdd={this.onAddDatasource} />);
  }
}

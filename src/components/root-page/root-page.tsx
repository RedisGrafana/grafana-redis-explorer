import { head } from 'lodash';
import React, { PureComponent } from 'react';
import {
  AppRootProps,
  DataQueryRequest,
  DataQueryResponse,
  DataQueryResponseData,
  DataSourceInstanceSettings,
  Field,
  NavModelItem,
} from '@grafana/data';
import { getDataSourceSrv, getBackendSrv } from '@grafana/runtime';
import { InfoBox } from '@grafana/ui';
import { DataSourceType } from '../../constants';
import { QueryTypeValue } from '../../redis-enterprise-software-datasource/api';
import { REQuery } from '../../redis-enterprise-software-datasource/types';
import { EnterpriseDataSourceInstanceSettings, GlobalSettings } from '../../types';
import { DataSourceList } from '../data-source-list';

/**
 * Properties
 */
interface Props extends AppRootProps<GlobalSettings> {}

/**
 * State
 */
interface State {
  /**
   * Data sources
   *
   * @type {any[]}
   */
  dataSources: EnterpriseDataSourceInstanceSettings[];

  /**
   * Loading
   *
   * @type {boolean}
   */
  loading: boolean;
}

/**
 * Root Page
 */
export class RootPage extends PureComponent<Props, State> {
  /**
   * Default state
   */
  state: State = {
    loading: true,
    dataSources: [],
  };

  /**
   * Mount
   */
  async componentDidMount() {
    this.updateNav();

    /**
     * Get data sources
     */
    const dataSources = await getBackendSrv()
      .get('/api/datasources')
      .then((result: DataSourceInstanceSettings[]) => {
        return result.filter((ds: DataSourceInstanceSettings) => {
          return ds.type === DataSourceType.SOFTWARE;
        });
      });

    /**
     * Check supported commands for Redis Data Sources
     */
    const finalDataSources = await Promise.all(
      dataSources.map(async (ds: DataSourceInstanceSettings) => {
        const enterpriseDs: EnterpriseDataSourceInstanceSettings = {
          ...ds,
          fields: {},
        };

        /**
         * Get Data Source
         */
        try {
          const redis = await getDataSourceSrv().get(ds.name);

          /**
           * Execute query
           */
          const query = (redis.query({
            targets: [{ queryType: QueryTypeValue.CLUSTER }],
          } as DataQueryRequest<REQuery>) as unknown) as Promise<DataQueryResponse>;

          /**
           * Get available commands
           */
          await query
            .then((response: DataQueryResponse) => response.data)
            .then((data: DataQueryResponseData[]) =>
              data.forEach((item: DataQueryResponseData) => {
                item.fields.forEach((field: Field) => {
                  enterpriseDs.fields[field.name] = head(field.values.toArray());
                });
              })
            )
            .catch(() => {});
        } catch (e) {
          /**
           * Workaround
           * Could be a case when dataSourceSrv does not contain a data source that was added via http api
           * We are unable to call updateFrontendSettings into plugins
           * https://github.com/grafana/grafana/blob/1d689888b0fc2de2dbed6e606eee19561a3ef006/public/app/features/datasources/state/actions.ts#L211
           */
          window.location.reload();
        }
        return enterpriseDs;
      })
    );

    /**
     * Set state
     */
    this.setState({
      dataSources: finalDataSources,
      loading: false,
    });
  }

  /**
   * Navigation
   */
  updateNav() {
    const { path, onNavChanged, meta } = this.props;
    const tabs: NavModelItem[] = [];

    /**
     * Home
     */
    tabs.push({
      text: 'Home',
      url: path,
      id: 'home',
      icon: 'fa fa-fw fa-database',
      active: true,
    });

    /**
     * Header
     */
    const node = {
      text: 'Redis Explorer',
      img: meta.info.logos.large,
      subTitle: 'Redis Enterprise clusters',
      url: path,
      children: tabs,
    };

    /**
     * Update the page header
     */
    onNavChanged({
      node: node,
      main: node,
    });
  }

  /**
   * Render
   */
  render() {
    const { loading, dataSources } = this.state;

    /**
     * Loading
     */
    if (loading) {
      return (
        <InfoBox title="Loading...">
          <p>Loading time depends on the number of configured data sources.</p>
        </InfoBox>
      );
    }

    return <DataSourceList dataSources={dataSources} query={this.props.query} />;
  }
}

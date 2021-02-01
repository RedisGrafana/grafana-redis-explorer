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
import { config, getBackendSrv, getDataSourceSrv } from '@grafana/runtime';
import { InfoBox } from '@grafana/ui';
import { DataSourceType } from '../../constants';
import { QueryTypeValue } from '../../redis-enterprise-software-datasource/api';
import { RedisEnterpriseQuery } from '../../redis-enterprise-software-datasource/types';
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
     * Workaround, until reload function will be added to DataSourceSrv
     *
     * @see https://github.com/grafana/grafana/issues/30728
     * @see https://github.com/grafana/grafana/issues/29809
     */
    await getBackendSrv()
      .get('/api/frontend/settings')
      .then((settings: any) => {
        if (!settings.datasources) {
          return;
        }
        console.log(config);

        /**
         * Set data sources
         */
        config.datasources = settings.datasources;
        config.defaultDatasource = settings.defaultDatasource;
      });

    /**
     * Get Cluster names for Redis Data Sources
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
        const redis = await getDataSourceSrv().get(ds.name);

        /**
         * Execute query
         */
        const query = (redis.query({
          targets: [{ queryType: QueryTypeValue.CLUSTER }],
        } as DataQueryRequest<RedisEnterpriseQuery>) as unknown) as Promise<DataQueryResponse>;

        /**
         * Get Cluster name
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

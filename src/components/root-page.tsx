import { head } from 'lodash';
import React, { PureComponent } from 'react';
import {
  AppRootProps,
  DataQueryRequest,
  DataQueryResponse,
  DataQueryResponseData,
  Field,
  NavModelItem,
} from '@grafana/data';
import { getBackendSrv, getDataSourceSrv } from '@grafana/runtime';
import { InfoBox } from '@grafana/ui';
import { QueryTypeValue } from '../redis-enterprise-software-datasource/api';
import { REQuery } from '../redis-enterprise-software-datasource/types';
import { DataSourceType, GlobalSettings } from '../types';
import { DataSourceList } from './data-source-list';

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
  datasources?: any[];

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
  };

  /**
   * Mount
   */
  async componentDidMount() {
    this.updateNav();

    /**
     * Get data sources
     */
    const datasources = await getBackendSrv()
      .get('/api/datasources')
      .then((result: any) => {
        return result.filter((ds: any) => {
          return ds.type === DataSourceType.SOFTWARE;
        });
      });

    /**
     * Check supported commands for Redis Data Sources
     */
    await Promise.all(
      datasources.map(async (ds: any) => {
        ds.fields = {};

        /**
         * Get Data Source
         */
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
                ds.fields[field.name] = head(field.values.toArray());
              });
            })
          );
      })
    );

    /**
     * Set state
     */
    this.setState({
      datasources,
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
      text: 'Redis Enterprise Application',
      img: meta.info.logos.large,
      subTitle: 'Redis Enterprise Data Source',
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
    const { loading, datasources } = this.state;

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

    return <DataSourceList datasources={datasources} />;
  }
}

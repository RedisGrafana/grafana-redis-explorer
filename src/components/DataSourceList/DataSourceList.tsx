import React, { FC, useCallback } from 'react';
import { getBackendSrv, locationService } from '@grafana/runtime';
import { Alert, Button, Container, HorizontalGroup, LinkButton, VerticalGroup } from '@grafana/ui';
import { ApplicationRoot, DataSourceName, DataSourceType } from '../../constants';
import { RedisEnterpriseSoftware } from '../../icons';
import { EnterpriseDataSourceInstanceSettings } from '../../types';
import { ClusterDatabases } from '../ClusterDatabases';

/**
 * Properties
 */
interface Props {
  /**
   * Data sources
   *
   * @type {EnterpriseDataSourceInstanceSettings[]}
   */
  dataSources: EnterpriseDataSourceInstanceSettings[];

  /**
   * Query
   */
  query?: {
    datasource?: string;
  };
}

/**
 * New Data Source
 *
 * @param dataSources
 */
const getNewDataSourceName = (dataSources: EnterpriseDataSourceInstanceSettings[]) => {
  let postfix = 1;
  const name = DataSourceName.SOFTWARE;

  /**
   * Check if exists
   */
  if (!dataSources.some((dataSource) => dataSource.name === name)) {
    return name;
  }

  while (dataSources.some((dataSource) => dataSource.name === `${name}-${postfix}`)) {
    postfix++;
  }

  return `${name}-${postfix}`;
};

/**
 * Data Sources list
 */
export const DataSourceList: FC<Props> = ({ dataSources, query }) => {
  const addNewDataSource = useCallback(() => {
    getBackendSrv()
      .post('/api/datasources', {
        name: getNewDataSourceName(dataSources),
        type: DataSourceType.SOFTWARE,
        access: 'proxy',
      })
      .then(({ datasource }) => {
        locationService.push(`/datasources/edit/${datasource.uid}`);
      });
  }, [dataSources]);

  /**
   * Check if any data sources was added
   */
  if (dataSources.length === 0) {
    return (
      <div>
        <div className="page-action-bar">
          <div className="page-action-bar__spacer" />
          <Button onClick={addNewDataSource} icon="plus" variant="secondary">
            Add Redis Enterprise Software
          </Button>
        </div>
        <Alert title="Please add Redis Enterprise Data Sources." severity="info">
          <p>You can add as many data sources as you want to support multiple Redis Enterprise clusters.</p>
        </Alert>
      </div>
    );
  }

  const isShowDataSourceDetails = query && query.datasource !== undefined;
  let renderedDataSources = dataSources;

  /**
   * Filter active data source if open url with ?datasource=[datasourceId]
   * Double checking query in the if statement is needed here for narrowing query type and good tests coverage,
   * because unable to create case when isShowDataSourceDetails=true and query=undefined.
   * It's a bug of typescript types narrowing.
   */
  if (isShowDataSourceDetails && query && query.datasource !== undefined) {
    let activeDataSourceId = parseInt(query.datasource, 10);

    renderedDataSources = dataSources.filter(
      (dataSources: EnterpriseDataSourceInstanceSettings) => dataSources.id === activeDataSourceId
    );
  }

  /**
   * Return
   */
  return (
    <div>
      <div className="page-action-bar">
        {isShowDataSourceDetails && (
          <LinkButton href={ApplicationRoot} icon="arrow-left" variant="link">
            Back
          </LinkButton>
        )}

        <div className="page-action-bar__spacer" />
        <Button onClick={addNewDataSource} icon="plus" variant="secondary">
          Add Redis Enterprise Software
        </Button>
      </div>

      <section className="card-section card-list-layout-list">
        <ol className="card-list">
          {renderedDataSources.map((redis: any, index: number) => {
            const title = redis.fields?.name ? 'Working as expected' : "Can't connect";
            const name = redis.fields?.name || 'Unknown';
            const url = redis.jsonData?.host || 'Not provided';
            const variant = redis.fields?.name ? 'primary' : 'destructive';
            const fill = redis.fields?.name ? '#DC382D' : '#A7A7A7';

            return (
              <li className="card-item-wrapper" key={index} aria-label="check-card">
                <a className="card-item" href={`d/viroIzSGz/cluster-overview?var-cluster=${redis.name}`}>
                  <HorizontalGroup justify="space-between">
                    <HorizontalGroup justify="flex-start">
                      <Container margin="xs">
                        <RedisEnterpriseSoftware size={32} fill={fill} title={title} />
                      </Container>
                      <VerticalGroup>
                        <div className="card-item-name">{redis.name}</div>
                        <div className="card-item-sub-name">{url}</div>
                      </VerticalGroup>
                    </HorizontalGroup>

                    <HorizontalGroup justify="flex-end">
                      <Container>
                        <LinkButton
                          variant={variant}
                          href={`d/viroIzSGz/cluster-overview?var-cluster=${redis.name}`}
                          title="Cluster Overview"
                          icon="compass"
                        >
                          {name}
                        </LinkButton>
                      </Container>

                      {!isShowDataSourceDetails && redis.fields?.name && (
                        <Container>
                          <LinkButton
                            variant="primary"
                            href={`${ApplicationRoot}?datasource=${redis.id}`}
                            title="Show cluster databases"
                            icon="database"
                          >
                            Databases
                          </LinkButton>
                        </Container>
                      )}

                      <Container>
                        <LinkButton
                          variant="secondary"
                          href={`datasources/edit/${redis.id}`}
                          title="Data Source Settings"
                          icon="sliders-v-alt"
                        >
                          Settings
                        </LinkButton>
                      </Container>
                    </HorizontalGroup>
                  </HorizontalGroup>
                </a>
              </li>
            );
          })}
        </ol>

        {isShowDataSourceDetails && renderedDataSources.length > 0 && (
          <div className="card-item-wrapper">
            <div className="card-item">
              <div className="card-item-name">Databases</div>
              <ClusterDatabases dataSource={renderedDataSources[0]} />
            </div>
          </div>
        )}
      </section>
    </div>
  );
};

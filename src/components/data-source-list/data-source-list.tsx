import { RedisEnterpriseSoftware } from 'icons';
import React, { FC } from 'react';
import { EnterpriseDataSourceInstanceSettings } from 'types';
import { Container, HorizontalGroup, InfoBox, LinkButton, VerticalGroup } from '@grafana/ui';
import { ClusterDatabases } from '../cluster-databases';

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
 * Data Sources list
 */
export const DataSourceList: FC<Props> = ({ dataSources, query }) => {
  /**
   * Check if any data sources was added
   */
  if (dataSources.length === 0) {
    return (
      <div>
        <div className="page-action-bar">
          <div className="page-action-bar__spacer" />
          <LinkButton href="datasources/new" icon="plus">
            Add Redis Enterprise Data Source
          </LinkButton>
        </div>
        <InfoBox title="Please add Redis Enterprise Data Sources.">
          <p>You can add as many data sources as you want to support multiple Redis Enterprise clusters.</p>
        </InfoBox>
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
          <LinkButton href="/a/redis-explorer-app/" icon="arrow-left" variant="link">
            Back
          </LinkButton>
        )}

        <div className="page-action-bar__spacer" />
        <LinkButton href="datasources/new" icon="plus" variant="secondary">
          Add Redis Enterprise Data Source
        </LinkButton>
      </div>

      <section className="card-section card-list-layout-list">
        <ol className="card-list">
          {renderedDataSources.map((redis: any, index: number) => {
            const title = redis.fields?.name ? 'Working as expected' : "Can't connect";
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
                        <div className="card-item-sub-name">{redis.jsonData?.host}</div>
                      </VerticalGroup>
                    </HorizontalGroup>

                    <HorizontalGroup justify="flex-end">
                      {!redis.commands?.length && (
                        <>
                          <Container margin="xs">
                            <div className="card-item-type">{redis.fields?.name}</div>
                          </Container>

                          {!isShowDataSourceDetails && (
                            <Container margin="xs">
                              <LinkButton
                                variant="primary"
                                href={`/a/redis-explorer-app?datasource=${redis.id}`}
                                title="Show cluster databases"
                                icon="database"
                              >
                                Databases
                              </LinkButton>
                              &nbsp;
                              <LinkButton
                                variant="secondary"
                                href={`datasources/edit/${redis.id}`}
                                title="Show cluster databases"
                                icon="sliders-v-alt"
                              >
                                Settings
                              </LinkButton>
                            </Container>
                          )}
                        </>
                      )}
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

import { RedisEnterpriseSoftware } from 'icons';
import { css } from 'emotion';
import React, { FC } from 'react';
import { Container, HorizontalGroup, InfoBox, LinkButton, VerticalGroup } from '@grafana/ui';
import { ClusterDatabases } from './cluster-databases';

/**
 * Properties
 */
interface Props {
  /**
   * Data sources
   *
   * @type {any[]}
   */
  datasources?: any[];
  query?: {
    datasource?: string;
  };
}

/**
 * Data Sources list
 */
export const DataSourceList: FC<Props> = ({ datasources, query }) => {
  /**
   * Check if any data sources was added
   */
  if (datasources?.length === 0) {
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

  const isShowDatasourceDetails = !!query?.datasource;
  const renderedDatasources: any = isShowDatasourceDetails
    ? [datasources?.find((datasource: any) => datasource.id === parseInt(query?.datasource || '', 10))].filter(
        (datasource) => !!datasource
      )
    : datasources;

  /**
   * Return
   */
  return (
    <div>
      <div className="page-action-bar">
        {isShowDatasourceDetails && (
          <LinkButton href="/a/redis-explorer/" icon="arrow-left" variant="link">
            Back
          </LinkButton>
        )}
        <div className="page-action-bar__spacer" />
        <LinkButton href="datasources/new" icon="plus">
          Add Redis Enterprise Data Source
        </LinkButton>
      </div>

      <section className="card-section card-list-layout-list">
        <ol className="card-list">
          {renderedDatasources?.map((redis: any, index: number) => {
            const title = redis.fields?.name ? 'Working as expected' : "Can't connect";
            const fill = redis.fields?.name ? '#DC382D' : '#A7A7A7';

            return (
              <li className="card-item-wrapper" key={index} aria-label="check-card">
                <a className="card-item" href={`datasources/edit/${redis.id}`}>
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
                          {!isShowDatasourceDetails && (
                            <Container margin="xs">
                              <LinkButton
                                variant="secondary"
                                href={`/a/redis-explorer?datasource=${redis.id}`}
                                title="Show cluster databases"
                                icon="database"
                              />
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
        {isShowDatasourceDetails && renderedDatasources.length > 0 && (
          <div
            className={css`
              background-color: #202226;
              padding: 16px;
            `}
          >
            <div className="card-item-name">Databases</div>
            <ClusterDatabases datasource={renderedDatasources[0]} />
          </div>
        )}
      </section>
    </div>
  );
};

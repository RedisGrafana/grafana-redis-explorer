import { RedisEnterpriseSoftware } from 'icons';
import React, { FC } from 'react';
import { Container, HorizontalGroup, InfoBox, LinkButton, VerticalGroup } from '@grafana/ui';

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
}

export const DataSourceList: FC<Props> = ({ datasources }) => {
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

  /**
   * Return
   */
  return (
    <div>
      <div className="page-action-bar">
        <div className="page-action-bar__spacer" />
        <LinkButton href="datasources/new" icon="plus">
          Add Redis Enterprise Data Source
        </LinkButton>
      </div>

      <section className="card-section card-list-layout-list">
        <ol className="card-list">
          {datasources?.map((redis, index) => {
            const title = redis.fields?.name ? 'Working as expected' : "Can't connect";
            const fill = redis.fields?.name ? '#5B62F5' : '#A7A7A7';

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
                        <div className="card-item-header">
                          <div className="card-item-type">{redis.fields?.name}</div>
                        </div>
                      )}
                    </HorizontalGroup>
                  </HorizontalGroup>
                </a>
              </li>
            );
          })}
        </ol>
      </section>
    </div>
  );
};

import {
  HighAvailability,
  MultiLayerSecurity,
  RedisAI,
  RedisBloom,
  RedisCube,
  RedisGears,
  RedisGraph,
  RedisJSON,
  RedisSearch,
  RedisTimeSeries,
} from 'icons';
import React, { PureComponent } from 'react';
import { Bdb, BdbEndpoint } from 'redis-enterprise-software-datasource/api';
import { SelectableValue } from '@grafana/data';
import { Button, Container, HorizontalGroup, InlineFormLabel, Select } from '@grafana/ui';
import { NewDatasourceOptions } from '../../types';

/**
 * Properties
 */
interface Props {
  /**
   * Database
   *
   * @type {Bdb}
   */
  db: Bdb;

  /**
   * Already added
   *
   * @type {boolean}
   */
  isCanAdd: boolean;

  onAdd: (db: Bdb, options: NewDatasourceOptions) => void;
}

/**
 * State
 */
interface State {
  endpointOptions: Array<SelectableValue<string>>;
  selectedEndpointValue: string | undefined;
}

/**
 * Icon Style
 */
const iconStyle = {
  marginTop: 6,
  display: 'inline-block',
};

/**
 * Cluster Database
 */
export class ClusterDatabase extends PureComponent<Props, State> {
  /**
   * Convert endpoint info to correct url for redis-datasource
   *
   * @param endpoint
   */
  static getBdbUrl(endpoint: BdbEndpoint) {
    return `redis://${endpoint.dns_name}:${endpoint.port}`;
  }

  /**
   * Converts endpoint to the selectable value
   *
   * @param endpoint
   */
  static convertEndpointToSelectableValue(endpoint: BdbEndpoint): SelectableValue<string> {
    return {
      value: ClusterDatabase.getBdbUrl(endpoint),
      label: endpoint.addr_type,
    };
  }

  /**
   * Constructor
   *
   * @param props
   */
  constructor(props: Props) {
    super(props);

    /**
     * Convert Endpoints To SelectableValues
     */
    const endpointOptions = this.props.db.endpoints.map((endpoint) =>
      ClusterDatabase.convertEndpointToSelectableValue(endpoint)
    );

    /**
     * Set State
     */
    this.state = {
      endpointOptions,
      selectedEndpointValue: endpointOptions.length > 0 ? endpointOptions[0].value : undefined,
    };
  }

  /**
   * Change Endpoint
   *
   * @param item
   */
  onChangeEndpoint = (item: SelectableValue<string>) => {
    this.setState({
      selectedEndpointValue: item.value!,
    });
  };

  /**
   * Add a new datasource
   */
  onAdd = () => {
    this.props.onAdd(this.props.db, { url: this.state.selectedEndpointValue! });
  };

  /**
   * Render
   */
  render() {
    const { isCanAdd, db } = this.props;
    const { endpointOptions, selectedEndpointValue } = this.state;
    const fill = '#DC382D';

    return (
      <HorizontalGroup justify="space-between" align="center">
        <HorizontalGroup justify="flex-start">
          {db.acl.length > 0 && (
            <Container margin="xs">
              <MultiLayerSecurity fill={fill} size={32} style={iconStyle} />
            </Container>
          )}

          {db.oss_cluster && (
            <Container margin="xs">
              <HighAvailability fill={fill} size={32} style={iconStyle} />
            </Container>
          )}

          {db.module_list.map((module) => (
            <Container margin="xs" key={module.module_id}>
              {module.module_name === 'timeseries' && <RedisTimeSeries fill={fill} size={32} style={iconStyle} />}
              {module.module_name === 'rg' && <RedisGears fill={fill} size={32} style={iconStyle} />}
              {(module.module_name === 'search' || module.module_name === 'ft') && (
                <RedisSearch fill={fill} size={32} style={iconStyle} />
              )}
              {module.module_name === 'bloom' && <RedisBloom fill={fill} size={32} style={iconStyle} />}
              {module.module_name === 'json' && <RedisJSON fill={fill} size={32} style={iconStyle} />}
              {module.module_name === 'graph' && <RedisGraph fill={fill} size={32} style={iconStyle} />}
              {module.module_name === 'ai' && <RedisAI fill={fill} size={32} style={iconStyle} />}
            </Container>
          ))}

          {!db.module_list.length && (
            <Container margin="xs">
              <RedisCube fill={fill} size={32} style={iconStyle} />
            </Container>
          )}

          <Container margin="xs">{this.props.db.name}</Container>
        </HorizontalGroup>

        <HorizontalGroup justify="flex-end">
          {isCanAdd && (
            <>
              {endpointOptions.length > 1 && (
                <Container margin="xs">
                  <div className="gf-form">
                    <InlineFormLabel width="auto">Endpoint</InlineFormLabel>
                    <Select
                      onChange={this.onChangeEndpoint}
                      options={endpointOptions}
                      value={selectedEndpointValue}
                      width={20}
                    />
                  </div>
                </Container>
              )}

              <Container>
                <Button onClick={this.onAdd} icon="plus">
                  Add Redis Data Source
                </Button>
              </Container>
            </>
          )}

          {!isCanAdd && <Container>Already added</Container>}
        </HorizontalGroup>
      </HorizontalGroup>
    );
  }
}

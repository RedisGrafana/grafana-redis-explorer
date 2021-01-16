import React, { PureComponent } from 'react';
import { SelectableValue } from '@grafana/data';
import { Select, Button, InlineFormLabel, HorizontalGroup, Container } from '@grafana/ui';
import { Bdb, BdbEndpoint } from 'redis-enterprise-software-datasource/api';
import {
  HighAvailability,
  MultiLayerSecurity,
  RedisAI,
  RedisBloom,
  RedisSearch,
  RedisGears,
  RedisGraph,
  RedisJSON,
  RedisTimeSeries,
} from 'icons';
import { NewDatasourceOptions } from './types';

interface Props {
  db: Bdb;
  onAdd: (db: Bdb, options: NewDatasourceOptions) => void;
  isCanAdd: boolean;
}

interface State {
  endpointOptions: Array<SelectableValue<string>>;
  selectedEndpointValue: string | undefined;
}

const iconStyle = {
  marginTop: 6,
  display: 'inline-block',
};

/**
 * ClusterDatabase
 */
export class ClusterDatabase extends PureComponent<Props, State> {
  /**
   * getBdbUrl convert endpoint info to correct url for redis-datasource
   * @param endpoint
   */
  static getBdbUrl(endpoint: BdbEndpoint) {
    return `redis://${endpoint.dns_name}:${endpoint.port}`;
  }

  /**
   * convertEndpointToSelectableValue converts endpoint to the selectable value
   * @param endpoint
   */
  static convertEndpointToSelectableValue(endpoint: BdbEndpoint): SelectableValue<string> {
    return {
      value: ClusterDatabase.getBdbUrl(endpoint),
      label: endpoint.addr_type,
    };
  }

  constructor(props: Props) {
    super(props);
    /**
     * Convert Endpoints To SelectableValues
     */
    const endpointOptions = this.props.db.endpoints.map((endpoint) =>
      ClusterDatabase.convertEndpointToSelectableValue(endpoint)
    );

    this.state = {
      endpointOptions,
      selectedEndpointValue: endpointOptions.length > 0 ? endpointOptions[0].value : undefined,
    };
  }

  /**
   * onChangeEndpoint
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

  render() {
    const { isCanAdd, db } = this.props;
    const { endpointOptions, selectedEndpointValue } = this.state;
    const fill = '#DC382D';

    return (
      <HorizontalGroup justify="space-between" align="center">
        <HorizontalGroup>
          <Container margin="xs">{this.props.db.name}</Container>
        </HorizontalGroup>
        <HorizontalGroup justify="flex-end">
          {(db.tls_mode !== 'disabled' || db.acl.length > 0) && (
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
              {module.module_name === 'search' && <RedisSearch fill={fill} size={32} style={iconStyle} />}
              {module.module_name === 'bloom' && <RedisBloom fill={fill} size={32} style={iconStyle} />}
              {module.module_name === 'json' && <RedisJSON fill={fill} size={32} style={iconStyle} />}
              {module.module_name === 'graph' && <RedisGraph fill={fill} size={32} style={iconStyle} />}
              {module.module_name === 'ai' && <RedisAI fill={fill} size={32} style={iconStyle} />}
            </Container>
          ))}
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
                <Button onClick={this.onAdd}>Add Redis Datasource</Button>
              </Container>
            </>
          )}
        </HorizontalGroup>
      </HorizontalGroup>
    );
  }
}

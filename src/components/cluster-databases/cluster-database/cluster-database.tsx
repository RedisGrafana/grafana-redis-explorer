import React, { PureComponent } from 'react';
import { SelectableValue } from '@grafana/data';
import { Select, Button, InlineFormLabel, HorizontalGroup, Container } from '@grafana/ui';
import { Bdb, BdbEndpoint } from 'redis-enterprise-software-datasource/api';
import { NewDatasourceOptions } from './types';

interface Props {
  db: Bdb;
  onAdd: (db: Bdb, options: NewDatasourceOptions) => void;
}

interface State {
  endpointOptions: SelectableValue[];
  selectedEndpointValue: string;
}

export class ClusterDatabase extends PureComponent<Props, State> {
  static getBdbUrl(endpoint: BdbEndpoint) {
    return `redis://${endpoint.dns_name}:${endpoint.port}`;
  }

  static convertEndpointToSelectableValue(endpoint: BdbEndpoint) {
    return {
      value: ClusterDatabase.getBdbUrl(endpoint),
      label: endpoint.addr_type,
    };
  }

  constructor(props: Props) {
    super(props);
    const endpointOptions = this.props.db.endpoints.map((endpoint) =>
      ClusterDatabase.convertEndpointToSelectableValue(endpoint)
    );

    this.state = {
      endpointOptions,
      selectedEndpointValue: endpointOptions[0].value,
    };
  }

  onChangeEndpoint = (item: SelectableValue<string>) => {
    this.setState({
      selectedEndpointValue: item.value!,
    });
  };

  onSave = () => {
    this.props.onAdd(this.props.db, { url: this.state.selectedEndpointValue });
  };

  render() {
    const { endpointOptions, selectedEndpointValue } = this.state;
    return (
      <HorizontalGroup justify="space-between" align="center" style={{ marginTop: 12 }}>
        <HorizontalGroup>
          <Container margin="xs">{this.props.db.name}</Container>
        </HorizontalGroup>
        <HorizontalGroup justify="flex-end">
          {/*{endpointOptions.length > 1 && (*/}
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
          {/*)}*/}
          <Container>
            <Button onClick={this.onSave}>Add Redis Datasource</Button>
          </Container>
        </HorizontalGroup>
      </HorizontalGroup>
    );
  }
}

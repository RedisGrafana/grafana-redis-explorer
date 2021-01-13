import React, { PureComponent } from 'react';
import { SelectableValue } from '@grafana/data';
import { Select, InlineFormLabel } from '@grafana/ui';
import { QueryTypeValue, VARIABLE_QUERY_TYPE } from '../../api';
import { VariableQuery } from '../../types';
import { DataSource } from '../../data-source';

interface VariableQueryProps {
  query: VariableQuery;
  onChange: (query: VariableQuery, definition: string) => void;
  datasource: DataSource;
}

export class VariableQueryEditor extends PureComponent<VariableQueryProps> {
  /**
   * Change query type
   * @param item
   */
  onChangeType = async (item: SelectableValue<QueryTypeValue>) => {
    const { query, onChange, datasource } = this.props;
    const newQuery = {
      ...query,
      queryType: item.value!,
    };
    const values = await datasource.metricFindQuery(newQuery);

    onChange(newQuery, values.map(({ text }) => text).join(','));
  };

  /**
   * Render editor
   */
  render() {
    const { query } = this.props;

    return (
      <div className="gf-form">
        <InlineFormLabel>Type</InlineFormLabel>
        <Select options={VARIABLE_QUERY_TYPE} value={query.queryType} onChange={this.onChangeType} />
      </div>
    );
  }
}

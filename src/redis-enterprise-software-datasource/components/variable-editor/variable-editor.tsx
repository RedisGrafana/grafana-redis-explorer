import React, { PureComponent } from 'react';
import { SelectableValue } from '@grafana/data';
import { InlineFormLabel, Select } from '@grafana/ui';
import { QueryTypeValue, VARIABLE_QUERY_TYPE } from '../../api';
import { DataSource } from '../../data-source';
import { VariableQuery } from '../../types';

/**
 * Properties
 */
interface VariableQueryProps {
  /**
   * Data source
   *
   * @type {DataSource}
   */
  datasource: DataSource;

  /**
   * Query
   *
   * @type {VariableQuery}
   */
  query: VariableQuery;
  onChange: (query: VariableQuery, definition: string) => void;
}

/**
 * Variable Query Editor
 */
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

    const noValuesText = newQuery.queryType === QueryTypeValue.BDBS ? 'Database ids' : 'Node ids';
    onChange(newQuery, values.map(({ text }) => text).join(',') || noValuesText);
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

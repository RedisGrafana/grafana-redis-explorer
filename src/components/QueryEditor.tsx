import React, { PureComponent } from 'react';
import { QueryEditorProps, SelectableValue } from '@grafana/data';
import { InlineFormLabel, Select } from '@grafana/ui';
import { QUERY_TYPE, QueryTypeValue } from '../api';
import { DataSource } from '../DataSource';
import { REDataSourceOptions, REQuery } from '../types';

/**
 * Editor Property
 */
type Props = QueryEditorProps<DataSource, REQuery, REDataSourceOptions>;

/**
 * Query Editor
 */
export class QueryEditor extends PureComponent<Props> {
  /**
   * On Query Type change
   */
  onQueryTypeChanged = (item: SelectableValue<QueryTypeValue>) => {
    const { onChange, onRunQuery, query } = this.props;
    onChange({
      ...query,
      queryType: item.value!,
    });
    onRunQuery();
  };

  /**
   * Render Editor
   */
  render() {
    return (
      <div className="gf-form">
        <InlineFormLabel width={8}>Type</InlineFormLabel>
        <Select
          width={40}
          options={QUERY_TYPE}
          value={QUERY_TYPE.find(t => t.value === this.props.query.queryType)}
          onChange={this.onQueryTypeChanged}
        />
      </div>
    );
  }
}

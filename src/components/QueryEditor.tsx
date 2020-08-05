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
   * Databases options
   *
   * @type {SelectableValue[]}
   */
  bdbs: SelectableValue[] = [];

  /**
   * Init component data
   *
   * @async
   */
  async componentDidMount() {
    await this.getBdbs();
  }

  /**
   * On Query Type change
   *
   * @async
   * @param {SelectableValue<QueryTypeValue>} item Type value
   */
  onQueryTypeChanged = async (item: SelectableValue<QueryTypeValue>) => {
    const { onChange, onRunQuery, query } = this.props;
    onChange({
      ...query,
      queryType: item.value!,
    });

    switch (item.value) {
      case QueryTypeValue.BDB_ALERTS:
        break;
      default:
        onRunQuery();
    }
  };

  /**
   * On Database change
   *
   * @param {SelectableValue<Record<string, any>>} item Bdb value
   */
  onDatabaseChanged = (item: SelectableValue<Record<string, any>>) => {
    const { onChange, onRunQuery, query } = this.props;
    onChange({
      ...query,
      bdb: item.value!,
    });

    onRunQuery();
  };

  /**
   * Render Editor
   */
  render() {
    const { query } = this.props;

    /**
     * Return content
     */
    return (
      <div className="gf-form">
        <InlineFormLabel width={8}>Type</InlineFormLabel>
        <Select
          width={40}
          options={QUERY_TYPE}
          value={QUERY_TYPE.find((type) => type.value === query.queryType)}
          onChange={this.onQueryTypeChanged}
        />
        <span>&nbsp;</span>
        {query.queryType === QueryTypeValue.BDB_ALERTS && (
          <>
            <InlineFormLabel width={8}>Database</InlineFormLabel>
            <Select width={40} options={this.bdbs} menuPlacement="bottom" onChange={this.onDatabaseChanged} />
          </>
        )}
      </div>
    );
  }

  /**
   * Get databases options
   *
   * @async
   */
  private async getBdbs() {
    const bdbs = await this.props.datasource.getBdbs();

    /**
     * Return Databases
     */
    this.bdbs = bdbs.map((bdb) => {
      return {
        label: bdb.name,
        value: bdb.uid,
      };
    });
  }
}

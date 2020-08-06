import React, { ChangeEvent, PureComponent } from 'react';
import { QueryEditorProps, SelectableValue } from '@grafana/data';
import { Button, InlineFormLabel, LegacyForms, Select } from '@grafana/ui';
import { QUERY_TYPE, QueryTypeValue } from '../api';
import { DataSource } from '../DataSource';
import { REDataSourceOptions, REQuery } from '../types';

/**
 * Form Field
 */
const { FormField } = LegacyForms;

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
  onQueryTypeChange = async (item: SelectableValue<QueryTypeValue>) => {
    const { onChange, query } = this.props;
    onChange({
      ...query,
      queryType: item.value!,
    });
  };

  /**
   * On Database change
   *
   * @param {SelectableValue<Record<string, any>>} item Bdb value
   */
  onDatabaseChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { onChange, query } = this.props;
    onChange({ ...query, bdb: event.target.value });
  };

  /**
   * On Node change
   *
   * @param {SelectableValue<Record<string, any>>} item Node value
   */
  onNodeChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { onChange, query } = this.props;
    onChange({ ...query, node: event.target.value });
  };

  /**
   * Execute the Query
   */
  executeQuery = () => {
    const { onRunQuery } = this.props;
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
      <div>
        <div className="gf-form">
          <InlineFormLabel width={8}>Type</InlineFormLabel>
          <Select
            width={40}
            options={QUERY_TYPE}
            value={QUERY_TYPE.find((type) => type.value === query.queryType)}
            onChange={this.onQueryTypeChange}
          />
          <span>&nbsp;</span>
          {query.queryType === QueryTypeValue.BDBS && (
            <>
              <FormField
                labelWidth={8}
                inputWidth={10}
                value={query.bdb}
                onChange={this.onDatabaseChange}
                label="Database Id"
                tooltip="Specify to return specific node information"
              />
            </>
          )}
          {query.queryType === QueryTypeValue.NODES && (
            <>
              <FormField
                labelWidth={8}
                inputWidth={10}
                value={query.node}
                onChange={this.onNodeChange}
                label="Node Id"
                tooltip="Specify to return specific node information"
              />
            </>
          )}
        </div>

        <Button onClick={this.executeQuery}>Run</Button>
      </div>
    );
  }

  /**
   * Get databases options
   *
   * @async
   */
  private async getBdbs() {
    //    const bdbs = []; //await this.props.datasource.api.getBdbs();
    /**
     * Return Databases
     */
    //  this.bdbs = bdbs.map((bdb) => {
    //  return {
    //   label: bdb.name,
    //      value: bdb.uid,
    //  };
    // });
  }
}

import React, { ChangeEvent, PureComponent } from 'react';
import { css } from '@emotion/css';
import { QueryEditorProps, SelectableValue } from '@grafana/data';
import { Button, InlineFormLabel, LegacyForms, Select } from '@grafana/ui';
import { ALERT_TYPE, QUERY_TYPE, QueryTypeValue, STATS_INTERVAL, STATS_TYPE } from '../../api';
import { DataSource } from '../../data-source';
import { DataSourceOptions, RedisEnterpriseQuery } from '../../types';

/**
 * Form Field
 */
const { FormField } = LegacyForms;

/**
 * Editor Property
 */
type Props = QueryEditorProps<DataSource, RedisEnterpriseQuery, DataSourceOptions>;

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
    onChange({ ...query, queryType: item.value! });
  };

  /**
   * On Alert Type change
   *
   * @async
   * @param {SelectableValue<QueryTypeValue>} item Type value
   */
  onAlertTypeChange = async (item: SelectableValue<QueryTypeValue>) => {
    const { onChange, query } = this.props;
    onChange({ ...query, alertType: item.value! });
  };

  /**
   * On Stats Type change
   *
   * @async
   * @param {SelectableValue<QueryTypeValue>} item Type value
   */
  onStatsTypeChange = async (item: SelectableValue<QueryTypeValue>) => {
    const { onChange, query } = this.props;
    onChange({ ...query, statsType: item.value! });
  };

  /**
   * On Stats Interval change
   *
   * @async
   * @param {SelectableValue<QueryTypeValue>} item Type value
   */
  onStatsIntervalChange = async (item: SelectableValue<QueryTypeValue>) => {
    const { onChange, query } = this.props;
    onChange({ ...query, statsInterval: item.value! });
  };

  /**
   * On Database change
   *
   * @param {ChangeEvent<HTMLInputElement>} event Event
   */
  onDatabaseChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { onChange, query } = this.props;
    onChange({ ...query, bdb: event.target.value });
  };

  /**
   * On Node change
   *
   * @param {ChangeEvent<HTMLInputElement>} event Event
   */
  onNodeChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { onChange, query } = this.props;
    onChange({ ...query, node: event.target.value });
  };

  /**
   * On Module change
   *
   * @param {ChangeEvent<HTMLInputElement>} event Event
   */
  onModuleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { onChange, query } = this.props;
    onChange({ ...query, module: event.target.value });
  };

  /**
   * On User change
   *
   * @param {ChangeEvent<HTMLInputElement>} event Event
   */
  onUserChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { onChange, query } = this.props;
    onChange({ ...query, user: event.target.value });
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
            className={css`
              margin-right: 5px;
            `}
            width={40}
            options={QUERY_TYPE}
            value={QUERY_TYPE.find((type) => type.value === query.queryType)}
            onChange={this.onQueryTypeChange}
          />

          {query.queryType === QueryTypeValue.ALERTS && (
            <>
              <InlineFormLabel width={8}>Type</InlineFormLabel>
              <Select
                width={40}
                options={ALERT_TYPE}
                value={ALERT_TYPE.find((type) => type.value === query.alertType)}
                onChange={this.onAlertTypeChange}
              />
            </>
          )}
        </div>

        <div className="gf-form">
          {query.queryType === QueryTypeValue.ALERTS && query.alertType && (
            <div className="gf-form">
              {query.alertType === QueryTypeValue.BDBS && (
                <FormField
                  labelWidth={8}
                  inputWidth={10}
                  value={query.bdb}
                  onChange={this.onDatabaseChange}
                  label="Database Id"
                  tooltip="Specify to return specific database information"
                />
              )}

              {query.alertType === QueryTypeValue.NODES && (
                <FormField
                  labelWidth={8}
                  inputWidth={10}
                  value={query.node}
                  onChange={this.onNodeChange}
                  label="Node Id"
                  tooltip="Specify to return specific node information"
                />
              )}
            </div>
          )}

          {query.queryType === QueryTypeValue.STATS && (
            <>
              <InlineFormLabel width={8}>Type</InlineFormLabel>
              <Select
                width={40}
                options={STATS_TYPE}
                value={STATS_TYPE.find((type) => type.value === query.statsType)}
                onChange={this.onStatsTypeChange}
              />
            </>
          )}

          {query.queryType === QueryTypeValue.BDBS && (
            <FormField
              labelWidth={8}
              inputWidth={10}
              value={query.bdb}
              onChange={this.onDatabaseChange}
              label="Database Id"
              tooltip="Specify to return specific database information"
            />
          )}

          {query.queryType === QueryTypeValue.NODES && (
            <FormField
              labelWidth={8}
              inputWidth={10}
              value={query.node}
              onChange={this.onNodeChange}
              label="Node Id"
              tooltip="Specify to return specific node information"
            />
          )}

          {query.queryType === QueryTypeValue.MODULES && (
            <FormField
              labelWidth={8}
              inputWidth={10}
              value={query.module}
              onChange={this.onModuleChange}
              label="Module Id"
              tooltip="Specify to return specific module information"
            />
          )}

          {query.queryType === QueryTypeValue.USERS && (
            <FormField
              labelWidth={8}
              inputWidth={10}
              value={query.user}
              onChange={this.onUserChange}
              label="User Id"
              tooltip="Specify to return specific user information"
            />
          )}
        </div>

        {query.queryType === QueryTypeValue.STATS && query.statsType && (
          <div className="gf-form">
            <InlineFormLabel width={8}>Interval</InlineFormLabel>
            <Select
              className={css`
                margin-right: 5px;
              `}
              width={40}
              options={STATS_INTERVAL}
              allowCustomValue={true}
              value={STATS_INTERVAL.find((type) => type.value === query.statsInterval)}
              onChange={this.onStatsIntervalChange}
            />

            {query.statsType === QueryTypeValue.BDBS && (
              <FormField
                labelWidth={8}
                inputWidth={10}
                value={query.bdb}
                onChange={this.onDatabaseChange}
                label="Database Id"
                tooltip="Specify to return specific database information"
              />
            )}
            {query.statsType === QueryTypeValue.NODES && (
              <FormField
                labelWidth={8}
                inputWidth={10}
                value={query.node}
                onChange={this.onNodeChange}
                label="Node Id"
                tooltip="Specify to return specific node information"
              />
            )}
          </div>
        )}

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

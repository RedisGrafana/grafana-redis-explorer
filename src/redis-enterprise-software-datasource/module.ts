import { DataSourcePlugin } from '@grafana/data';
import { ConfigEditor, QueryEditor, VariableQueryEditor } from './components';
import { DataSource } from './data-source';
import { DataSourceOptions, RedisEnterpriseQuery } from './types';

/**
 * Init Data Source plugin
 */
export const plugin = new DataSourcePlugin<DataSource, RedisEnterpriseQuery, DataSourceOptions>(DataSource)
  .setConfigEditor(ConfigEditor)
  .setQueryEditor(QueryEditor)
  .setVariableQueryEditor(VariableQueryEditor);

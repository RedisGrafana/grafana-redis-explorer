import { DataSourcePlugin } from '@grafana/data';
import { ConfigEditor } from './components/ConfigEditor';
import { QueryEditor } from './components/QueryEditor';
import { DataSource } from './DataSource';
import { REDataSourceOptions, REQuery } from './types';

/**
 * Init Data Source plugin
 */
export const plugin = new DataSourcePlugin<DataSource, REQuery, REDataSourceOptions>(DataSource)
  .setConfigEditor(ConfigEditor)
  .setQueryEditor(QueryEditor);

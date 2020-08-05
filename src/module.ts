import { DataSourcePlugin } from '@grafana/data';
import { ConfigEditor } from './components/ConfigEditor';
import { QueryEditor } from './components/QueryEditor';
import { REDataSourceOptions, REQuery } from './types';
import { DataSource } from './DataSource';

/**
 * Init Data Source plugin
 */
export const plugin = new DataSourcePlugin<DataSource, REQuery, REDataSourceOptions>(DataSource)
  .setConfigEditor(ConfigEditor)
  .setQueryEditor(QueryEditor);

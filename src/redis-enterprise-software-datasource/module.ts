import { DataSourcePlugin } from '@grafana/data';
import { ConfigEditor, QueryEditor } from './components';
import { DataSource } from './data-source';
import { REDataSourceOptions, REQuery } from './types';

/**
 * Init Data Source plugin
 */
export const plugin = new DataSourcePlugin<DataSource, REQuery, REDataSourceOptions>(DataSource)
  .setConfigEditor(ConfigEditor)
  .setQueryEditor(QueryEditor);

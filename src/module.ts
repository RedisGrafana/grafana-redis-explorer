import { DataSourcePlugin } from '@grafana/data';
import { ConfigEditor } from './ConfigEditor';
import { DataSource } from './DataSource';
import { QueryEditor } from './QueryEditor';
import { REDataSourceOptions, REQuery } from './types';

/**
 * Data Source plugin
 */
export const plugin = new DataSourcePlugin<DataSource, REQuery, REDataSourceOptions>(DataSource)
  .setConfigEditor(ConfigEditor)
  .setQueryEditor(QueryEditor);

import React, { PureComponent } from 'react';
import { QueryEditorProps } from '@grafana/data';
import { DataSource } from './DataSource';
import { REDataSourceOptions, REQuery } from './types';

/**
 * Form Field
 */
//const { FormField } = LegacyForms;

/**
 * Editor Property
 */
type Props = QueryEditorProps<DataSource, REQuery, REDataSourceOptions>;

/**
 * Query Editor
 */
export class QueryEditor extends PureComponent<Props> {
  /**
   * Render Editor
   */
  render() {
    /**
     * Return
     */
    return <div className="gf-form"></div>;
  }
}

import { QueryTypeValue } from 'api/types';
import { DataQuery, DataSourceJsonData, FieldType, ValueConverter } from '@grafana/data';

/**
 * Query interface
 */
export interface REQuery extends DataQuery {
  /**
   * Query Type
   *
   * @type {QueryTypeValue}
   */
  queryType: QueryTypeValue;

  /**
   * Database
   *
   * @type {string}
   */
  bdb?: string;

  /**
   * Node
   *
   * @type {string}
   */
  node?: string;
}

/**
 * Datasource configuration options.
 * These are options configured for each DataSource instance
 */
export interface REDataSourceOptions extends DataSourceJsonData {
  /**
   * Host to access Redis Enterprise API
   *
   * @type {string}
   */
  host: string;

  /**
   * TLS Skip Verify
   *
   * @type {boolean}
   */
  tlsSkipVerify: boolean;
}

/**
 * Datasource secure configuration options.
 * Value that is used in the backend, but never sent over HTTP to the frontend
 */
export interface RESecureJsonData {
  /**
   * Password to access Redis Enterprise API
   *
   * @type {string}
   */
  basicAuthPassword: string;
}

/**
 * Datasource test status
 */
export enum DataSourceTestStatus {
  SUCCESS = 'success',
  ERROR = 'error',
}

/**
 * Datasource test result
 */
export interface DataSourceTestResult {
  status: DataSourceTestStatus;
  message: string;
}

/**
 * Datasource frame field
 */
export interface DataSourceFrameField {
  name: string;
  type: FieldType;
  converter?: ValueConverter;
}

/**
 * Datasource frame
 */
export interface DataSourceFrame {
  [type: string]: DataSourceFrameField[];
}

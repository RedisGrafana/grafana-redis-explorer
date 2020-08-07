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

  /**
   * Module
   *
   * @type {string}
   */
  module?: string;
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
  /**
   * Status
   *
   * @type {DataSourceTestStatus}
   */
  status: DataSourceTestStatus;

  /**
   * Message
   *
   * @type {string}
   */
  message: string;
}

/**
 * Datasource frame type
 */
export enum DataSourceFrameType {
  ARRAY = 'ArrayDataFrame',
  MUTABLE = 'MutableDataFrame',
}

/**
 * Datasource array frame field
 */
export interface DataSourceArrayFrameField {
  /**
   * Field Name
   *
   * @type {string}
   */
  name: string;

  /**
   * Type
   *
   * @type {FieldType}
   */
  type: FieldType;

  /**
   * Converter
   *
   * @type {ValueConverter}
   */
  converter?: ValueConverter;
}

/**
 * Datasource mutable frame field
 */
export interface DataSourceMutableField {
  /**
   * Field Name
   *
   * @type {string}
   */
  name: string;

  /**
   * Type
   *
   * @type {FieldType}
   */
  type: FieldType;
}

/**
 * Datasource frame
 */
export interface DataSourceFrame {
  [type: string]: {
    frame: DataSourceFrameType;
    fields: (DataSourceArrayFrameField | DataSourceMutableField)[];
  };
}

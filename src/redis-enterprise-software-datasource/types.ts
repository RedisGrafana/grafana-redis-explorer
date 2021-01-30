import { DataQuery, DataSourceJsonData, FieldType, ValueConverter } from '@grafana/data';
import { QueryTypeValue } from './api';
import { DataSourceFrameType, DataSourceTestStatus } from './constants';

/**
 * Variable Query interface
 */
export interface VariableQuery {
  /**
   * Query Type
   *
   * @type {QueryTypeValue}
   */
  queryType: QueryTypeValue;
}

/**
 * Query interface
 */
export interface RedisEnterpriseQuery extends DataQuery {
  /**
   * Query Type
   *
   * @type {QueryTypeValue}
   */
  queryType: QueryTypeValue;

  /**
   * Alert Type
   *
   * @type {QueryTypeValue}
   */
  alertType?: QueryTypeValue;

  /**
   * Stats Type
   *
   * @type {QueryTypeValue}
   */
  statsType?: QueryTypeValue;

  /**
   * Stats Interval
   *
   * @type {string}
   */
  statsInterval?: string;

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

  /**
   * User
   *
   * @type {string}
   */
  user?: string;
}

/**
 * Datasource configuration options.
 * These are options configured for each DataSource instance
 */
export interface DataSourceOptions extends DataSourceJsonData {
  /**
   * Host to access Redis Enterprise Software API
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
export interface SecureJsonData {
  /**
   * Password to access Redis Enterprise Software API
   *
   * @type {string}
   */
  basicAuthPassword: string;
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
    fields: Array<DataSourceArrayFrameField | DataSourceMutableField>;
    omit?: string[];
  };
}

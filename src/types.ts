import { QueryTypeValue } from 'api';
import { DataQuery, DataSourceJsonData } from '@grafana/data';

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
   * @type {Record<string, any>}
   */
  bdb?: Record<string, any>;
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

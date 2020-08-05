import { DataQuery, DataSourceJsonData } from '@grafana/data';

/**
 * Query interface
 */
export interface REQuery extends DataQuery {}

/**
 * Default query
 *
 * @type {Partial<REQuery>}
 */
export const defaultQuery: Partial<REQuery> = {};

/**
 * Datasource configuration options.
 * These are options configured for each DataSource instance
 */
export interface REDataSourceOptions extends DataSourceJsonData {
  /**
   * Host to access Redis Enterprise API
   * Example: https://redis:9443
   */
  host: string;

  /**
   * User to access Redis Enterprise API
   */
  user: string;

  /**
   * TLS Skip Verify
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
   */
  password: string;
}

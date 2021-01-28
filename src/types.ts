import { DataSourceInstanceSettings } from '@grafana/data';

/**
 * Global Settings
 */
export interface GlobalSettings {}

/**
 * SVG
 */
export interface SVGProps extends React.HTMLAttributes<SVGElement> {
  /**
   * Size
   *
   * @type {number}
   */
  size: number;

  /**
   * Fill color
   *
   * @type {string}
   */
  fill?: string;

  /**
   * Title
   *
   * @type {string}
   */
  title?: string;

  /**
   * Class Name
   *
   * @type {string}
   */
  className?: string;
}

/**
 * Instance Settings
 */
export interface EnterpriseDataSourceInstanceSettings extends DataSourceInstanceSettings {
  /**
   * Fields
   *
   * @type {any}
   */
  fields: any;
}

/**
 * New Data Source Options
 */
export interface NewDatasourceOptions {
  /**
   * URL
   *
   * @type {string}
   */
  url: string;
}

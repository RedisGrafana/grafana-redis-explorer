import { DataSourceInstanceSettings } from '@grafana/data';

/**
 * Global Settings
 */
export interface GlobalSettings {}

/**
 * Data Source types
 */
export enum DataSourceType {
  SOFTWARE = 'redis-enterprise-software-datasource',
}

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

export interface EnterpriseDataSourceInstanceSettings extends DataSourceInstanceSettings {
  fields: any;
}

import { SelectableValue } from '@grafana/data';

/**
 * Query Type Values
 */
export enum QueryTypeValue {
  ALERTS = 'alerts',
  BDBS = 'bdbs',
  CLUSTER = 'cluster',
  LICENSE = 'license',
  LOGS = 'logs',
  MODULES = 'modules',
  NODES = 'nodes',
  STATS = 'stats',
  USERS = 'users',
}

/**
 * Query Type
 *
 * @type {SelectableValue[]}
 */
export const QUERY_TYPE: SelectableValue[] = [
  {
    label: 'Alerts',
    description: 'Database, Nodes and Cluster alerts',
    value: QueryTypeValue.ALERTS,
  },
  {
    label: 'Databases',
    description: 'All databases or specific database information',
    value: QueryTypeValue.BDBS,
  },
  {
    label: 'Cluster',
    description: 'Cluster information',
    value: QueryTypeValue.CLUSTER,
  },
  {
    label: 'Cluster Logs',
    description: 'Cluster events log',
    value: QueryTypeValue.LOGS,
  },
  {
    label: 'License',
    description: 'License information',
    value: QueryTypeValue.LICENSE,
  },
  {
    label: 'Modules',
    description: 'All modules or specific module information',
    value: QueryTypeValue.MODULES,
  },
  {
    label: 'Nodes',
    description: 'All nodes or specific node information',
    value: QueryTypeValue.NODES,
  },
  {
    label: 'Stats',
    description: 'Database, Nodes and Cluster stats',
    value: QueryTypeValue.STATS,
  },
];

/**
 * Alert type
 *
 * @type {SelectableValue[]}
 */
export const ALERT_TYPE: SelectableValue[] = [
  {
    label: 'Database',
    description: 'Specific database',
    value: QueryTypeValue.BDBS,
  },
  {
    label: 'Node',
    description: 'Specific node',
    value: QueryTypeValue.NODES,
  },
];

/**
 * Stats type
 *
 * @type {SelectableValue[]}
 */
export const STATS_TYPE: SelectableValue[] = [
  {
    label: 'Cluster',
    description: 'Cluster',
    value: QueryTypeValue.CLUSTER,
  },
  {
    label: 'Database',
    description: 'Specific database',
    value: QueryTypeValue.BDBS,
  },
  {
    label: 'Node',
    description: 'Specific node',
    value: QueryTypeValue.NODES,
  },
];

/**
 * Stats interval
 *
 * @type {SelectableValue[]}
 */
export const STATS_INTERVAL: SelectableValue[] = [
  {
    label: '1 Second',
    value: '1sec',
  },
  {
    label: '10 Seconds',
    value: '10sec',
  },
  {
    label: '5 Minutes',
    value: '5min',
  },
  {
    label: '15 Minutes',
    value: '15min',
  },
  {
    label: '1 Hour',
    value: '1hour',
  },
  {
    label: '12 Hours',
    value: '12hour',
  },
  {
    label: '1 Week',
    value: '1week',
  },
];

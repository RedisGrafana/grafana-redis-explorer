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
    label: 'Databases',
    description: 'All databases or specific database information',
    value: QueryTypeValue.BDBS,
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
  {
    label: 'Users',
    description: 'All users or specific user information',
    value: QueryTypeValue.USERS,
  },
];

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
  USERS = 'users',
}

/**
 * Query Type
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
];

/**
 * Alert type
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

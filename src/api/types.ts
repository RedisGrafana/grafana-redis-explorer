import { dateMath, FieldType, SelectableValue } from '@grafana/data';
import { DataSourceFrame, DataSourceFrameType } from '../types';

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
}

/**
 * Log item
 */
export interface LogItem {
  time: string;
  content: string;
  level: string;
}

/**
 * Datasource frame data
 */
export const DATASOURCE_FRAME: DataSourceFrame = {
  [QueryTypeValue.CLUSTER]: {
    frame: DataSourceFrameType.ARRAY,
    fields: [
      {
        name: 'name',
        type: FieldType.string,
      },
    ],
  },
  [QueryTypeValue.LICENSE]: {
    frame: DataSourceFrameType.ARRAY,
    fields: [
      {
        name: 'name',
        type: FieldType.string,
      },
      {
        name: 'expired',
        type: FieldType.boolean,
      },
      {
        name: 'shards_limit',
        type: FieldType.number,
      },
      {
        name: 'activation_date',
        type: FieldType.time,
        converter: (value: string) => dateMath.parse(value),
      },
      {
        name: 'expiration_date',
        type: FieldType.time,
        converter: (value: string) => dateMath.parse(value),
      },
    ],
  },
  [QueryTypeValue.NODES]: {
    frame: DataSourceFrameType.ARRAY,
    fields: [
      {
        name: 'uid',
        type: FieldType.number,
      },
      {
        name: 'total_memory',
        type: FieldType.number,
      },
    ],
  },
  [QueryTypeValue.MODULES]: {
    frame: DataSourceFrameType.ARRAY,
    fields: [
      {
        name: 'uid',
        type: FieldType.string,
      },
      {
        name: 'semantic_version',
        type: FieldType.string,
      },
      {
        name: 'display_name',
        type: FieldType.string,
      },
    ],
  },
  [QueryTypeValue.BDBS]: {
    frame: DataSourceFrameType.ARRAY,
    fields: [
      {
        name: 'group_uid',
        type: FieldType.number,
      },
      {
        name: 'redis_version',
        type: FieldType.number,
      },
      {
        name: 'port',
        type: FieldType.number,
      },
      {
        name: 'memory_size',
        type: FieldType.number,
      },
      {
        name: 'backup',
        type: FieldType.boolean,
      },
      {
        name: 'replication',
        type: FieldType.boolean,
      },
    ],
  },
  [QueryTypeValue.ALERTS]: {
    frame: DataSourceFrameType.ARRAY,
    fields: [],
  },
  [QueryTypeValue.LOGS]: {
    frame: DataSourceFrameType.MUTABLE,
    fields: [
      {
        name: 'time',
        type: FieldType.time,
      },
      {
        name: 'content',
        type: FieldType.string,
      },
      {
        name: 'level',
        type: FieldType.string,
      },
    ],
  },
};

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

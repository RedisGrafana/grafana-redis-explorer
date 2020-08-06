import { DataSourceFrame } from 'types';
import { dateMath, FieldType, SelectableValue } from '@grafana/data';

/**
 * Query Type Values
 */
export enum QueryTypeValue {
  CLUSTER = 'cluster',
  LICENSE = 'license',
  NODES = 'nodes',
  BDBS = 'bdbs',
  BDB_ALERTS = 'bdbAlerts',
}

/**
 * Datasource frame data
 */
export const DATASOURCE_FRAME: DataSourceFrame = {
  [QueryTypeValue.CLUSTER]: [
    {
      name: 'name',
      type: FieldType.string,
    },
  ],
  [QueryTypeValue.LICENSE]: [
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
  [QueryTypeValue.NODES]: [
    {
      name: 'uid',
      type: FieldType.number,
    },
    {
      name: 'total_memory',
      type: FieldType.number,
    },
  ],
  [QueryTypeValue.BDBS]: [
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
  [QueryTypeValue.BDB_ALERTS]: [],
};

/**
 * Query Type
 */
export const QUERY_TYPE: SelectableValue[] = [
  {
    label: 'Cluster',
    description: 'Cluster information',
    value: QueryTypeValue.CLUSTER,
  },
  {
    label: 'License',
    description: 'License information',
    value: QueryTypeValue.LICENSE,
  },
  {
    label: 'Nodes',
    description: 'All nodes or specific node information',
    value: QueryTypeValue.NODES,
  },
  {
    label: 'Databases',
    description: 'All databases or specific database information',
    value: QueryTypeValue.BDBS,
  },
  {
    label: 'Database Alerts',
    description: 'Database alerts',
    value: QueryTypeValue.BDB_ALERTS,
  },
];

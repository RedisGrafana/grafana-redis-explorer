import { dateMath, FieldType, ValueConverter, SelectableValue } from '@grafana/data';

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
 * Datasource test status
 */
export enum DataSourceTestStatus {
  SUCCESS = 'success',
  ERROR = 'error',
}

/**
 * Datasource test result
 */
export interface DataSourceTestResult {
  status: DataSourceTestStatus;
  message: string;
}

/**
 * Datasource frame field
 */
export interface DataSourceFrameField {
  name: string;
  type: FieldType;
  converter?: ValueConverter;
}

/**
 * Datasource frame
 */
export interface DataSourceFrame {
  [type: string]: DataSourceFrameField[];
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
  ],
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
    description: 'Nodes information',
    value: QueryTypeValue.NODES,
  },
  {
    label: 'Databases',
    description: 'Database information',
    value: QueryTypeValue.BDBS,
  },
  {
    label: 'Database Alerts',
    description: 'Database alerts',
    value: QueryTypeValue.BDB_ALERTS,
  },
];

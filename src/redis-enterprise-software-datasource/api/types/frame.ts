import { dateMath, FieldType } from '@grafana/data';
import { DataSourceFrame, DataSourceFrameType } from '../../types';
import { QueryTypeValue } from './query';

/**
 * Convert Time
 * Have to be one function for good tests coverage
 * @param value
 */
const convertTime = (value: string) => dateMath.parse(value);

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
      {
        name: 'created_time',
        type: FieldType.time,
        converter: convertTime,
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
        converter: convertTime,
      },
      {
        name: 'expiration_date',
        type: FieldType.time,
        converter: convertTime,
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
  [QueryTypeValue.USERS]: {
    frame: DataSourceFrameType.ARRAY,
    fields: [
      {
        name: 'uid',
        type: FieldType.number,
      },
      {
        name: 'email',
        type: FieldType.string,
      },
      {
        name: 'name',
        type: FieldType.string,
      },
      {
        name: 'password_issue_date',
        type: FieldType.time,
        converter: convertTime,
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
    omit: ['authentication_admin_pass', 'authentication_sasl_pass', 'authentication_redis_pass'],
  },
  [QueryTypeValue.ALERTS]: {
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
    ],
  },
  [QueryTypeValue.STATS]: {
    frame: DataSourceFrameType.ARRAY,
    fields: [
      {
        name: 'stime',
        type: FieldType.time,
        converter: convertTime,
      },
      {
        name: 'etime',
        type: FieldType.time,
        converter: convertTime,
      },
      {
        name: 'conns',
        type: FieldType.number,
      },
    ],
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

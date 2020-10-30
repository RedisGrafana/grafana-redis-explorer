import { SelectableValue } from '@grafana/data';
import { QueryTypeValue } from './query';

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

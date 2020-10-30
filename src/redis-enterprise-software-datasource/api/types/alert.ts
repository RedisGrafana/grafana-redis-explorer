import { SelectableValue } from '@grafana/data';
import { QueryTypeValue } from './query';

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

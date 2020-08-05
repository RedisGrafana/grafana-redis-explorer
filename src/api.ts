/**
 * Query Type Values
 */
export enum QueryTypeValue {
  CLUSTER = 'cluster',
  LICENSE = 'license',
  NODES = 'nodes',
  BDBS = 'bdbs',
}

/**
 * Query Type
 */
export const QueryType = [
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
];

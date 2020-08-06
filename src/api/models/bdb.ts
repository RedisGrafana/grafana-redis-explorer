/**
 * Bdb (Database)
 */
export interface Bdb {
  /**
   * Database name
   *
   * @type {string}
   */
  name: string;

  /**
   * Cluster unique ID of database.
   *
   * @type {number}
   */
  uid: number;
}

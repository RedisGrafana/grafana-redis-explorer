/**
 * Node
 */
export interface Node {
  /**
   * Cluster unique ID of node
   *
   * @type {number}
   */
  uid: number;

  /**
   * Internal IP address of node
   *
   * @type {string}
   */
  addr: string;
}

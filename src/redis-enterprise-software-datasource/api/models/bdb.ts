type State = 'disabled' | 'enabled';

type AddressType = 'external' | 'internal';

type Proxy = 'single';

type Eviction = 'volatile-lru';

enum Status {
  Active = 'active',
}

type ModuleName = 'timeseries' | 'rg' | 'search' | 'json' | 'graph' | 'bloom' | 'ai';

interface Module {
  module_args: string;
  module_id: string;
  module_name: ModuleName;
  semantic_version: string;
}

export interface BdbEndpoint {
  addr: string[];
  addr_type: AddressType;
  dns_name: string;
  oss_cluster_api_preferred_ip_type: AddressType;
  port: number;
  proxy_policy: Proxy;
  uid: string;
}

/**
 * Bdb (Database)
 */
export interface Bdb {
  acl: [];
  aof_policy: string;
  authentication_admin_pass: string;
  authentication_redis_pass: string;
  authentication_sasl_pass: string;
  authentication_sasl_uname: string;
  authentication_ssl_client_certs: string[];
  authentication_ssl_crdt_certs: string[];
  auto_upgrade: boolean;
  background_op: [{ status: 'idle' }];
  backup: boolean;
  backup_failure_reason: string;
  backup_history: number;
  backup_interval: number;
  backup_interval_offset: number;
  backup_progress: number;
  backup_status: string;
  bigstore: boolean;
  bigstore_ram_size: number;
  crdt: boolean;
  crdt_causal_consistency: boolean;
  crdt_config_version: number;
  crdt_ghost_replica_ids: string;
  crdt_guid: string;
  crdt_replica_id: number;
  crdt_replicas: string;
  crdt_sources: [];
  crdt_sync: State;
  crdt_sync_dist: false;
  created_time: string;
  data_persistence: string;
  dataset_import_sources: [];
  default_user: boolean;
  dns_address_master: string;
  email_alerts: boolean;
  endpoints: BdbEndpoint[];
  eviction_policy: Eviction;
  generate_text_monitor: boolean;
  gradual_src_max_sources: number;
  gradual_src_mode: 'disabled';
  gradual_sync_max_shards_per_source: number;
  gradual_sync_mode: 'auto';
  group_uid: number;
  hash_slots_policy: string;
  implicit_shard_key: boolean;
  import_failure_reason: string;
  import_progress: number;
  import_status: string;
  internal: boolean;
  last_changed_time: string;
  max_aof_file_size: number;
  max_aof_load_time: number;
  max_connections: number;
  memory_size: number;
  metrics_export_all: boolean;
  mkms: boolean;
  module_list: Module[];
  name: string;
  oss_cluster: boolean;
  oss_cluster_api_preferred_ip_type: AddressType;
  oss_sharding: boolean;
  port: number;
  proxy_policy: Proxy;
  rack_aware: boolean;
  redis_version: string;
  replica_sources: [];
  replica_sync: 'disabled';
  replica_sync_dist: boolean;
  replication: boolean;
  roles_permissions: [];
  shard_block_crossslot_keys: boolean;
  shard_block_foreign_keys: boolean;
  shard_key_regex: [];
  shard_list: number[];
  sharding: boolean;
  shards_count: number;
  shards_placement: 'dense';
  skip_import_analyze: 'disabled';
  slave_ha: boolean;
  slave_ha_priority: number;
  snapshot_policy: [];
  ssl: boolean;
  status: Status;
  sync: 'disabled';
  sync_sources: [];
  syncer_mode: 'centralized';
  tls_mode: 'disabled';
  type: 'redis';
  uid: number;
  version: string;
  wait_command: boolean;
}

// /**
//  * Bdb (Database)
//  */
// export interface Bdb {
//   /**
//    * Database name
//    *
//    * @type {string}
//    */
//   name: string;
//
//   /**
//    * Cluster unique ID of database.
//    *
//    * @type {number}
//    */
//   uid: number;
// }

# Redis Explorer plug-in for Grafana

[![Grafana 7](https://img.shields.io/badge/Grafana-7-orange)](https://www.grafana.com)
[![Redis Data Source](https://img.shields.io/badge/dynamic/json?color=blue&label=Redis%20Data%20Source&query=%24.version&url=https%3A%2F%2Fgrafana.com%2Fapi%2Fplugins%2Fredis-datasource)](https://grafana.com/grafana/plugins/redis-datasource)
[![Redis Application plug-in](https://img.shields.io/badge/dynamic/json?color=blue&label=Redis%20Application%20plug-in&query=%24.version&url=https%3A%2F%2Fgrafana.com%2Fapi%2Fplugins%2Fredis-app)](https://grafana.com/grafana/plugins/redis-app)
![CI](https://github.com/RedisGrafana/grafana-redis-explorer/workflows/CI/badge.svg)
![Docker](https://github.com/RedisGrafana/grafana-redis-explorer/workflows/Docker/badge.svg)
[![codecov](https://codecov.io/gh/RedisGrafana/grafana-redis-explorer/branch/master/graph/badge.svg?token=15SIRGU8SX)](https://codecov.io/gh/RedisGrafana/grafana-redis-explorer)

## Summary

- [**Introduction**](#introduction)
- [**Getting Started**](#getting-started)
- [**License**](#license)

## Introduction

### What is the Redis Explorer for Grafana?

The Redis Explorer, is a plug-in for Grafana that allows users to connect to Redis Enterprise software REST API and build dashboards to easily monitor Redis Enterprise software clusters. It provides data source and predefined dashboards.

### What Grafana version is supported?

Only Grafana 7.0 and later with a new plug-in platform supported.

### Does this application require anything special configured on the Redis Enterprise?

Application can connect to any Redis Enterprise software cluster version 5.4 and later. No special configuration is required.

### How to build Explorer

To learn how to build Redis Explorer plug-in and register in the new or existing Grafana please take a look at [BUILD](https://github.com/RedisGrafana/grafana-redis-explorer/blob/master/BUILD.md) instructions.

## Getting Started

### Run using `docker` the nightly build (UNSTABLE)

Supported platforms are:

- linux/amd64
- linux/arm64
- linux/arm

```bash
docker run -d -p 3000:3000 --name=explorer ghcr.io/redisgrafana/redis-explorer:latest
```

### Run using `docker-compose` for development

Explorer plug-in have to be built following [BUILD](https://github.com/RedisGrafana/grafana-redis-explorer/blob/master/BUILD.md) instructions before starting using `docker-compose/dev.yml` file.

```bash
docker-compose -f docker-compose/dev.yml up
```

### Open Grafana

Open Grafana in your browser, enable Redis Explorer plug-in and configure Data Sources.

## Feedback

We love to hear from users, developers and the whole community interested by this plug-in. These are various ways to get in touch with us:

- Ask a question, request a new feature and file a bug with [GitHub issues](https://github.com/RedisGrafana/grafana-redis-explorer/issues/new/choose).
- Star the repository to show your support.

## Contributing

- Fork the repository.
- Find an issue to work on and submit a pull request.
- Could not find an issue? Look for documentation, bugs, typos, and missing features.

## License

- Apache License Version 2.0, see [LICENSE](https://github.com/RedisGrafana/grafana-redis-explorer/blob/master/LICENSE).

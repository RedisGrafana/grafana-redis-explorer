# Redis Explorer plug-in for Grafana

![Dashboard](https://raw.githubusercontent.com/RedisGrafana/grafana-redis-explorer/master/src/img/overview.png)

[![Grafana 7](https://img.shields.io/badge/Grafana-7-orange)](https://www.grafana.com)
[![Redis Explorer plug-in](https://img.shields.io/badge/dynamic/json?color=blue&label=Redis%20Explorer%20plug-in&query=%24.version&url=https%3A%2F%2Fgrafana.com%2Fapi%2Fplugins%2Fredis-explorer-app)](https://grafana.com/grafana/plugins/redis-explorer-app)
![CI](https://github.com/RedisGrafana/grafana-redis-explorer/workflows/CI/badge.svg)
![Docker](https://github.com/RedisGrafana/grafana-redis-explorer/workflows/Docker/badge.svg)
[![codecov](https://codecov.io/gh/RedisGrafana/grafana-redis-explorer/branch/master/graph/badge.svg?token=15SIRGU8SX)](https://codecov.io/gh/RedisGrafana/grafana-redis-explorer)
[![Language grade: JavaScript](https://img.shields.io/lgtm/grade/javascript/g/RedisGrafana/grafana-redis-explorer.svg?logo=lgtm&logoWidth=18)](https://lgtm.com/projects/g/RedisGrafana/grafana-redis-explorer/context:javascript)

## Summary

- [**Introduction**](#introduction)
- [**Getting Started**](#getting-started)
- [**Documentation**](#documentation)
- [**Development**](#development)
- [**Feedback**](#feedback)
- [**Contributing**](#contributing)
- [**License**](#license)

## Introduction

The Redis Explorer is a plug-in for Grafana that connects to Redis Enterprise software clusters using REST API. It provides application pages to add [Redis Data Sources](https://grafana.com/grafana/plugins/redis-datasource/) for managed databases and dashboards to see cluster configuration.

### Requirements

- **Grafana 8.0** is required for version 1.2.0+.
- **Grafana 7.1+** is required for version 1.1.0.

### Does this Application require anything special configured on the Redis Enterprise?

The Application can connect to any Redis Enterprise software cluster version 5.4 and later. No unique configuration is required.

## Getting Started

Use the `grafana-cli` tool to install from the command line:

```bash
grafana-cli plugins install redis-explorer-app
```

For Docker instructions and installation without Internet access, follow the [Quickstart](https://redisgrafana.github.io/quickstart/) page.

### Open Grafana and enable Redis Explorer plug-in

Open Grafana in your browser, enable Redis Explorer plug-in, and configure Redis Enterprise Software Data Sources.

![Enable](https://raw.githubusercontent.com/RedisGrafana/grafana-redis-explorer/master/src/img/enable.png)

### Redis Enterprise Software Data Source

Redis Enterprise Software Data Source is included in the Redis Explorer plug-in and connects to Redis Enterprise software clusters using REST API. For detailed information, look at the [Configuration](https://redisgrafana.github.io/redis-explorer/re-software/configuration/) page.

![Datasource](https://raw.githubusercontent.com/RedisGrafana/grafana-redis-explorer/master/src/img/datasource.png)

## Documentation

Please look at the [Documentation](https://redisgrafana.github.io/redis-explorer/overview/) to learn more about the Redis Explorer plug-in, Redis Enterprise Software data source, and provided dashboards.

## Development

[Developing Redis Explorer plug-in](https://redisgrafana.github.io/development/redis-explorer/) page provides instructions on building the application and data source plug-ins.

Are you interested in the latest features and updates? Start nightly built [Docker image for Redis Explorer plug-in](https://redisgrafana.github.io/development/images/).

## Feedback

We love to hear from users, developers, and the whole community interested in this plug-in. These are various ways to get in touch with us:

- Ask a question, request a new feature, and file a bug with [GitHub issues](https://github.com/RedisGrafana/grafana-redis-explorer/issues/new/choose).
- Star the repository to show your support.

## Contributing

- Fork the repository.
- Find an issue to work on and submit a pull request.
- Could not find an issue? Look for documentation, bugs, typos, and missing features.

## License

- Apache License Version 2.0, see [LICENSE](https://github.com/RedisGrafana/grafana-redis-explorer/blob/master/LICENSE).

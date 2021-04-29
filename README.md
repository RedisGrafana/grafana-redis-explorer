# Redis Explorer plug-in for Grafana

![Dashboard](https://raw.githubusercontent.com/RedisGrafana/grafana-redis-explorer/master/src/img/overview.png)

[![Grafana 7](https://img.shields.io/badge/Grafana-7-orange)](https://www.grafana.com)
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

Only **Grafana 7.1+** with a new Backend plug-in platform supports Redis plug-ins.

### Does this Application require anything special configured on the Redis Enterprise?

The Application can connect to any Redis Enterprise software cluster version 5.4 and later. No unique configuration is required.

## Getting Started

Use the `grafana-cli` tool to install from the command-line (when added to the official repository):

```bash
grafana-cli plugins install redis-explorer-app
```

For Docker instructions and installation without Internet access, follow [Quickstart](https://redisgrafana.github.io/quickstart/) page.

### Open Grafana and enable Redis Explorer plug-in

Open Grafana in your browser, enable Redis Explorer plug-in, and configure Redis Enterprise Software Data Sources.

![Enable](https://raw.githubusercontent.com/RedisGrafana/grafana-redis-explorer/master/src/img/enable.png)

### Redis Enterprise Software Data Source

Redis Enterprise Software Data Source is included in the Redis Explorer plug-in and connects to Redis Enterprise software clusters using REST API. For detailed information, look at [Configuration](https://redisgrafana.github.io/redis-explorer/re-software/configuration/) page.

![Datasource](https://raw.githubusercontent.com/RedisGrafana/grafana-redis-explorer/master/src/img/datasource.png)

## Documentation

Take a look at [Documentation](https://redisgrafana.github.io/redis-explorer/overview/) to learn more about Redis Explorer plug-in, Redis Enterprise Software data source, and provided dashboards.

## Development

[Developing Redis Explorer plug-in](https://redisgrafana.github.io/development/redis-datasource/) page provides instructions on building the application and data source plug-ins.

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

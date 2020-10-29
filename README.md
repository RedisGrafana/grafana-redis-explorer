# Redis Enterprise Application plug-in for Grafana

## Summary

- [**Introduction**](#introduction)
- [**Getting Started**](#getting-started)
- [**License**](#license)

## Introduction

### What is the Redis Enterprie Application for Grafana?

The Redis Enterprise Application, is a plug-in for Grafana that allows users to connect to Redis Enterprise software REST API and build dashboards to easily monitor Redis Enterprise software clusters. It provides out-of-the box panels and predefined dashboards - but the plug-in allows to build entirely customized dashboards, tuned to your needs.

### What is Grafana?

If you are not familiar with Grafana yet, it is a very popular tool used to build dashboards allowing to monitor applications, infrastructures and any kind of software components.

### What Grafana version is supported?

Only Grafana 7.0 and later with a new plug-in platform supported.

### Does this application require anything special configured on the Redis Enterprise?

Application can connect to any Redis Enterprise software cluster version 5.4 and later. No special configuration is required.

### How to build Application

To learn how to build Redis Enterprise Application plug-in and register in the new or existing Grafana please take a look at [BUILD](https://github.com/RedisGrafana/grafana-redis-enterprise-app/blob/master/BUILD.md) instructions.

## Getting Started

### Run using `docker-compose` for development

Enterprise Application plug-in have to be built following [BUILD](https://github.com/RedisGrafana/grafana-redis-enteprise-app/blob/master/BUILD.md) instructions before starting using `docker-compose.yml` file.

Project provides `docker-compose.yml` to start Redis Enterprise and Grafana 7.0.

```bash
docker-compose up
```

### Configure Redis Enterprise

Open Redis Enterprise UI in your browser and create new cluster.

### Open Grafana

Open Grafana in your browser and enable Redis Enterprise Application plug-in.

## Feedback

We love to hear from users, developers and the whole community interested by this plug-in. These are various ways to get in touch with us:

- Ask a question, request a new feature and file a bug with [GitHub issues](https://github.com/RedisGrafana/grafana-redis-enterprise-app/issues/new/choose).
- Star the repository to show your support.

## Contributing

- Fork the repository.
- Find an issue to work on and submit a pull request.
- Could not find an issue? Look for documentation, bugs, typos, and missing features.

## License

- Apache License Version 2.0, see [LICENSE](https://github.com/RedisGrafana/grafana-redis-enterprise-app/blob/master/LICENSE).

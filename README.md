# Grafana Redis Enterprise Datasource

## Summary

- [**Introduction**](#introduction)
- [**Getting Started**](#getting-started)
- [**License**](#license)

## Introduction

### What is the Grafana Redis Enterprise Datasource?

The Grafana Redis Enterprise Datasource, is a plugin that allows users to connect to Redis Enterprise REST API and build dashboards in Grafana to easily monitor Redis Enterprise cluster. It provides out-of-the box predefined dashboards - but the plugin allows to build entirely customized dashboards, tuned to your needs.

### What is Grafana?

If you are not familiar with Grafana yet, it is a very popular tool used to build dashboards allowing to monitor applications, infrastructures and any kind of software components.

### What Grafana version is supported?

Only Grafana 7.0 and later with a new plugin platform supported.

### Does this datasource require anything special configured on the Redis Enterprise?

Datasource can connect to any Redis Enterprise cluster version 5.4 and later. No special configuration is required.

## Getting Started

### Run using `docker-compose`

Project provides `docker-compose.yml` to start Redis Enterprise and Grafana 7.0.

**Start Redis Enterprise and Grafana**

```bash
docker-compose up
```

### Configure Redis Enterprise

Open Redis Enterprise UI in your browser [https://localhost:8443](https://localhost:8443) and create new cluster.

### Open Grafana

Open Grafana in your browser [http://localhost:3000](http://localhost:3000) and configure datasource. You can add as many datasources as you want to support multiple Redis clusters.

## License

- Apache License Version 2.0, see [LICENSE](LICENSE)

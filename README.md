# Redis Enterprise Application for Grafana

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

Open Grafana in your browser [http://localhost:3000](http://localhost:3000) and configure datasource. You can add as many datasources as you want to support multiple Redis Enterprise software clusters.

## License

- Apache License Version 2.0, see [LICENSE](LICENSE)

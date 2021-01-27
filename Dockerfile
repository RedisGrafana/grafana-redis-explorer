ARG GRAFANA_VERSION="latest"

FROM grafana/grafana:${GRAFANA_VERSION}-ubuntu

# Set DEBIAN_FRONTEND=noninteractive in environment at build-time
ARG DEBIAN_FRONTEND=noninteractive

# Set Grafana options
ENV GF_ENABLE_GZIP="true"
ENV GF_USERS_DEFAULT_THEME="light"

# Paths
ENV GF_PATHS_PROVISIONING="/etc/grafana/provisioning"
ENV GF_PATHS_PLUGINS="/var/lib/grafana-plugins"

# Copy artifacts
COPY dist $GF_PATHS_PLUGINS
COPY redis-datasource $GF_PATHS_PLUGINS
COPY redis-app $GF_PATHS_PLUGINS

# Provisioning
COPY provisioning/plugins $GF_PATHS_PROVISIONING/plugins
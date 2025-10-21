# K8S Infrastructure

This directory contains Kubernetes configuration files and scripts to set up and manage the Kubernetes cluster for the Dream All-in-One project.

## Prerequisites

- [Kind](https://kind.sigs.k8s.io/) - A tool for running local Kubernetes clusters using Docker container "nodes".
- [kubectl](https://kubernetes.io/docs/tasks/tools/) - Command-line tool for
  
To installing and setting up the Kubernetes cluster, run the following commands:
```bash
chmod + x ./infra/install.sh
./infra/install.sh
```
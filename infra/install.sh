#!/bin/bash

echo "Starting installation process..."

# install kind
if ! command -v kind &> /dev/null; then
    echo "[1] Installing kind..."

    [ $(uname -m) = arm64 ] && curl -Lo ./kind https://kind.sigs.k8s.io/dl/v0.30.0/kind-darwin-arm64
    chmod +x ./kind
    sudo mv ./kind /usr/local/bin/kind
else
    echo "kind is already installed."
fi

# install kubectl
if ! command -v kubectl &> /dev/null; then
    echo "[2] Installing kubectl..."
    curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/darwin/arm64/kubectl"
    chmod +x ./kubectl
    sudo mv ./kubectl /usr/local/bin/kubectl
else
    echo "kubectl is already installed."
fi

# install k8s cluster with kind
read -p "Do you want to create Kubernetes cluster? (y/n): " create_cluster
if [[ $create_cluster == "y" || $create_cluster == "Y" ]]; then
    echo "[3] Creating Kubernetes cluster with kind..."
    kind create cluster --name dream-k8s
else
    echo "Skipping cluster creation."
fi

# install completed
echo "[OK] Install completed."
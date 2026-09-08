# Platform GitOps Engine

Core GitOps repository for the Internal Developer Platform (IDP), responsible for orchestrating platform capabilities, foundational shared services, and application workloads across multiple environments.

## Overview

This repository acts as the single source of truth for cluster state and platform governance. It utilizes a declarative GitOps model powered by ArgoCD to reconcile cluster configurations, manage multi-tenant application deployments, and maintain foundational infrastructure services.

## Architecture & Design Decisions

* **Repository Segregation**: Infrastructure manifests, deployment configurations, and platform charts are isolated from application source code. This eliminates circular CI triggers, restricts blast radius, and enforces strict access boundaries between platform governance and application engineering.
* **Environment-Driven Overlays**: Deployments are organized by target environments (`local`, `prod`), allowing workload tiering, configuration overrides, and progressive delivery without modifying base templates.
* **Declarative Observability**: Telemetry collection, metric routing (tier-based targeting to local LGTM or New Relic), and agent daemonsets are treated as platform-level dependencies managed directly through GitOps.

## Repository Structure

```text
.
├── bootstrap/               # Root ArgoCD applications and initial cluster bootstrap
├── charts/                  # Reusable platform Helm charts (Golden Path templates)
├── docs/                    # Architectural Decision Records (ADRs) and runbooks
├── environments/            # GitOps declarations and overlays per target
│   ├── local/               # Local development environment (k3s)
│   │   ├── apps/            # Application workload values
│   │   └── platform/        # Shared platform services (OTel, LGTM, Ingress)
│   └── prod/                # Production environment targets
└── terraform/               # Cloud infrastructure automation and modules

## Getting Started
**Prerequisites
* Kubernetes Cluster (Local k3s or remote engine)
* kubectl and helm installed
* argocd CLI installed

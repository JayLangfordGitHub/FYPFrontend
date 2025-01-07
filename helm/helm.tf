resource "helm_release" "prometheus_operator" {
  name       = "prometheus-operator"
  chart      = "kube-prometheus-stack"
  namespace  = "monitoring"
  repository = "https://prometheus-community.github.io/helm-charts"

  values = [file("${path.module}/prometheus.yaml")]
}

resource "helm_release" "grafana" {
  name       = "grafana"
  chart      = "grafana"
  namespace  = "monitoring"
  repository = "https://grafana.github.io/helm-charts"

  values = [file("${path.module}/grafana.yaml")]
}
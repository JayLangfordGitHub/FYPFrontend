output "load_balancer_dns" {
  value = module.alb.dns_name
}

output "grafana_url" {
  value = helm_release.grafana.name
}

output "prometheus_url" {
  value = helm_release.prometheus_operator.name
}
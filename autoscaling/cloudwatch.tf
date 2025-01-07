resource "aws_cloudwatch_metric_alarm" "scale_out" {
  count = var.enable_autoscaling ? 1 : 0

  alarm_name          = "scale-out"
  metric_name         = "CPUUtilization"
  namespace           = "AWS/EC2"
  statistic           = "Average"
  comparison_operator = "GreaterThanOrEqualToThreshold"
  threshold           = var.scaling_config.scale_out_cpu
  period              = 300
  evaluation_periods  = 2
  alarm_actions       = [aws_autoscaling_policy.scale_out_policy[count.index].arn]
}

resource "aws_cloudwatch_metric_alarm" "scale_in" {
  count = var.enable_autoscaling ? 1 : 0

  alarm_name          = "scale-in"
  metric_name         = "CPUUtilization"
  namespace           = "AWS/EC2"
  statistic           = "Average"
  comparison_operator = "LessThanOrEqualToThreshold"
  threshold           = var.scaling_config.scale_in_cpu
  period              = 300
  evaluation_periods  = 2
  alarm_actions       = [aws_autoscaling_policy.scale_in_policy[count.index].arn]
}
output "autoscaling_group_name" {
  value = aws_autoscaling_group.asg[0].name
}
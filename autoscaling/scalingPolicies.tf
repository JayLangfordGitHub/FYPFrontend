resource "aws_autoscaling_policy" "scale_out_policy" {
  count = var.enable_autoscaling ? 1 : 0

  name                   = "scale-out"
  scaling_adjustment     = 1
  adjustment_type        = "ChangeInCapacity"
  cooldown               = 300
  autoscaling_group_name = aws_autoscaling_group.asg[count.index].name
}

resource "aws_autoscaling_policy" "scale_in_policy" {
  count = var.enable_autoscaling ? 1 : 0

  name                   = "scale-in"
  scaling_adjustment     = -1
  adjustment_type        = "ChangeInCapacity"
  cooldown               = 300
  autoscaling_group_name = aws_autoscaling_group.asg[count.index].name
}
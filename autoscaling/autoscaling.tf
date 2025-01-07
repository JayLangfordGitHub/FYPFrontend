data "aws_ami" "latest_amazon_linux" {
  most_recent = true
  owners      = ["amazon"]

  filter {
    name   = "name"
    values = ["amzn2-ami-hvm-*"]
  }

  filter {
    name   = "state"
    values = ["available"]
  }
}

resource "aws_autoscaling_group" "asg" {
  count               = var.enable_autoscaling ? 1 : 0
  vpc_zone_identifier = var.private_subnets

  min_size         = var.scaling_config.min_size
  max_size         = var.scaling_config.max_size
  desired_capacity = var.scaling_config.desired_capacity

  launch_template {
    id      = aws_launch_template.asg_lt[count.index].id
    version = "$Latest"
  }

  tag {
    key                 = "Name"
    value               = "dynamic-asg"
    propagate_at_launch = true
  }
}

resource "aws_launch_template" "asg_lt" {
  count        = var.enable_autoscaling ? 1 : 0
  name         = "asg-launch-template"
  image_id     = data.aws_ami.latest_amazon_linux.id
  instance_type = "t3.micro"
}
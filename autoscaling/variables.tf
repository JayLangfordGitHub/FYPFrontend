variable "vpc_id" {
  description = "The ID of the VPC"
  type        = string
}

variable "private_subnets" {
  description = "A list of private subnet IDs"
  type        = list(string)
}

variable "public_subnets" {
  description = "A list of public subnet IDs"
  type        = list(string)
}

variable "enable_autoscaling" {
  description = "Whether to enable autoscaling"
  type        = bool
  default     = true
}

variable "scaling_config" {
  description = "Configuration for scaling policies"
  type = object({
    min_size         = number
    max_size         = number
    desired_capacity = number
    scale_out_cpu    = number
    scale_in_cpu     = number
  })
  default = {
    min_size         = 1
    max_size         = 3
    desired_capacity = 1
    scale_out_cpu    = 70
    scale_in_cpu     = 30
  }
}
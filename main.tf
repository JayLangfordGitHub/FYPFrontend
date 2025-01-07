# Provider config
provider "aws" {
  region = "us-east-1"
}

# Fetch Kubernetes config from the EKS cluster
data "aws_eks_cluster" "eks" {
  depends_on = [module.eks] # Ensure the EKS cluster is created first
  name       = module.eks.cluster_name
}

data "aws_eks_cluster_auth" "eks" {
  depends_on = [module.eks] # Ensure the EKS cluster is created first
  name       = module.eks.cluster_name
}

provider "kubernetes" {
  host                   = data.aws_eks_cluster.eks.endpoint
  cluster_ca_certificate = base64decode(data.aws_eks_cluster.eks.certificate_authority[0].data)
  token                  = data.aws_eks_cluster_auth.eks.token
}

provider "helm" {
  kubernetes {
    host                   = data.aws_eks_cluster.eks.endpoint
    cluster_ca_certificate = base64decode(data.aws_eks_cluster.eks.certificate_authority[0].data)
    token                  = data.aws_eks_cluster_auth.eks.token
  }
}

# VPC
module "vpc" {
  source               = "terraform-aws-modules/vpc/aws"
  version              = "5.17.0"
  name                 = "high-availability-vpc"
  cidr                 = "10.0.0.0/16"
  azs                  = ["us-east-1a", "us-east-1b", "us-east-1c"]
  private_subnets      = ["10.0.1.0/24", "10.0.2.0/24", "10.0.3.0/24"]
  public_subnets       = ["10.0.101.0/24", "10.0.102.0/24", "10.0.103.0/24"]
  enable_nat_gateway   = true
  single_nat_gateway   = true
}

# Application Load Balancer
module "alb" {
  source  = "terraform-aws-modules/alb/aws"
  version = "9.0.0"

  name               = "monitoring-alb"
  load_balancer_type = "application"
  vpc_id             = module.vpc.vpc_id
  subnets            = module.vpc.public_subnets
  security_groups    = [aws_security_group.alb_sg.id]
  enable_deletion_protection = false
  tags = {
    Environment = "dev"
  }
}

# EKS cluster module
module "eks" {
  source          = "terraform-aws-modules/eks/aws"
  version         = "20.31.6"
  cluster_name    = "monitoring-cluster"
  cluster_version = "1.26"
  vpc_id          = module.vpc.vpc_id
  subnet_ids      = module.vpc.private_subnets
}

# Autoscaling module
module "autoscaling" {
  source = "./autoscaling"

  vpc_id          = module.vpc.vpc_id
  private_subnets = module.vpc.private_subnets
  public_subnets  = module.vpc.public_subnets
  enable_autoscaling = true

  scaling_config = {
    min_size         = 1
    max_size         = 5
    desired_capacity = 2
    scale_out_cpu    = 75
    scale_in_cpu     = 25
  }
}

resource "helm_release" "grafana" {
  depends_on       = [module.eks] # Ensure the EKS cluster exists before deploying Helm resources
  name             = "grafana"
  chart            = "grafana"
  repository       = "https://grafana.github.io/helm-charts"
  namespace        = "monitoring"
  create_namespace = true
}

resource "helm_release" "prometheus_operator" {
  depends_on       = [module.eks] # Ensure the EKS cluster exists before deploying Helm resources
  name             = "prometheus-operator"
  chart            = "kube-prometheus-stack"
  repository       = "https://prometheus-community.github.io/helm-charts"
  namespace        = "monitoring"
  create_namespace = true
}

resource "aws_security_group" "alb_sg" {
  name        = "alb-security-group"
  description = "Security group for the Application Load Balancer"
  vpc_id      = module.vpc.vpc_id

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name        = "alb-security-group"
    Environment = "dev"
  }
}
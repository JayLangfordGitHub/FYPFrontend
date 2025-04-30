provider "aws" {
  region = "us-east-1"
}

# Fetch the default VPC
data "aws_vpc" "default" {
  default = true
}

# Fetch one public subnet in that default VPC
data "aws_subnet" "default" {
  filter {
    name   = "vpc-id"
    values = [data.aws_vpc.default.id]
  }
  availability_zone = "us-east-1a"
}

# Security Group allowing SSH and HTTP
resource "aws_security_group" "dealhub_sg" {
  name        = "dealhub-sg"
  description = "Allow HTTP and SSH"
  vpc_id      = data.aws_vpc.default.id

  ingress {
    description = "SSH access"
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description = "HTTP access"
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    description = "Allow all outbound"
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

# Fetch the latest Amazon Linux 2 AMI
data "aws_ami" "amazon_linux" {
  most_recent = true

  filter {
    name   = "name"
    values = ["amzn2-ami-hvm-*-x86_64-gp2"]
  }

  filter {
    name   = "virtualization-type"
    values = ["hvm"]
  }

  owners = ["137112412989"] # Amazon
}

# EC2 instance running Node.js app
resource "aws_instance" "dealhub_instance" {
  ami                         = data.aws_ami.amazon_linux.id
  instance_type               = "t3.micro"
  vpc_security_group_ids      = [aws_security_group.dealhub_sg.id]
  associate_public_ip_address = true
  subnet_id                   = data.aws_subnet.default.id
  key_name                    = "dealhubkey"

  user_data = base64encode(<<-EOF
    #!/bin/bash
    curl -fsSL https://rpm.nodesource.com/setup_18.x | bash -
    yum install -y nodejs

    cat <<EOL > /home/ec2-user/app.js
    const http = require('http');
    const hostname = '0.0.0.0';
    const port = 80;
    const server = http.createServer((req, res) => {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'text/plain');
      res.end('Welcome to DealHub');
    });
    server.listen(port, hostname, () => {
      console.log('Server running at http://' + hostname + ':' + port + '/');
    });
    EOL

    cd /home/ec2-user
    nohup node app.js > output.log 2>&1 &
  EOF
  )

  tags = {
    Name = "dealhub-instance"
  }
}

# Output the instance public IP
output "instance_public_ip" {
  value = aws_instance.dealhub_instance.public_ip
}

# (Optional bonus) Output clickable URL
output "dealhub_url" {
  value = "http://${aws_instance.dealhub_instance.public_ip}"
}

resource "aws_sqs_queue" "tank-created-queue" {
  name = "TANK_CREATED"

  tags = {
    DEPARTMENT  = "MACHINERY"
    ENVIRONMENT = "DEV"
  }
}

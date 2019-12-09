resource "aws_dynamodb_table" "tank" {
  name           = "Tank"
  billing_mode   = "PROVISIONED"
  read_capacity  = 20
  write_capacity = 20
  hash_key       = "id"

  attribute {
    name = "id"
    type = "S"
  }

  tags = {
    DEPARTMENT  = "MACHINERY"
    ENVIRONMENT = "DEV"
  }
}

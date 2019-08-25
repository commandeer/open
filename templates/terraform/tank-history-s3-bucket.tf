resource "aws_s3_bucket" "b" {
  bucket = "commandeer-tanks-history"
  acl    = "private"

  tags = {
    DEPARTMENT  = "MACHINERY"
    ENVIRONMENT = "DEV"
  }
}

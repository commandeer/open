resource "aws_s3_bucket" "commandeer-tanks-history" {
  bucket = "commandeer-tanks-history"
  acl    = "private"

  tags = {
    DEPARTMENT  = "MACHINERY"
    ENVIRONMENT = "DEV"
  }
}

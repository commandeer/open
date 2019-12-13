resource "aws_s3_bucket" "b" {
  bucket = "commandeer-tanks"
  acl    = "private"

  tags = {
    DEPARTMENT  = "MACHINERY"
    ENVIRONMENT = "DEV"
  }
}

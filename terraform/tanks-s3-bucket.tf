resource "aws_s3_bucket" "commandeer-tanks" {
  bucket = "commandeer-tanks"
  acl    = "private"

  tags = {
    DEPARTMENT  = "MACHINERY"
    ENVIRONMENT = "DEV"
  }
}

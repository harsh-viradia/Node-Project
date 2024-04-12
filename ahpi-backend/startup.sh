#!/bin/bash
s3cmd --access_key=$AWS_S3_ACCESS_KEY_ID --secret_key=$AWS_S3_SECRET_ACCESS_KEY --region=$AWS_REGION --host=$AWS_HOST_NAME --host-bucket=$BKT_HOST_NAME -s --no-encrypt --dump-config 2>&1 | tee /root/.s3cfg
node ./src/bin/www

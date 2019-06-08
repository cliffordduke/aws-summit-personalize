#bin/bash

sam package --template-file template.yaml --s3-bucket aws-summit-2019-personalize-codebase --output-template-file packaged.yaml

sam deploy --template-file packaged.yaml --stack-name aws-summit-2019-personalize --capabilities CAPABILITY_IAM
FROM 367859350018.dkr.ecr.us-west-2.amazonaws.com/serverless-clothes-detection-inference-dev:inference-base-image

ARG WEIGHT_FILE_NAME
ARG DATA_BUCKET
ARG PREFIX=${PREFIX:-''}

ENV WEIGHT_FILE_NAME=${WEIGHT_FILE_NAME:-''}
ENV DATA_BUCKET=${DATA_BUCKET:-''}
ENV PREFIX=${PREFIX:-''}

COPY src/inference/utils utils
COPY src/utils/aws/credentials.env .
COPY src/inference/app.py .

CMD ["app.handler"]

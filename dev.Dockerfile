FROM 367859350018.dkr.ecr.us-west-2.amazonaws.com/serverless-clothes-detection-inference-dev:inference-base-image

ARG WEIGHT_FILE_NAME
ARG DATA_BUCKET

ENV WEIGHT_FILE_NAME=${WEIGHT_FILE_NAME:-''}
ENV DATA_BUCKET=${DATA_BUCKET:-''}

CMD ["app.handler"]

FROM public.ecr.aws/lambda/python:3.8

ARG WEIGHT_FILE_NAME
ARG DATA_BUCKET

ENV WEIGHT_FILE_NAME=${WEIGHT_FILE_NAME:-''}
ENV DATA_BUCKET=${DATA_BUCKET:-''}


COPY src/inference/requirements.txt .
RUN pip3 install -r requirements.txt

COPY src/inference/utils utils
COPY src/utils/aws/credentials.env .
COPY src/inference/app.py .

CMD ["app.handler"]

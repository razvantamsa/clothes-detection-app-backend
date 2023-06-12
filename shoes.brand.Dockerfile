FROM public.ecr.aws/lambda/python:3.8

COPY src/detection/shoe/brand/requirements.txt .
RUN pip3 install -r requirements.txt

COPY src/detection/utils utils
COPY src/utils/aws/credentials.env .
COPY src/detection/shoe/brand/app.py .

CMD ["app.handler"]

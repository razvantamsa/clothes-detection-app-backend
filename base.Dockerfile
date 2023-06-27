FROM public.ecr.aws/lambda/python:3.8


COPY src/inference/requirements.txt .
RUN pip3 install -r requirements.txt

COPY src/inference/utils utils
COPY src/inference/app.py .

CMD ["app.handler"]

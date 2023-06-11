FROM tensorflow/tensorflow:2.12.0

COPY src/detection/shoe/brand/inference.py /app/inference.py
COPY src/detection/shoe/brand/requirements.txt /app/requirements.txt
COPY src/detection/utils /app/utils
COPY src/utils/aws/credentials.env /app/.env

WORKDIR /app

RUN pip install -r requirements.txt

ENTRYPOINT ["python", "inference.py"]

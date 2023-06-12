create script to build, tag, push lambda container to ecr
create script to build and deploy lambda detection functions
fix bug not enough resources found scraping (<400)
integrate lambdas for detection in scan flow

################  docker build & run commands:

docker build --build-arg WEIGHT_FILE_NAME='shoe_brand_model_weights'
--build-arg DATA_BUCKET='clothes-detection-shoes-bucket' -t shoes-detection:brand .

docker run -p 9000:8080 shoes-detection:brand

################ docker test command:

curl -XPOST "http://localhost:9000/2015-03-31/functions/function/invocations" -d "{\"dataId\":\"2eb0fbad1234b08b9fd3ec344c1b1d14b559d8d36b088cec5392d5106d909270\"}"
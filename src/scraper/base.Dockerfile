FROM public.ecr.aws/lambda/nodejs:14


COPY package*.json ./
RUN npm install

COPY src/scraper/lambdas/scrapeProductDetail.js src/scraper/lambdas/scrapeProductDetail.js
COPY src/utils src/utils

CMD ["src/scraper/lambdas/scrapeProductDetail.handler"]

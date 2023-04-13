# List of commands for generating a Postman Collection
## For Healthcheck API
npx openapi-to-postmanv2 convert -s ./openapi/healthcheck.specs.yml -o ./openapi/postman/healthcheck.json

## For Sneakers API
npx openapi-to-postmanv2 convert -s ./openapi/sneakers.specs.yml -o ./openapi/postman/sneakers.json

<br>
<br>

# Guidelines:
### 1. When updating the specs.yml for an API, increase the version accordingly
### 2. When generating a new json for an API, upload it by importing it into Postman
### 3. When refactoring, upload the entire openapi/postman folder

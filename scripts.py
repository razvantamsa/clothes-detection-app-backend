import subprocess
import sys
import os
import webbrowser
import json
from dotenv import load_dotenv
import botocore.session

load_dotenv('./src/utils/aws/credentials.env')
access_key = os.environ.get('ACCESS_KEY_ID')
secret_key = os.environ.get('SECRET_ACCESS_KEY')
region = 'us-west-2'

if not access_key or not secret_key:
    print('Set AWS credentials in src/utils/`aws/credentials.env`')
    sys.exit()

# Create a new session and set credentials and region
session = botocore.session.get_session()
session.set_credentials(access_key, secret_key)
session.set_config_variable('region', region)

secrets_manager = session.create_client('secretsmanager')
ec2 = session.create_client('ec2')
elasticache = session.create_client('elasticache')

def check_for_environmental_variables():
    environment = os.getenv('ENVIRONMENT') # only one is enough to verify if they're set
    if not environment:
        print('Run "source .env" to export environmental variables for local development')
        sys.exit()

def run_continuous_process(command):
    try:
        process = subprocess.Popen(command, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        while True:
            output = process.stdout.readline().decode().strip()
            if output:
                print(output)
            else:
                break

        process.wait()

        if process.returncode == 0:
            print("Program completed successfully.")
        else:
            print("Program exited with an error.")
    except KeyboardInterrupt:
        print('\n\nStopping program execution...')
    sys.exit()

def run_command(command):
    try:
        output = subprocess.check_output(command, shell=True)
        print(output.decode())    
    except KeyboardInterrupt:
        print('\n\nStopping program execution...')
    sys.exit()


list_of_commands = '''
List of available commands:

    ### deployment
    deploy-status           - deploy status functions to aws
    deploy-rest             - deploy rest api functions to aws
    deploy-scraper          - deploy scraper functions to aws
    deploy-resources        - deploy resources to aws
    deploy-scan             - deploy scan functions to aws
    deploy-inference        - deploy inference functions to aws
    
    ### development
    dev-status              - run status functions locally
    dev-rest                - run rest api functions locally
    dev-scraper             - run scraper functions locally
    dev-scan                - run scan functions locally

    ### cache
    enable-cache            - create redis cluster in the cloud
    disable-cache           - delete redis cluster from the cloud

    ### docs
    html-docs               - bundle openapi.yml specs to get webpage of documentation
    postman-docs            - bundle openapi.yml specs to get postman collection

    ### google colab
    start-colab-brand       - start google colab brand detection notebook

    ### start local scrape
    catalog                 - start catalog scraping process
    detail                  - start detail scraping processes in a recursive manner

    ### authorization
    get-apikey              - get latest apiket stored in secretsmanager
    
    ### help
    help                    - list available commands
'''

if len(sys.argv) <= 1 or sys.argv[1] == 'help':
    print(list_of_commands)
    sys.exit()

command = sys.argv[1]
execution_command = ""

# deployment
if command == 'deploy-status':
    execution_command = 'sls deploy --config serverless.status.yml'
elif command == 'deploy-rest':
    execution_command = 'sls deploy --config serverless.rest.yml'
elif command == 'deploy-scraper':
    execution_command = 'sls deploy --config serverless.scraper.yml'
elif command == 'deploy-resources':
    execution_command = 'sls deploy --config serverless.resources.yml'
elif command == 'deploy-scan':
    execution_command = 'sls deploy --config serverless.scan.yml'
elif command == 'deploy-inference':
    execution_command = 'sls deploy --config serverless.inference.yml'

# development
elif command == 'dev-status':
    execution_command = ['nodemon', 'src/status']
    run_continuous_process(execution_command)
elif command == 'dev-rest':
    execution_command = ['nodemon', 'src/rest']
    run_continuous_process(execution_command)
elif command == 'dev-scraper':
    execution_command = ['nodemon', 'src/scraper']
    run_continuous_process(execution_command)
elif command == 'dev-scan':
    execution_command = ['nodemon', 'src/scan']
    run_continuous_process(execution_command)

# cache
elif command == 'enable-cache':
    response = ec2.describe_vpcs()
    vpc_id = response['Vpcs'][0]['VpcId']

    response = ec2.describe_security_groups(Filters=[
        {'Name': 'vpc-id', 'Values': [vpc_id]},
        {'Name': 'group-name', 'Values': ['default']}
    ])
    security_group_ids = [group['GroupId'] for group in response['SecurityGroups']]

    REDIS_CACHE_CLUSTER = os.environ.get('REDIS_CACHE_CLUSTER')
    elasticache.create_cache_cluster(
        CacheClusterId=REDIS_CACHE_CLUSTER,
        CacheNodeType='cache.t2.micro',
        NumCacheNodes=1,
        Engine='redis',
        EngineVersion='6.x',
        Port=6379,
        SecurityGroupIds=security_group_ids
    )
    print(f'Creating cluster {REDIS_CACHE_CLUSTER}')
    sys.exit()

elif command == 'disable-cache':
    REDIS_CACHE_CLUSTER = os.environ.get('REDIS_CACHE_CLUSTER')
    elasticache.delete_cache_cluster(CacheClusterId=REDIS_CACHE_CLUSTER)
    print(f'Deleting cluster {REDIS_CACHE_CLUSTER}')
    sys.exit()

# docs
elif command == 'html-docs':
    execution_command = 'redoc-cli bundle openapi.yml -o openapi.html'
elif command == 'postman-docs':
    execution_command = 'npx openapi-to-postmanv2 convert -s openapi.yml -o openapi.json'

# authorization
elif command == 'get-apikey':
    response = secrets_manager.get_secret_value(SecretId='authorization')
    secret_string = response['SecretString']
    secret_string = secret_string.replace("'", "")
    print(secret_string)
    sys.exit()

# machine learning
elif command == 'start-colab-brand':
    url = os.environ.get('GOOGLE_COLAB_BRAND_DETECTION')
    webbrowser.open(url)
    sys.exit()

# local scraping
elif command == 'catalog' or command == 'detail':
    json_file_path = "local-scrape/arguments.json"
    with open(json_file_path, "r") as file:
        data = json.load(file)

    if command == 'catalog':
        baseUrl = data["baseUrl"]
        execution_command = ['node', 'local-scrape/catalog.js', baseUrl]

    if command == 'detail':
        type = data["type"]
        brand = data["brand"]
        execution_command = ['node', 'local-scrape/detail.js', type, brand]
    
    run_continuous_process(execution_command)

else:
    print('Command does not exist - try checking out available commands using "help"')
    sys.exit()

run_command(execution_command)

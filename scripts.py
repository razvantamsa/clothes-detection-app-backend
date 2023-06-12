import subprocess
import sys
import os
import webbrowser


def check_for_aws_credentials():
    has_credentials = True
    env_file = './src/utils/aws/credentials.env'
    with open(env_file, 'r') as file:
        lines = file.readlines()
        aws_access_key_id = lines[0].strip()
        aws_secret_access_key = lines[1].strip()
    if not aws_access_key_id.startswith('ACCESS_KEY_ID=') or not aws_access_key_id.split('=')[1]:
        has_credentials = False
    if not aws_secret_access_key.startswith('SECRET_ACCESS_KEY=') or not aws_secret_access_key.split('=')[1]:
        has_credentials =  False
    
    if not has_credentials:
        print('Set AWS credentials in src/utils/aws/credentials.env')
        sys.exit()

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
    
    ### development
    dev-status              - run status functions locally
    dev-rest                - run rest api functions locally
    dev-scraper             - run scraper functions locally
    dev-scan                - run scan functions locally

    ### docs
    html-docs               - bundle openapi.yml specs to get webpage of documentation
    postman-docs            - bundle openapi.yml specs to get postman collection

    # google colab
    start-colab-brand       - start google colab brand detection notebook

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

if 'dev' in command:
    check_for_environmental_variables()
    check_for_aws_credentials()

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

# docs
elif command == 'html-docs':
    execution_command = 'redoc-cli bundle openapi.yml -o openapi.html'
elif command == 'postman-docs':
    execution_command = 'npx openapi-to-postmanv2 convert -s openapi.yml -o openapi.json'

# authorization
elif command == 'get-apikey':
    execution_command = 'aws secretsmanager get-secret-value --secret-id authorization --query SecretString --output text | tr -d \'"\''

# machine learning
elif command == 'start-colab-brand':
    url = os.environ.get('GOOGLE_COLAB_BRAND_DETECTION')
    webbrowser.open(url)
    sys.exit()

else:
    print('Command does not exist - try checking out available commands using "help"')
    sys.exit()

run_command(execution_command)

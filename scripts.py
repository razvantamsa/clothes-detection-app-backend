import subprocess
import sys

list_of_commands = '''
List of available commands:

    deploy          - deploy backend to aws
    dev             - run dev environment locally
    html-docs       - bundle openapi.yml specs to get webpage of documentation
    postman-docs    - bundle openapi.yml specs to get postman collection
    help            - list available commands
'''

if len(sys.argv) <= 1 or sys.argv[1] == 'help':
    print(list_of_commands)
    sys.exit()

command = sys.argv[1]
execution_command = ""
if command == 'deploy':
    execution_command = 'sls deploy'
elif command == 'dev':
    execution_command = 'serverless offline start'  
elif command == 'html-docs':
    execution_command = 'redoc-cli bundle openapi.yml -o openapi.html'
elif command == 'postman-docs':
    execution_command = 'npx openapi-to-postmanv2 convert -s openapi.yml -o openapi.json'
else:
    print('Command does not exist - try checking out available commands using "help"')
    sys.exit()

try:
    output = subprocess.check_output(execution_command, shell=True)
    print(output.decode())    
except KeyboardInterrupt:
    print('\n\nStopping program execution...')
import os
import boto3
import json
import time

cloudwatchLogs = boto3.client('logs')

def log_to_cloudwatch(log_group_name, log_stream_name, log_events):
    cloudwatchLogs.put_log_events(
        logGroupName=log_group_name,
        logStreamName=log_stream_name,
        logEvents=log_events
    )

def logging(log_group_name, log_stream_name, level, *args):
    if not args:
        return

    messages = [json.dumps(arg) if isinstance(arg, dict) else str(arg) for arg in args]
    message = ' '.join(messages)

    function_name = os.environ.get('AWS_LAMBDA_FUNCTION_NAME', 'unknown')
    log_event = [{
        'message': f'{level}: {function_name} - {message}',
        'timestamp': int(round(time.time() * 1000))
    }]

    log_to_cloudwatch(log_group_name, log_stream_name, log_event)

def handler(log_group_name=f'microservice/{os.environ.get("SERVICE")}', log_stream_name='index'):
    def info(*args):
        logging(log_group_name, log_stream_name, 'INFO', *args)

    def error(*args):
        logging(log_group_name, log_stream_name, 'ERROR', *args)

    return {
        'info': info,
        'error': error
    }

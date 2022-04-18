import json
import base64
from boto3 import Session
from botocore.exceptions import BotoCoreError, ClientError
from contextlib import closing

# Create a client using the credentials and region defined in the [adminuser]
# section of the AWS credentials file (~/.aws/credentials).
session = Session()
polly = session.client("polly")

def proxy_response(status_code: int, body: base64) -> dict:
    return {
        "headers": {
            'Access-Control-Allow-Headers': 'Content-Type,X-Api-Key',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'OPTIONS,POST,GET'
        },
        "statusCode": status_code,
        "body": body
    }
    

def lambda_handler(event, context):
    """Sample pure Lambda function

    Parameters
    ----------
    event: dict, required
        API Gateway Lambda Proxy Input Format

        Event doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html#api-gateway-simple-proxy-for-lambda-input-format

    context: object, required
        Lambda Context runtime methods and attributes

        Context doc: https://docs.aws.amazon.com/lambda/latest/dg/python-context-object.html

    Returns
    ------
    API Gateway Lambda Proxy Output Format: dict

        Return doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html
    """
    body = json.loads(event.get('body'))
    text = body.get('text')
    voice_id = body.get('voice_id')
    output_format = 'mp3'

    try:
        response = polly.synthesize_speech(Text=text, OutputFormat=output_format, VoiceId=voice_id)
    except (BotoCoreError, ClientError) as error:
        print(error)
        return proxy_response(500, error)
    
    if 'AudioStream' in response:
        with closing(response['AudioStream']) as stream:
            encoded_data = base64.b64encode(stream.read())
            # return proxy_response(200, encoded_data.decode('ascii'))
            return proxy_response(200, encoded_data)
    else:
        return proxy_response(500, 'Failed to get audio data from proxy')
import json
import boto3
import os
import logging
import time

logger = logging.getLogger()
logger.setLevel(logging.INFO)

personalize_events = boto3.client('personalize-events')
personalize_runtime = boto3.client('personalize-runtime')


def get_recommendation(event, context):

    logger.info(os.environ.get('PERSONALIZE_CAMPAIGN_ARN'))
    logger.info(event['pathParameters']['userId'])
    response = personalize_runtime.get_recommendations(
        campaignArn=os.environ.get('PERSONALIZE_CAMPAIGN_ARN'),
        userId=event['pathParameters']['userId']
    )

    result = {
        'userId': event['pathParameters']['userId'],
        'recommendations': [o["itemId"] for o in response['itemList']]
    }

    return {
        'statusCode': 200,
        'body': json.dumps(result)
    }


def record_event(event, context):
    payload = json.loads(event['body'])
    personalize_events.put_events(
        trackingId=os.environ.get('PERSONALIZE_TRACKING_ID'),
        userId=event['pathParameters']['userId'],
        sessionId=payload['sessionId'],
        eventList=[{
            'sentAt': int(time.time()),
            'eventType': 'CLICK',
            'properties': json.dumps({"itemId": payload["itemId"]})
        }]
    )
    return {
        'statusCode': 200
    }

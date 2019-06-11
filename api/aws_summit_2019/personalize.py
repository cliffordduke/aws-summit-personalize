import json
import boto3
import os
import logging
import time
from boto3.dynamodb.conditions import Key, Attr

logger = logging.getLogger()
logger.setLevel(logging.INFO)

personalize_events = boto3.client('personalize-events')
personalize_runtime = boto3.client('personalize-runtime')
dynamodb = boto3.resource('dynamodb')


def get_personalize_recommendation(userId):
    response = personalize_runtime.get_recommendations(
        campaignArn=os.environ.get('PERSONALIZE_CAMPAIGN_ARN'),
        userId=userId,
        numResults=100
    )

    recommendation = [int(o["itemId"]) for o in response['itemList']]

    already_liked_response = dynamodb.Table('movie_likes').query(
        KeyConditionExpression=Key('userId').eq(int(userId))
    )

    already_liked = [int(o['movieId'])
                     for o in already_liked_response['Items']]

    filtered_results = list(filter(
        lambda x: x not in already_liked, recommendation))

    return filtered_results


def get_recommendation(event, context):

    logger.info(os.environ.get('PERSONALIZE_CAMPAIGN_ARN'))
    logger.info(event['pathParameters']['userId'])

    recommendation = get_personalize_recommendation(
        event['pathParameters']['userId'])

    result = {
        'userId': event['pathParameters']['userId'],
        'recommendations': recommendation[:30]
    }

    return {
        'statusCode': 200,
        'headers': {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*"
        },
        'body': json.dumps(result)
    }


def record_event(event, context):
    payload = json.loads(event['body'])
    userId = event['pathParameters']['userId']

    # Record previous Recommendation First
    last_recommendation = get_personalize_recommendation(userId)

    dynamodb.Table('user_recommendation_history').put_item(
        Item={
            'userId': int(userId),
            'timestamp': int(time.time()),
            'recommendation': last_recommendation
        }
    )

    for itemId in payload["itemIds"]:
        personalize_events.put_events(
            trackingId=os.environ.get('PERSONALIZE_TRACKING_ID'),
            userId=userId,
            sessionId=payload['sessionId'],
            eventList=[{
                'sentAt': int(time.time()),
                'eventType': 'CLICK',
                'properties': json.dumps({"itemId": str(itemId)})
            }]
        )

    with dynamodb.Table('movie_likes').batch_writer() as batch:
        for itemId in payload["itemIds"]:
            batch.put_item(Item={
                "userId": int(userId),
                "movieId": int(itemId),
                "timestamp": int(time.time())
            })

    return {
        'headers': {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*"
        },
        'statusCode': 200
    }

from __future__ import print_function # Python 2/3 compatibility
import boto3
import json
import decimal

class DecimalEncoder(json.JSONEncoder):
    def default(self, o):
        if isinstance(o, decimal.Decimal):
            if o % 1 > 0:
                return float(o)
            else:
                return int(o)
        return super(DecimalEncoder, self).default(o)

dynamodb = boto3.resource('dynamodb')

table = dynamodb.Table('Questions')

def lambda_handler(event, context):
    try:
        response = table.get_item(
            Key={
                'QuestionId': 1
            }
        )
    except Exception as e:
        print(e.response['Error']['Message'])
    else:
        item = response['Item']
        result = {
            'headers': {
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps(item, indent=4, cls=DecimalEncoder)
        }

        return result

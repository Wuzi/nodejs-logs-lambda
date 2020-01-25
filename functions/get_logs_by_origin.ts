'use strict'

import { DynamoDB } from 'aws-sdk'

const dynamoDb = new DynamoDB.DocumentClient()

module.exports.get = (
  event: any,
  context: any,
  callback: (arg0: any, arg1: any) => void
) => {
  const { queryStringParameters } = event

  const params = {
    TableName: process.env.DYNAMODB_TABLE,
    ExpressionAttributeValues: {
      ":origin": queryStringParameters.origin
    },
    FilterExpression: "origin = :origin"
  };

  dynamoDb.scan(params, function (err, data) {
    if (err) {
      console.log(err);

      const response = {
        statusCode: 500
      }
      callback(null, response)
    } else {
      const response = {
        statusCode: 200,
        body: JSON.stringify(data)
      }
      callback(null, response)
    }
  })
}

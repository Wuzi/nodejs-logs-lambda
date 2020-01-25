import { APIGatewayProxyEvent, Callback, Context } from 'aws-lambda'
import { DynamoDB } from 'aws-sdk'

const dynamoDb = new DynamoDB.DocumentClient()

/**
 * This functions fetches all logs by type from DynamoDB
 * 
 * @param {APIGatewayProxyEvent} event Data received from the lambda
 * @param {Context} context Current context of the function
 * @param {Callback} callback Callback to return response or error
 */
module.exports.getByType = (
  event: APIGatewayProxyEvent,
  context: Context,
  callback: Callback
) => {
  const { queryStringParameters } = event

  // Check if type parameter is present in query string parameters
  if (!queryStringParameters || !queryStringParameters.type) {
    const response = {
      statusCode: 400,
      body: JSON.stringify({
        message: 'Query string paramter "type" is required'
      })
    }
    callback(null, response)
    return
  }

  // Create dynamoDB scan param
  const params = {
    TableName: process.env.DYNAMODB_TABLE as string,
    ExpressionAttributeValues: {
      ":logType": queryStringParameters.type
    },
    ExpressionAttributeNames: {
      "#logType": "type"
    },
    FilterExpression: "#logType = :logType"
  }

  // Fetch dynamodb for data
  dynamoDb.scan(params, function (err, data) {
    if (err) {
      const response = {
        statusCode: 500,
        body: JSON.stringify(err)
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

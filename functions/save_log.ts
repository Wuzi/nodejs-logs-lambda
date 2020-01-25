import { Callback, Context, SQSEvent } from 'aws-lambda'
import { DynamoDB } from 'aws-sdk'

const dynamoDb = new DynamoDB.DocumentClient()

/**
 * This functions listen for new messages in amazon SQS and save them in dynamoDB
 * 
 * @param {SQSEvent} event Data received from the lambda
 * @param {Context} context Current context of the function
 * @param {Callback} callback Callback to return response or error
 */
module.exports.save = (
  event: SQSEvent,
  context: Context,
  callback: Callback
) => {
  for (const record of event.Records) {
    const body = JSON.parse(record.body)

    const params = {
      TableName: process.env.DYNAMODB_TABLE as string,
      Item: {
        id: record.messageId,
        ...body
      }
    }

    dynamoDb.put(params, (error, result) => {
      if (error) {
        console.error(error)
      }

      context.done(undefined, '')
    })
  }
}

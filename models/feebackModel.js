const AWS = require('aws-sdk');
const FeedbackItemSchema = require('../schemas/feedbackSchema');

const isOffline = process.env.IS_OFFLINE === "true" || process.env.NODE_ENV === 'development';

const dynamoDb = new AWS.DynamoDB.DocumentClient(
    isOffline
    ? {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        region: process.env.AWS_REGION,
      }
    : {} // In Lambda, use IAM role
);

const FeedBackModelCreate = async (feedbackContent) => {
    try {
     await dynamoDb.put(feedbackContent).promise();
        return { status: 201, message: "FeedBack Successfully Created", data: feedbackContent.Item };
    } catch (err) {
        console.log(err);
       return  {status : 500 , message: "Internal Server Error", error : err}
    }
}

const FeedBackModelRead = async (tableName) => {
    const params = {
        TableName: tableName,
    };
    try {
        const data = await dynamoDb.scan(params).promise();
        return { status: 200, message: "Feedback retrieved successfully", data: data.Items };
    } catch (err) {
        console.log(err);
        return { status: 500, message: 'Internal Server Error', error: err };
    }
};

const FeedBackModelUpdate = async (id, updateData) => {
    const params = {
        TableName: 'Feedback',
        Key: {
            id: id,
        },
        UpdateExpression: 'SET ',
        ExpressionAttributeNames: {},
        ExpressionAttributeValues: {},
        ReturnValues: 'UPDATED_NEW',
    };

    let prefix = "";
    for (const key in updateData) {
        if (updateData.hasOwnProperty(key)) {
            params.UpdateExpression += `${prefix}#${key} = :${key}`;
            params.ExpressionAttributeNames[`#${key}`] = key;
            params.ExpressionAttributeValues[`:${key}`] = updateData[key];
            prefix = ", ";
        }
    }

    if (prefix === "") { 
        return { status: 400, message: "No update data provided" };
    }

    try {
        const data = await dynamoDb.update(params).promise();
        return { status: 200, message: "Feedback updated successfully", data: data.Attributes };
    } catch (err) {
        console.log(err);
        return { status: 500, message: 'Internal Server Error', error: err };
    }
};

const FeedBackModelDelete = async(id)=>{
    const params ={
        TableName:'Feedback',
        Key:{
            id: id
        },
        ReturnValues: 'ALL_OLD'
    }
    try{
        const data = await dynamoDb.delete(params).promise();
        return {status: 200, message: "FeedBack Deleted Successfully",data: data.Attributes}
    }catch(err){
        console.log(err)
        return {status : 500 , message :'Internal Server Error', error: err}
    }
}

module.exports = { FeedBackModelCreate, FeedBackModelRead, FeedBackModelUpdate, FeedBackModelDelete };


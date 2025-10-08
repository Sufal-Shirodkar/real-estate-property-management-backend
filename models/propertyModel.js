require('dotenv').config();

const AWS = require('aws-sdk');

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

const PropertyModelCreate = async (propertyContent,user) => {
    try {
        if(user.role === "user"){
          return { status: 401, message: "UnAuthorized", error: "UnAuthorized" };
        }
        await dynamoDb.put(propertyContent).promise();
        return { status: 201, message: "Property Successfully Created", data: propertyContent.Item };
    } catch (err) {
        console.log(err);
        return { status: 500, message: "Internal Server Error", error: err };
    }
}

const PropertyModelUploadPhotos = async (uploadParams) => {
    try {

    const isOffline = process.env.IS_OFFLINE === "true";
        // Configure S3 - use explicit credentials locally, IAM role when deployed
        // const s3Config = {
        //     accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        //     secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        //     region: process.env.AWS_REGION
        // };
       
        const s3 = new AWS.S3(
            isOffline
            ? {
                accessKeyId: process.env.AWS_ACCESS_KEY_ID,
                secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
                region: process.env.AWS_REGION,
              }
            : {} // In Lambda, use IAM role
        );
        
        // Direct upload with proper error handling
        const uploadResult = await s3.upload({
            Bucket: uploadParams.Bucket,
            Key: uploadParams.Key,
            Body: uploadParams.Body,
            ContentType: uploadParams.ContentType
            // Using bucket policy for public access instead of ACLs
        }).promise();
        
        return { 
            status: 201, 
            message: "Photo Successfully Uploaded", 
            data: uploadResult 
        };
    } catch (err) {
        console.error('S3 upload error:', err);
        return { 
            status: 500, 
            message: "S3 Upload Failed", 
            error: err.message 
        };
    }
}

const PropertyModelRead = async () => {
    const params = {
        TableName: "Property",
    }
    try {
        const data = await dynamoDb.scan(params).promise();
        return { status: 200, message: "Property retrieved successfully", data: data.Items};
    } catch (err) {
        console.log(err);
        return { status: 500, message: "Internal Server Error", error: err };
    }
}

const PropertyModelReadById = async (id) => {
    const params = {
        TableName: "Property",
        Key: { id: id }
    }
    try{
        const data = await dynamoDb.get(params).promise();
        if(!data.Item){
            return { status: 404, message: "Property not found" ,data:null};
        }
        return { status: 200, message: "Property retrieved successfully", data: data.Item };
    }catch(err){
        console.log(err);
        return { status: 500, message: "Internal Server Error", error: err };
    }
}

module.exports = { PropertyModelCreate, PropertyModelUploadPhotos, PropertyModelRead, PropertyModelReadById }
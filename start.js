const express = require('express');
require('dotenv').config();
const AWS = require('aws-sdk');
const cors = require('cors');
const router = require('./router/router');
const { testAWSConnection } = require('./test-aws-connection');

// Only configure AWS credentials locally - in deployed environment, use IAM role
const isOffline = process.env.IS_OFFLINE === "true" || process.env.NODE_ENV === 'development';
if (isOffline) {
    AWS.config.update({
        region: process.env.AWS_REGION,
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    });
    console.log('Running locally - using explicit AWS credentials');
} else {
    // In Lambda, AWS SDK will automatically use IAM role credentials
    console.log('Running in deployed environment - using IAM role credentials');
}


const port = process.env.PORT || 8000;


// check env variables
testAWSConnection();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/',router);

app.listen( port ,()=>{
    console.log("Server is running on port 8000")
})

module.exports = app;


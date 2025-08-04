const AWS = require('aws-sdk');
require('dotenv').config();

// Test AWS connection
async function testAWSConnection() {
    try {
        console.log('Testing AWS credentials...');
        console.log('AWS_REGION:', process.env.AWS_REGION);
        console.log('AWS_ACCESS_KEY_ID:', process.env.AWS_ACCESS_KEY_ID ? 'Set' : 'Not set');
        console.log('AWS_SECRET_ACCESS_KEY:', process.env.AWS_SECRET_ACCESS_KEY ? 'Set' : 'Not set');

        const s3 = new AWS.S3({
            region: process.env.AWS_REGION,
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
        });

        // List buckets to test connection
        const buckets = await s3.listBuckets().promise();
        console.log('✅ AWS connection successful!');
        console.log('Available buckets:', buckets.Buckets.map(b => b.Name));
    } catch (error) {
        console.log('❌ AWS connection failed:', error.message);
    }
}

module.exports = { testAWSConnection };

const AWS = require('aws-sdk');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const UserSchema = require("../schemas/userSchema");

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

// JWT secret key - in production, use environment variables
const JWT_SECRET = process.env.JWT_SECRET ;

const UserModelCreate = async (name, email, password) => {
    try {
        // Hash the password before storing
        const saltRounds = 12;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        
        // Create user schema with hashed password
        const user = UserSchema({ name, email, password: hashedPassword });
        
        // Save user to DynamoDB
        await dynamoDb.put(user).promise();
        
        // Generate JWT token
        const token = jwt.sign(
            { 
                id: user.Item.id, 
                email: user.Item.email,
                name: user.Item.name 
            },
            JWT_SECRET,
            { expiresIn: '24h' }
        );
        
        // Return success response with token (excluding password)
        const userResponse = {
            id: user.Item.id,
            name: user.Item.name,
            email: user.Item.email
        };
        
        return { 
            status: 201, 
            message: "User created successfully", 
            data: userResponse,
            token: token
        };
    } catch (error) {
        console.log(error);
        return { status: 500, message: "Internal Server Error", error: error };
    }
}

const UserModelLogin = async (email, password) => {
    try {
        console.log("UserModelLogin called with:", { email, password: password ? "***" : "undefined" });
        
        // Validate input parameters
        if (!email || !password) {
            return { 
                status: 400, 
                message: "Email and password are required", 
                error: "Missing required parameters" 
            };
        }
        
        // Use scan with FilterExpression since email is not the primary key
        const params = {
            TableName: 'User',
            FilterExpression: 'email = :email',
            ExpressionAttributeValues: {
                ':email': email
            }
        };
        
        const result = await dynamoDb.scan(params).promise();
        
        if (result.Items.length === 0) {
            return { status: 401, message: "User not found", error: "Email or password is incorrect" };
        }
        
        const user = result.Items[0];
        
        // Verify password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        
        if (isPasswordValid) {
            // Generate JWT token for successful login
            const token = jwt.sign(
                { 
                    id: user.id, 
                    email: user.email,
                    name: user.name 
                },
                JWT_SECRET,
                { expiresIn: '24h' }
            );
            // Return user data without password
            const userResponse = {
                id: user.id,
                name: user.name,
                email: user.email
            };
            
            return { 
                status: 200, 
                message: "Login successful", 
                data: userResponse,
                token: token
            };
        } else {
            return { status: 401, message: "Invalid password", error: "Email or password is incorrect" };
        }
    } catch (error) {
        console.log(error);
        return { status: 500, message: "Internal Server Error", error: error };
    }
}

module.exports = { UserModelCreate, UserModelLogin };